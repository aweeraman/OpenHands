import { useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Trans, useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import { BrandButton } from "#/components/features/settings/brand-button";
import { I18nKey } from "#/i18n/declaration";

// Placeholder API function for allowing integration
const allowIntegrationApi = async (integrationName: string) => {
  if (integrationName === "Linear") {
    const linkRes = await axios.post("/integration/linear/users");
    return linkRes.data;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API call: Allowing ${integrationName}`);
      resolve({ success: true });
    }, 1000);
  });
};

export default function IntegrationAuthScreen() {
  const { integrationName } = useParams<{ integrationName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const allowMutation = useMutation({
    mutationFn: allowIntegrationApi,
    onSuccess: (_, variables) => {
      console.log("Integration allowed successfully!");
      if (variables === "Jira Cloud") {
        localStorage.setItem("jiraCloudLinked", JSON.stringify(true));
      } else if (variables === "Jira Data Center") {
        localStorage.setItem("jiraDataCenterLinked", JSON.stringify(true));
      } else if (variables === "Linear") {
        localStorage.setItem("linearLinked", JSON.stringify(true));
        toast.success("Linear linked successfully!");
      }
      navigate("/settings/integrations");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any, variables) => {
      console.error(`Failed to allow ${variables} integration:`, error);
      if (variables === "Linear") {
        toast.error(
          error?.response?.data?.detail ||
            "Something went wrong while linking.",
        );
      }
      navigate("/settings/integrations");
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
        <h1 className="text-3xl font-bold text-white mb-4">
          {t(I18nKey.INTEGRATION$SPLENDID_TITLE)}
        </h1>
        <p className="text-white mb-4">
          <Trans
            i18nKey={I18nKey.INTEGRATION$ALREADY_INTEGRATED_MESSAGE}
            values={{ integrationName }}
            components={{ b: <b /> }}
          >
            Your organization on <b>{integrationName}</b> is already integrated
            with OpenHands
          </Trans>
        </p>
        <p className="text-white mb-6">
          {t(I18nKey.INTEGRATION$PERMISSION_PROMPT)}
        </p>
        <div className="flex flex-col items-center gap-4">
          <BrandButton
            type="button"
            variant="primary"
            onClick={handleAllow}
            className="w-35"
          >
            {t(I18nKey.BUTTON$ALLOW_INTEGRATION)}
          </BrandButton>
          <BrandButton
            type="button"
            variant="secondary"
            className="w-25"
            onClick={handleCancel}
          >
            {t(I18nKey.BUTTON$CANCEL_INTEGRATION)}
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
