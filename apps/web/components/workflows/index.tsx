"use client";
import { Button, Card, Group, Stack, Title } from "@mantine/core";
import { createWorkflow } from "@/utils";
import { useEffect, useState } from "react";
import { Workflow } from "@w8w/db/prisma-browser";
import { redirect } from "next/navigation";
import axios from "axios";

export const Workflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  useEffect(() => {
    const getWorkflow = async () => {
      const { data } = await axios.get<{ workflows: Workflow[] }>(
        `/api/workflow`,
      );
      setWorkflows(data.workflows);
    };

    getWorkflow();
  }, []);
  return (
    <Stack>
      <Group justify="flex-end">
        <Button onClick={createWorkflow}>Create Workflow</Button>
      </Group>
      <Stack gap={4}>
        {workflows.map((workflow) => (
          <Card
            withBorder
            shadow="xs"
            className="border-2 transition-all duration-200 hover:scale-101 hover:shadow-lg cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => redirect(`/workflow/${workflow.id}`)}
            key={workflow.id}
          >
            <Title order={1}>{workflow.id}</Title>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
