/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import { BrandButton } from "#/components/features/settings/brand-button";
import { cn } from "#/utils/utils";
import { I18nKey } from "#/i18n/declaration";

// === Integration-specific placeholder functions ===
const linkJiraCloudIntegration = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("API call: Linking Jira Cloud");
      resolve({ success: true });
    }, 1000);
  });

const unlinkJiraCloudIntegration = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("API call: Unlinking Jira Cloud");
      resolve({ success: true });
    }, 1000);
  });

const linkJiraDataCenterIntegration = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("API call: Linking Jira Data Center");
      resolve({ success: true });
    }, 1000);
  });

const unlinkJiraDataCenterIntegration = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("API call: Unlinking Jira Data Center");
      resolve({ success: true });
    }, 1000);
  });

// const unlinkLinearIntegration = async () => {
//   const response = await axios.post("/integration/linear/unlink");
//   return response.data;
// };

export function ProjectManagementAnchor() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [jiraCloudLinked, setJiraCloudLinked] = React.useState(() => {
    const stored = localStorage.getItem("jiraCloudLinked");
    return stored ? JSON.parse(stored) : false;
  });
  const [jiraDataCenterLinked, setJiraDataCenterLinked] = React.useState(() => {
    const stored = localStorage.getItem("jiraDataCenterLinked");
    return stored ? JSON.parse(stored) : false;
  });
  const [linearLinked, setLinearLinked] = React.useState(() => {
    const stored = localStorage.getItem("linearLinked");
    return stored ? JSON.parse(stored) : false;
  });

  React.useEffect(() => {
    localStorage.setItem("jiraCloudLinked", JSON.stringify(jiraCloudLinked));
  }, [jiraCloudLinked]);

  React.useEffect(() => {
    localStorage.setItem(
      "jiraDataCenterLinked",
      JSON.stringify(jiraDataCenterLinked),
    );
  }, [jiraDataCenterLinked]);

  React.useEffect(() => {
    localStorage.setItem("linearLinked", JSON.stringify(linearLinked));
  }, [linearLinked]);

  // ✅ Fetch Linear user status on page load
  React.useEffect(() => {
    const fetchLinearUser = async () => {
      try {
        const res = await axios.get("/integration/linear/users/me");
        const { status } = res.data;
        setLinearLinked(status === "active");
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setLinearLinked(false);
        } else {
          toast.error(
            error?.response?.data?.detail || "Failed to fetch Linear status",
          );
        }
      }
    };
    fetchLinearUser();
  }, []);

  // === Mutations ===

  const jiraCloudLinkMutation = useMutation({
    mutationFn: linkJiraCloudIntegration,
    onSuccess: () => {
      console.log("Jira Cloud linked successfully!");
      navigate("/settings/integrations/Jira Cloud");
    },
    onError: (error) => {
      console.error("Failed to link Jira Cloud:", error);
    },
  });

  const jiraCloudUnlinkMutation = useMutation({
    mutationFn: unlinkJiraCloudIntegration,
    onSuccess: () => {
      setJiraCloudLinked(false);
      console.log("Jira Cloud unlinked successfully!");
    },
    onError: (error) => {
      console.error("Failed to unlink Jira Cloud:", error);
    },
  });

  const jiraDataCenterLinkMutation = useMutation({
    mutationFn: linkJiraDataCenterIntegration,
    onSuccess: () => {
      console.log("Jira Data Center linked successfully!");
      navigate("/settings/integrations/Jira Data Center");
    },
    onError: (error) => {
      console.error("Failed to link Jira Data Center:", error);
    },
  });

  const jiraDataCenterUnlinkMutation = useMutation({
    mutationFn: unlinkJiraDataCenterIntegration,
    onSuccess: () => {
      setJiraDataCenterLinked(false);
      console.log("Jira Data Center unlinked successfully!");
    },
    onError: (error) => {
      console.error("Failed to unlink Jira Data Center:", error);
    },
  });

  const linearLinkMutation = useMutation({
    mutationFn: () => axios.get("/integration/linear/validate"),
    onSuccess: () => {
      navigate("/settings/integrations/Linear");
    },
    onError: (error: any) => {
      console.error("Failed to validate Linear integration:", error);
      toast.error(
        error?.response?.data?.detail ||
          "Something went wrong while validating Linear integration.",
      );
    },
  });

  const unlinkLinearIntegration = async () => {
    const response = await axios.post("/integration/linear/unlink");
    return response.data;
  };

  const linearUnlinkMutation = useMutation({
    mutationFn: unlinkLinearIntegration,
    onSuccess: () => {
      setLinearLinked(false); // ✅ Update button state
      toast.success("Linear unlinked successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to unlink Linear:", error);
      const detailMessage =
        error?.response?.data?.detail ||
        "Something went wrong while unlinking.";
      toast.error(detailMessage);
    },
  });

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">
        {t(I18nKey.INTEGRATIONS$PROJECT_MANAGEMENT)}
      </h2>
      <div className="flex flex-col gap-4">
        {/* Jira Cloud */}
        <div className="flex items-center justify-between">
          <p className="text-white">{t(I18nKey.INTEGRATION$JIRA_CLOUD)}</p>
          <BrandButton
            type="button"
            variant={jiraCloudLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              jiraCloudLinked
                ? jiraCloudUnlinkMutation.mutate()
                : jiraCloudLinkMutation.mutate()
            }
          >
            {jiraCloudLinked
              ? t(I18nKey.BUTTON$UNLINK_INTEGRATION)
              : t(I18nKey.BUTTON$LINK_INTEGRATION)}
          </BrandButton>
        </div>

        {/* Jira Data Center */}
        <div className="flex items-center justify-between">
          <p className="text-white">
            {t(I18nKey.INTEGRATION$JIRA_DATA_CENTER)}
          </p>
          <BrandButton
            type="button"
            variant={jiraDataCenterLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              jiraDataCenterLinked
                ? jiraDataCenterUnlinkMutation.mutate()
                : jiraDataCenterLinkMutation.mutate()
            }
          >
            {jiraDataCenterLinked
              ? t(I18nKey.BUTTON$UNLINK_INTEGRATION)
              : t(I18nKey.BUTTON$LINK_INTEGRATION)}
          </BrandButton>
        </div>

        {/* Linear */}
        <div className="flex items-center justify-between">
          <p className="text-white">{t(I18nKey.INTEGRATION$LINEAR)}</p>
          <BrandButton
            type="button"
            variant={linearLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              linearLinked
                ? linearUnlinkMutation.mutate()
                : linearLinkMutation.mutate()
            }
          >
            {linearLinked
              ? t(I18nKey.BUTTON$UNLINK_INTEGRATION)
              : t(I18nKey.BUTTON$LINK_INTEGRATION)}
          </BrandButton>
        </div>
      </div>
    </div>
  );
}

export function LinearIntegrationConfirmation() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const linearAllowMutation = useMutation({
    mutationFn: async () => {
      const linkRes = await axios.post("/integration/linear/users");
      return linkRes.data;
    },
    onSuccess: () => {
      toast.success("Linear linked successfully!");
      navigate("/settings/integrations");
    },
    onError: (error: any) => {
      console.error("Failed to link Linear:", error);
      toast.error(
        error?.response?.data?.detail || "Something went wrong while linking.",
      );
      navigate("/settings/integrations");
    },
  });

  const handleCancel = () => {
    navigate("/settings/integrations");
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">
        {t(I18nKey.INTEGRATION$LINEAR)}
      </h2>
      <p className="text-white mb-4">
        Allow OpenHands to access your Linear account to integrate with your
        projects.
      </p>
      <div className="flex gap-4">
        <BrandButton
          onClick={() => linearAllowMutation.mutate()}
          isDisabled={linearAllowMutation.isPending}
          variant="secondary"
          type={undefined}
        >
          {linearAllowMutation.isPending ? "Allowing..." : "Allow"}
        </BrandButton>
        <BrandButton
          onClick={handleCancel}
          variant="secondary"
          type={undefined}
        >
          Cancel
        </BrandButton>
      </div>
    </div>
  );
}
