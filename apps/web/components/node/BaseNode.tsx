import { ActionIcon, Group, Stack, Text, Title, Box } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { NodeToolbar } from "@xyflow/react";
import { Fragment, ReactNode } from "react";

export interface BaseNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onNodeDelete?: () => void;
  onNodeEdit?: () => void;
  name?: string;
  descritpion?: string;
}

export default function BaseNode({
  showToolbar,
  onNodeEdit,
  onNodeDelete,
  name,
  descritpion,
  children,
}: BaseNodeProps) {
  return (
    <Stack align="center" gap={3}>
      {showToolbar && (
        <Group gap={5}>
          <ActionIcon variant="subtle" size={10} onClick={onNodeEdit}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon variant="subtle" size={10} onClick={onNodeDelete}>
            <IconTrash />
          </ActionIcon>
        </Group>
      )}

      {children}

      {name && (
        <Stack
          style={{ textAlign: "center", pointerEvents: "none" }}
          gap={2}
          align="center"
        >
          <Text size="xs" fw={600}>
            {name}
          </Text>
          <Text size="xs">{descritpion}</Text>
        </Stack>
      )}
    </Stack>
  );
}
