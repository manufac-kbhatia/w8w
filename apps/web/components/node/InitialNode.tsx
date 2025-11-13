import { InitialNodeType } from "@/utils";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { type NodeProps } from "@xyflow/react";
import BaseNode from "./BaseNode";

export default function InitialNode({ data }: NodeProps<InitialNodeType>) {
  const theme = useMantineTheme();
  return (
    <BaseNode
      showToolbar={false}
      name="Initial Node"
      descritpion="Click to add a new node"
    >
      <ActionIcon
        variant="light"
        bg={theme.colors.gray[1]}
        c={theme.colors.gray[6]}
        bd={"1px dotted gray"}
        size={50}
        onClick={data.onClick}
      >
        <IconPlus size={20} stroke={2} />
      </ActionIcon>
    </BaseNode>
  );
}
