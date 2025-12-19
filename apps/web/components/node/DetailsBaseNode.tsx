import { ActionIcon, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { ReactNode } from "react";

export interface DetailsBaseNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onNodeDelete?: () => void;
  onNodeEdit?: () => void;
  name?: string;
  descritpion?: string;
}

export default function DetailsBaseNode({
  showToolbar,
  onNodeEdit,
  onNodeDelete,
  name,
  descritpion,
  children,
}: DetailsBaseNodeProps) {
  return (
    <>
      {showToolbar && (
        <NodeToolbar className="flex gap-2">
          <ActionIcon
            variant="subtle"
            color="cyan"
            onClick={onNodeEdit}
            size={"md"}
          >
            <IconEdit size={20} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="cyan"
            onClick={onNodeDelete}
            size={"md"}
          >
            <IconTrash size={20} />
          </ActionIcon>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[150px] text-center"
        >
          <Text fw={700}>{name}</Text>
          {descritpion && (
            <Text fw={500} c="dimmed" truncate={true}>
              {descritpion}
            </Text>
          )}
        </NodeToolbar>
      )}
    </>
  );
}
