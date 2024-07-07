import BlurPage from "@/components/global/blur-Page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/lib/queires";
import { Link } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import FunnelSettings from "./_components/funnel-setting";
import FunnelSteps from "./_components/funnel-steps";

type Props = {
  params: { funnelId: string; subaccountId: string };
};

const page = async ({ params }: Props) => {
  const funnelPage = await getFunnel(params.funnelId);
  if (!funnelPage)
    return redirect(`/subaccount/${params.subaccountId}/funnels`);
  return (
    <BlurPage>
      <Link
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
        href={`/subaccount/${params.subaccountId}/funnels`}
      >
        Back
      </Link>
      <h1>{funnelPage.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPage}
            subaccountId={params.subaccountId}
            pages={funnelPage.FunnelPages}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={params.subaccountId}
            defaultData={funnelPage}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};
export default page;
