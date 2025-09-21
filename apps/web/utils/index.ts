import CustomNode from "@/components/node";
import { Properties } from "@w8w/types";
import { Node, NodeTypes } from "@xyflow/react";

export const TABS = {
  workflow: "Workflow",
  credential: "Credentials",
  executions: "Executions",
} as const;

export type Tab = (typeof TABS)[keyof typeof TABS];

export type CustomNodeData = {
  name: string;
  displayName: string;
  iconUrl?: string;
  nodeType: "trigger" | "action";
  properties: Properties[];
  description?: string;
};
export type CustomNodeType = Node<CustomNodeData, "custom">;

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
};
