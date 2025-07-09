import { useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { BrandButton } from "#/components/features/settings/brand-button";

// Placeholder API function for allowing integration
const allowIntegrationApi = async (integrationName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API call: Allowing ${integrationName}`);
      resolve({ success: true });
    }, 1000);
  });

export default function IntegrationAuthScreen() {
  const { integrationName } = useParams<{ integrationName: string }>();
  const navigate = useNavigate();

  const allowMutation = useMutation({
    mutationFn: allowIntegrationApi,
    onSuccess: () => {
      console.log("Integration allowed successfully!");
      if (integrationName === "Jira Cloud") {
        localStorage.setItem("jiraCloudLinked", JSON.stringify(true));
      } else if (integrationName === "Jira Data Center") {
        localStorage.setItem("jiraDataCenterLinked", JSON.stringify(true));
      } else if (integrationName === "Linear") {
        localStorage.setItem("linearLinked", JSON.stringify(true));
      }
      navigate("/settings/integrations");
    },
    onError: (error) => {
      console.error("Failed to allow integration:", error);
    },
  });

  const handleAllow = () => {
    allowMutation.mutate(integrationName as string);
  };

  const handleCancel = () => {
    navigate("/settings/integrations");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-[#454545] p-8 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Splendid!</h1>
        <p className="text-white mb-4">
          Your organization on {integrationName} is already integrated with
          OpenHands
        </p>
        <p className="text-white mb-6">
          Do you want to allow the OpenHands agent to perform actions on your
          behalf?
        </p>
        <div className="flex flex-col items-center gap-4">
          <BrandButton
            type="button"
            variant="primary"
            onClick={handleAllow}
            className="w-35"
          >
            Allow
          </BrandButton>
          <BrandButton
            type="button"
            variant="secondary"
            className="w-25"
            onClick={handleCancel}
          >
            Cancel
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
