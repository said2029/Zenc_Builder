"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, Plan, SubAccount, User } from "@prisma/client";
import { v4 } from "uuid";

export const getUserAuthDetals = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userData = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};
export const saveActivatyLogNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  description: string;
  subAccountId?: string;
}) => {
  const AuthUser = await currentUser();
  let userData;
  if (!AuthUser) {
    const respons = await db.user.findFirst({
      where: {
        Agency: { SubAccount: { some: { id: subAccountId } } },
      },
    });
    if (respons) {
      userData = respons;
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: AuthUser.emailAddresses[0].emailAddress,
      },
    });
  }

  if (!userData) {
    console.log("Could not find User !");
    return;
  }
  let FoundAgencyId = agencyId;
  if (!FoundAgencyId) {
    if (subAccountId) {
      throw new Error("you need to provide an agency id or sub-Account id");
    }
    const respons = await db.subAccount.findUnique({
      where: {
        id: subAccountId,
      },
    });
    if (respons) {
      FoundAgencyId = respons.agencyId;
    }
    if (subAccountId) {
      await db.notification.create({
        data: {
          notification: `${userData.name} | ${description}`,
          User: {
            connect: {
              id: userData.id,
            },
          },
          Agency: {
            connect: {
              id: FoundAgencyId,
            },
          },
          SubAccount: {
            connect: {
              id: subAccountId,
            },
          },
        },
      });
    }
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: FoundAgencyId,
          },
        },
      },
    });
  }
};

const createTeamUser = async (agency: string, user: User) => {
  if (user.role == "AGENCY_OWNER") return null;
  const respons = await db.user.create({ data: { ...user } });
  return respons;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const invitationExist = await db.invitation.findUnique({
    where: { email: user.emailAddresses[0].emailAddress, status: "PENDING" },
  });
  if (invitationExist) {
    const userDetals = await createTeamUser(invitationExist.agencyId, {
      email: invitationExist.email,
      agencyId: invitationExist.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExist.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivatyLogNotification({
      agencyId: invitationExist?.agencyId,
      description: `User ${user.emailAddresses[0].emailAddress} Accepted your invitation`,
      subAccountId: undefined,
    });
    if (userDetals) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetals.role || "SUBACCOUNF_USER",
        },
      });
      await db.invitation.delete({
        where: {
          email: userDetals.email,
        },
      });
      return userDetals.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.id : null;
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetals: Partial<Agency>
) => {
  const respons = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: {
      ...agencyDetals,
    },
  });

  return respons;
};

export const deleteAgency = async (agencyId: string) => {
  const respons = await db.agency.delete({
    where: {
      id: agencyId,
    },
  });
  return respons;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getNotificationsAndUser = async (agencyId: string) => {
  try {
    const respons = await db.notification.findMany({
      where: {
        agencyId,
      },
      include: {
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return respons;
  } catch (error) {
    console.error(error);
  }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  });
  if (!agencyOwner) return console.log("🔴Erorr could not create subaccount");
  const permissionId = v4();
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
    },
  });
  return response;
};
