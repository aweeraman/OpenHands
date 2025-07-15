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

export function ProjectManagementAnchor() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // const projectManagementShouldRender = true;
  const jiraShouldRender = true;
  const jiraDataCenterShouldRender = true;
  const linearShouldRender = true;

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

  React.useEffect(() => {
    const fetchJiraCloudUser = async () => {
      try {
        const res = await axios.get("/integration/jira/users/me");
        if (res.status === 200) {
          const { status } = res.data;
          console.log("Jira Cloud user status:", status);
          setJiraCloudLinked(status === "active");
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setJiraCloudLinked(false);
        } else {
          toast.error(
            error?.response?.data?.detail ||
              "Failed to fetch Jira Cloud status",
          );
        }
      }
    };
    fetchJiraCloudUser();
  }, []);

  React.useEffect(() => {
    const fetchJiraDataCenterUser = async () => {
      try {
        const res = await axios.get("/integration/jira-dc/users/me");
        if (res.status === 200) {
          const { status } = res.data;
          console.log("Jira Data Center user status:", status);
          setJiraDataCenterLinked(status === "active");
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setJiraDataCenterLinked(false);
        } else {
          toast.error(
            error?.response?.data?.detail ||
              "Failed to fetch Jira Data Center status",
          );
        }
      }
    };
    fetchJiraDataCenterUser();
  }, []);

  React.useEffect(() => {
    const fetchLinearUser = async () => {
      try {
        const res = await axios.get("/integration/linear/users/me");
        if (res.status === 200) {
          const { status } = res.data;
          console.log("Linear user status:", status);
          setLinearLinked(status === "active");
        }
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

  const jiraCloudLinkMutation = useMutation({
    mutationFn: () => axios.get("/integration/jira/validate"),
    onSuccess: () => {
      navigate("/settings/integrations/Jira");
    },
    onError: (error: any) => {
      console.error("Failed to validate Jira Cloud integration:", error);
      toast.error(
        error?.response?.data?.detail ||
          "Something went wrong while validating Jira Cloud integration.",
      );
    },
  });

  const unlinkJiraCloudIntegration = async () => {
    const response = await axios.post("/integration/jira/unlink");
    return response.data;
  };

  const jiraCloudUnlinkMutation = useMutation({
    mutationFn: unlinkJiraCloudIntegration,
    onSuccess: () => {
      setJiraCloudLinked(false);
      toast.success("Jira Cloud unlinked successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to unlink Jira Cloud:", error);
      const detailMessage =
        error?.response?.data?.detail ||
        "Something went wrong while unlinking.";
      toast.error(detailMessage);
    },
  });

  // const jiraDataCenterLinkMutation = useMutation({
  //   mutationFn: linkJiraDataCenterIntegration,
  //   onSuccess: () => {
  //     console.log("Jira Data Center linked successfully!");
  //     navigate("/settings/integrations/Jira Data Center");
  //   },
  //   onError: (error) => {
  //     console.error("Failed to link Jira Data Center:", error);
  //   },
  // });

  const jiraDataCenterLinkMutation = useMutation({
    mutationFn: () => axios.get("/integration/jira-dc/validate"),
    onSuccess: () => {
      navigate("/settings/integrations/Jira Data Center");
    },
    onError: (error: any) => {
      console.error("Failed to validate Jira Data Center integration:", error);
      toast.error(
        error?.response?.data?.detail ||
          "Something went wrong while validating Jira Data Center integration.",
      );
    },
  });

  // const jiraDataCenterUnlinkMutation = useMutation({
  //   mutationFn: unlinkJiraDataCenterIntegration,
  //   onSuccess: () => {
  //     setJiraDataCenterLinked(false);
  //     console.log("Jira Data Center unlinked successfully!");
  //   },
  //   onError: (error) => {
  //     console.error("Failed to unlink Jira Data Center:", error);
  //   },
  // });

  const unlinkJiraDataCenterIntegration = async () => {
    const response = await axios.post("/integration/jira-dc/unlink");
    return response.data;
  };

  const jiraDataCenterUnlinkMutation = useMutation({
    mutationFn: unlinkJiraDataCenterIntegration,
    onSuccess: () => {
      setJiraDataCenterLinked(false);
      toast.success("Jira Data Center unlinked successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to unlink Jira Data Center:", error);
      const detailMessage =
        error?.response?.data?.detail ||
        "Something went wrong while unlinking.";
      toast.error(detailMessage);
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
      setLinearLinked(false);
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
        {jiraShouldRender && (
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
        )}

        {/* Jira Data Center */}
        {jiraDataCenterShouldRender && (
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
        )}

        {/* Linear */}
        {linearShouldRender && (
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
        )}
      </div>
    </div>
  );
}
