import { ClientProvisioningWizard } from "@/features/client-provisioning";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { organization, step } = await searchParams;
  const parsed = workspaceIdSchema.safeParse(typeof organization === "string" ? organization : undefined);

  return (
    <ClientProvisioningWizard
      organizationId={parsed.success ? parsed.data : null}
      requestedStep={step === "icp" || step === "bant" ? step : null}
    />
  );
}
