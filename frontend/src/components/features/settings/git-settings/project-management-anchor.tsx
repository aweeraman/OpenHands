import React from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { BrandButton } from "#/components/features/settings/brand-button";
import { cn } from "#/utils/utils";

// Placeholder API function for linking integration
const linkIntegrationApi = async (integrationName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API call: Linking ${integrationName}`);
      resolve({ success: true });
    }, 1000);
  });

// Placeholder API function for unlinking integration
const unlinkIntegrationApi = async (integrationName: string) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API call: Unlinking ${integrationName}`);
      resolve({ success: true });
    }, 1000);
  });

export function ProjectManagementAnchor() {
  const navigate = useNavigate();
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

  const jiraCloudLinkMutation = useMutation({
    mutationFn: linkIntegrationApi,
    onSuccess: (data, integrationName) => {
      console.log("Jira Cloud linked successfully!");
      navigate(`/settings/integrations/${integrationName}`);
    },
    onError: (error) => {
      console.error("Failed to link Jira Cloud:", error);
    },
  });

  const jiraCloudUnlinkMutation = useMutation({
    mutationFn: unlinkIntegrationApi,
    onSuccess: () => {
      setJiraCloudLinked(false);
      console.log("Jira Cloud unlinked successfully!");
    },
    onError: (error) => {
      console.error("Failed to unlink Jira Cloud:", error);
    },
  });

  const jiraDataCenterLinkMutation = useMutation({
    mutationFn: linkIntegrationApi,
    onSuccess: (data, integrationName) => {
      console.log("Jira Data Center linked successfully!");
      navigate(`/settings/integrations/${integrationName}`);
    },
    onError: (error) => {
      console.error("Failed to link Jira Data Center:", error);
    },
  });

  const jiraDataCenterUnlinkMutation = useMutation({
    mutationFn: unlinkIntegrationApi,
    onSuccess: () => {
      setJiraDataCenterLinked(false);
      console.log("Jira Data Center unlinked successfully!");
    },
    onError: (error) => {
      console.error("Failed to unlink Jira Data Center:", error);
    },
  });

  const linearLinkMutation = useMutation({
    mutationFn: linkIntegrationApi,
    onSuccess: (data, integrationName) => {
      console.log("Linear linked successfully!");
      navigate(`/settings/integrations/${integrationName}`);
    },
    onError: (error) => {
      console.error("Failed to link Linear:", error);
    },
  });

  const linearUnlinkMutation = useMutation({
    mutationFn: unlinkIntegrationApi,
    onSuccess: () => {
      setLinearLinked(false);
      console.log("Linear unlinked successfully!");
    },
    onError: (error) => {
      console.error("Failed to unlink Linear:", error);
    },
  });

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">Project Management</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-white">Jira Cloud</p>
          <BrandButton
            type="button"
            variant={jiraCloudLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              jiraCloudLinked
                ? jiraCloudUnlinkMutation.mutate("Jira Cloud")
                : jiraCloudLinkMutation.mutate("Jira Cloud")
            }
          >
            {jiraCloudLinked ? "Unlink" : "Link"}
          </BrandButton>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white">Jira Data Center</p>
          <BrandButton
            type="button"
            variant={jiraDataCenterLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              jiraDataCenterLinked
                ? jiraDataCenterUnlinkMutation.mutate("Jira Data Center")
                : jiraDataCenterLinkMutation.mutate("Jira Data Center")
            }
          >
            {jiraDataCenterLinked ? "Unlink" : "Link"}
          </BrandButton>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white">Linear</p>
          <BrandButton
            type="button"
            variant={linearLinked ? "secondary" : "primary"}
            className={cn("w-32")}
            onClick={() =>
              linearLinked
                ? linearUnlinkMutation.mutate("Linear")
                : linearLinkMutation.mutate("Linear")
            }
          >
            {linearLinked ? "Unlink" : "Link"}
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
