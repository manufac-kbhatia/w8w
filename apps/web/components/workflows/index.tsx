"use client";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  checkMannualTriggerExist,
  createWorkflow,
  formatUpdatedAt,
  transformNodes,
} from "@/utils";
import { useEffect, useState } from "react";
import { Workflow } from "@w8w/db/prisma-browser";
import axios from "axios";
import Link from "next/link";
import LoadingSkeleton from "../loadingSkeleton";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export const Workflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const theme = useMantineTheme();

  const deleteWorkflow = async (id: string) => {
    const response = await axios.delete(`/api/workflow/${id}`);

    if (response.data.success) {
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    }
  };

  useEffect(() => {
    const getWorkflow = async () => {
      setLoadingWorkflows(true);
      const response = await axios.get<{
        success: boolean;
        data: { workflows: Workflow[] };
      }>(`/api/workflow`);
      setLoadingWorkflows(false);
      setWorkflows(response.data.data.workflows);
    };

    getWorkflow();
  }, []);

  return (
    <Stack>
      <Group justify="flex-end">
        <Button onClick={createWorkflow}>Create Workflow</Button>
      </Group>
      {loadingWorkflows ? (
        <LoadingSkeleton lenght={5} height={70} />
      ) : (
        <Stack gap={4}>
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              withBorder
              shadow="xs"
              className="border-2 transition-all duration-200 hover:scale-101 hover:shadow-lg cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" align="center">
                <Link
                  key={workflow.id}
                  href={{
                    pathname: `/workflow/${workflow.id}`,
                    query: { name: workflow.name },
                  }}
                >
                  <Stack gap={0}>
                    <Title order={1}>{workflow.name}</Title>
                    <Group>
                      <Text>
                        Last updated at {formatUpdatedAt(workflow.updatedAt)}
                      </Text>
                      <Divider orientation="vertical" size="sm" />
                      <Text>
                        Created at {formatUpdatedAt(workflow.createdAt)}
                      </Text>
                    </Group>
                  </Stack>
                </Link>
                <Group>
                  <Tooltip
                    color={theme.primaryColor}
                    label={
                      checkMannualTriggerExist(transformNodes(workflow.nodes))
                        ? "Click to start the execution"
                        : "No Mannual trigger to found"
                    }
                  >
                    <Button
                      disabled={
                        !checkMannualTriggerExist(
                          transformNodes(workflow.nodes),
                        )
                      }
                      size="compact-md"
                    >
                      Execute
                    </Button>
                  </Tooltip>
                  <ActionIcon
                    size="md"
                    radius="md"
                    variant="light"
                    onClick={() =>
                      redirect(`/workflow/${workflow.id}?name=${workflow.name}`)
                    }
                  >
                    <IconEdit size={20} />
                  </ActionIcon>
                  <ActionIcon
                    size="md"
                    radius="md"
                    variant="light"
                    onClick={() => deleteWorkflow(workflow.id)}
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
