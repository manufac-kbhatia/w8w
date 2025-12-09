"use client";
import { Button, Card, Group, Stack } from "@mantine/core";
import { createWorkflow } from "@/utils";
import { useEffect, useState } from "react";
import { Workflow } from "@w8w/db/prisma-browser";
import axios from "axios";
import Link from "next/link";
import LoadingSkeleton from "../loadingSkeleton";

export const Workflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  useEffect(() => {
    const getWorkflow = async () => {
      setLoadingWorkflows(true);
      const { data } = await axios.get<{ workflows: Workflow[] }>(
        `/api/workflow`,
      );
      setLoadingWorkflows(false);
      setWorkflows(data.workflows);
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
              withBorder
              shadow="xs"
              className="border-2 transition-all duration-200 hover:scale-101 hover:shadow-lg cursor-pointer"
              style={{ cursor: "pointer" }}
              key={workflow.id}
            >
              <Link
                href={{
                  pathname: `/workflow/${workflow.id}`,
                  query: { name: workflow.name },
                }}
                className="text-xl font-bold"
              >
                {workflow.id}
              </Link>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
