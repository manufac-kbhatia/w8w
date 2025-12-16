import type { InitialNode } from "@/utils";
import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { type NodeProps } from "@xyflow/react";
import BaseNode from "./BaseNode";

export default function InitialNode({ data }: NodeProps<InitialNode>) {
  return (
    <BaseNode
      showToolbar={false}
      name="Initial Node"
      descritpion="Click to add a new node"
    >
      <ActionIcon
        variant="subtle"
        bd={"1px dotted gray"}
        size={50}
        onClick={data.onClick}
      >
        <IconPlus size={20} stroke={2} />
      </ActionIcon>
    </BaseNode>
  );
}
