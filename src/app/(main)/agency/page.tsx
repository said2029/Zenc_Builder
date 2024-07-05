import AgenctDetals from "@/components/forms/agency-detals";
import {getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queires";
import { currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await getAuthUserDetails();
  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/sunaccount");
    } else if (user?.role === "AGENCY_ADMIN" || user?.role === "AGENCY_OWNER") {
      if (searchParams.plan) {
        return redirect(
          `/agnecy/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("__")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/agency/${agencyId}`);
    }
  } 
  const authUser = await currentUser();

  return <div>
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <h1 className="text-5xl font-bold mb-12">Create an Agency</h1>
      <AgenctDetals data={{
        companyEmail:authUser?.emailAddresses[0].emailAddress
      }}/>
    </div>
  </div>;
}
