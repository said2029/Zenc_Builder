import AgencyDetails from "@/components/forms/agency-detals";
import UserDetails from "@/components/forms/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: { agencyId: string };
};
export default async function page({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;
  const userDetails = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });
  if (!userDetails) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  })
  if (!agencyDetails) return null;
  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        id={params.agencyId}
        subAccounts={subAccounts}
        userData={userDetails}
      />
    </div>
  );
}
