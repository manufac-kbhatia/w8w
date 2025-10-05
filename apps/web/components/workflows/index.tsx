"use client";
import { Button, Group, Stack } from "@mantine/core";
import { createWorkflow } from "@/utils";

export const Workflows = () => {
  return (
    <Stack>
      <Group justify="flex-end">
        <Button variant="default" onClick={createWorkflow}>
          Create Workflow
        </Button>
      </Group>
    </Stack>
  );
};
