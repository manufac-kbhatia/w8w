import CustomNode from "@/components/node/CustomNode";
import InitialNode from "@/components/node/InitialNode";
import { IConnection } from "@w8w/db/prisma-client";
import { NodeSchema } from "@/types";
import { Node, NodeTypes, XYPosition } from "@xyflow/react";
import { INode, INodeType } from "@w8w/db/prisma-browser";
import axios from "axios";
import { redirect } from "next/navigation";
import FormNode from "@/components/node/FormNode";

export const TABS = {
  workflow: "workflow",
  credential: "credentials",
  executions: "executions",
} as const;

export type Tab = (typeof TABS)[keyof typeof TABS];

export type BaseNodeData = {
  nodeSchema?: NodeSchema;
  parameters?: Record<string, unknown>;
  credentialId?: string | null;
};

export type InitialNodeData = {
  onClick: () => void;
};
export type CustomNode = Node<BaseNodeData, "CUSTOM">;
export type InitialNode = Node<InitialNodeData, "INITIAL">;
export type FormNode = Node<BaseNodeData, "FORM">;

export const nodeTypes: NodeTypes = {
  ["INITIAL"]: InitialNode,
  ["CUSTOM"]: CustomNode,
  ["FORM"]: FormNode,
};

export const createWorkflow = async () => {
  const response = await axios.post("/api/workflow");
  const id = response.data.data.id;
  redirect(`/workflow/${id}`);
};
export const checkMannualTriggerExist = (nodes: Node[]) => {
  const isMannualTriggerExist = nodes.find(
    (node) =>
      node.type === "CUSTOM" &&
      (node as CustomNode).data.nodeSchema?.name === NodeNames.Manual,
  );
  return isMannualTriggerExist ? true : false;
};

export const transformNodes = (nodes: INode[], onInitialNode?: () => void) => {
  return nodes.map((node) => {
    const label =
      (node.data as unknown as BaseNodeData).parameters?.name ??
      (node.data as unknown as BaseNodeData).nodeSchema?.name;
    const transformedNode: Node = {
      id: node.id,
      position: node.position as XYPosition,
      type: node.nodeType,
      data:
        node.nodeType === INodeType.INITIAL
          ? { onClick: onInitialNode }
          : {
              ...(node.data as Record<string, unknown>),
              label: label,
            },
    };
    return transformedNode;
  });
};

export function formatUpdatedAt(date?: Date | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAdjList(edges: IConnection[]) {
  const adj: Record<string, string[]> = {};
  for (const { source: from, target: to } of edges) {
    if (!adj[from]) adj[from] = [];
    adj[from].push(to);

    // Also initialize the "to" edge with empty array so that if there "to" edge doesnt appear as "from" edge later, atleast its entry is added with [] in adj list
    if (!adj[to]) adj[to] = [];
  }
  return adj;
}

export function getInDegrees(edges: IConnection[]): Record<string, number> {
  const inDegrees: Record<string, number> = {};
  for (const { source: from, target: to } of edges) {
    if (!inDegrees[to]) inDegrees[to] = 1;
    else inDegrees[to]++;

    if (!inDegrees[from]) inDegrees[from] = 0;
  }

  return inDegrees;
}

export const NodeNames = {
  Timer: "Timer Node",
  Manual: "Manual Trigger",
  Webhook: "Webhook",
  Form: "Form",
} as const;

export type NodeName = (typeof NodeNames)[keyof typeof NodeNames];

export const NodeStatus = {
  Loading: "loading",
  Success: "success",
  Error: "error",
  Initial: "initial",
} as const;
