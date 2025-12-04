import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ReactNode } from "react";

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
    <Stack align="center">
      <Stack pos="relative" gap={0}>
        {showToolbar && (
          <Group gap={0} pos="absolute" top={-20} right={2}>
            <ActionIcon
              variant="subtle"
              color="cyan"
              onClick={onNodeEdit}
              size={"xs"}
            >
              <IconEdit size={10} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="cyan"
              onClick={onNodeDelete}
              size={"xs"}
            >
              <IconTrash size={10} />
            </ActionIcon>
          </Group>
        )}

        {children}
      </Stack>

      <Stack
        gap={3}
        align="center"
        style={{ textAlign: "center", pointerEvents: "none" }}
      >
        <Text fw={700} size="xs">
          {name}
        </Text>

        <Text size="xs" c="dimmed" truncate="end">
          {descritpion}
        </Text>
      </Stack>
    </Stack>
  );
}
