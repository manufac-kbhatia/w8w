import CustomNode from "@/components/node";
import { Properties } from "@w8w/types";
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
  name: string;
  displayName: string;
  iconUrl?: string;
  nodeType: "trigger" | "action";
  properties: Properties[];
  description?: string;
  parameter?: Record<string, unknown>;
  credentialId?: string;
  requiredCredential?: boolean;
  type: string;
};
export type CustomNodeType = Node<CustomNodeData, "custom">;

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
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
