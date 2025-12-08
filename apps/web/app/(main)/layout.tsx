"use client";
import ThemeToggle from "@/components/themeToggler";
import { createWorkflow, CustomNodeType, TABS } from "@/utils";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Breadcrumbs,
  Button,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAutomaticGearboxFilled,
  IconHome,
  IconKey,
  IconPlus,
  IconProgressCheck,
  IconRoute,
} from "@tabler/icons-react";
import { NodeType } from "@w8w/db/prisma-browser";
import { useReactFlow } from "@xyflow/react";
import axios from "axios";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const router = useRouter();
  const theme = useMantineTheme();
  const { id } = useParams<{ id: string }>();
  const { getNodes, getEdges } = useReactFlow();
  const params = useSearchParams();

  const [workflowName, setWorkflowName] = useState<string>(
    params.get("name") ?? "untitled-workflow"
  );

  const [nameInputVariant, toggleNameInputVariant] = useToggle([
    "unstyled",
    "default",
  ]);

  const handleSave = async () => {
    const nodesToTransform = getNodes() as CustomNodeType[];

    const transformedNodes = nodesToTransform.map((node) => {
      if (node.type === NodeType.CUSTOM) {
        return {
          id: node.id,
          name: node.data.nodeSchema?.name,
          type: node.type,
          data: node.data,
          position: node.position as { x: number; y: number },
        };
      }
    });

    const transformedEdges = getEdges().map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? "main",
      targetHandle: edge.targetHandle ?? "main",
    }));

    const saveWorkflow = {
      id,
      name: workflowName,
      nodes: transformedNodes,
      connections: transformedEdges,
    };

    notifications.show({
      title: (
        <Group>
          <Text>Saving Workflow...</Text>
          <Loader size="xs" />
        </Group>
      ),
      message: `Saving your workflow with id: ${id}`,
    });

    await axios.put("/api/workflow", saveWorkflow, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    notifications.clean();
    notifications.show({
      title: "Workflow Saved Successfully",
      message: `Your workflow (ID: ${id}) has been saved and is now up to date.`,
    });
  };

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 70, breakpoint: "xs" }}
      padding={10}
    >
      <AppShell.Header p="md">
        <Group justify="space-between">
          <Group>
            <ThemeIcon variant="light" size="xl">
              <IconAutomaticGearboxFilled />
            </ThemeIcon>
            {path.startsWith("/workflow") && (
              <Breadcrumbs separator="/" separatorMargin={4} mt="xs">
                <Anchor href={`/?tab=${TABS.workflow}`} size="lg">
                  workflow
                </Anchor>
                <TextInput
                  size="md"
                  variant={nameInputVariant}
                  onClick={() => toggleNameInputVariant("default")}
                  onBlur={() => toggleNameInputVariant("unstyled")}
                  value={workflowName}
                  onChange={(event) =>
                    setWorkflowName(event.currentTarget.value)
                  }
                />
              </Breadcrumbs>
            )}
          </Group>
          <Group>
            {id && <Button onClick={handleSave}>Save</Button>}
            <ThemeToggle />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack>
          <ThemeIcon variant="transparent">
            <IconAutomaticGearboxFilled />
          </ThemeIcon>
          <Tooltip
            label="Home"
            transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
            color={theme.primaryColor}
          >
            <ActionIcon variant="light">
              <IconHome size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label="Create Workflow"
            transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
            color={theme.primaryColor}
          >
            <ActionIcon
              variant="light"
              onClick={createWorkflow}
              disabled={path.startsWith("/workflow")}
            >
              <IconPlus size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label="Workflows"
            transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
            color={theme.primaryColor}
          >
            <ActionIcon
              variant="light"
              onClick={() => router.push(`/?tab=${TABS.workflow}`)}
            >
              <IconRoute size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label="Credentials"
            transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
            color={theme.primaryColor}
          >
            <ActionIcon
              variant="light"
              onClick={() => router.push(`/?tab=${TABS.credential}`)}
            >
              <IconKey size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label="Executions"
            transitionProps={{ transition: "pop-bottom-left", duration: 300 }}
            color={theme.primaryColor}
          >
            <ActionIcon
              variant="light"
              onClick={() => router.push(`/?tab=${TABS.executions}`)}
            >
              <IconProgressCheck size={20} />
            </ActionIcon>
          </Tooltip>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          height: "100vh",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
