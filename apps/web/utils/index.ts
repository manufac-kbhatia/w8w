import CustomNode from "@/components/node/CustomNode";
import InitialNode from "@/components/node/InitialNode";
import { NodeType } from "@w8w/db";
import { NodeSchema, Properties } from "@w8w/types";
import { Node, NodeTypes } from "@xyflow/react";
import axios from "axios";
import { redirect } from "next/navigation";

export const TABS = {
  workflow: "workflow",
  credential: "credentials",
  executions: "executions",
} as const;

export type Tab = (typeof TABS)[keyof typeof TABS];

export type CustomNodeData = {
  nodeSchema: NodeSchema;
};

export type InitialNodeData = {
  onClick: () => void;
};
export type CustomNodeType = Node<CustomNodeData, "CUSTOM">;
export type InitialNodeType = Node<InitialNodeData, "INITIAL">;

export const nodeTypes: NodeTypes = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.CUSTOM]: CustomNode,
};

export const createWorkflow = async () => {
  const response = await axios.post("/api/workflow");
  const id = response.data.id;
  redirect(`/workflow/${id}`);
};

export interface SupportedCredential {
  id: string;
  name: string;
  type: string;
}
