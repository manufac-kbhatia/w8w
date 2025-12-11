import CustomNode from "@/components/node/CustomNode";
import InitialNode from "@/components/node/InitialNode";
import { IConnection } from "@w8w/db/prisma-client";
import { NodeSchema } from "@w8w/types";
import { Node, NodeTypes, XYPosition } from "@xyflow/react";
import { INode, INodeType } from "@w8w/db/prisma-browser";
import axios from "axios";
import { redirect } from "next/navigation";

export const TABS = {
    workflow: "workflow",
    credential: "credentials",
    executions: "executions",
} as const;

export type Tab = (typeof TABS)[keyof typeof TABS];

export type CustomNodeData = {
    nodeSchema?: NodeSchema;
    parameters?: Record<string, unknown>;
    credentialId?: string | null;
};

export type InitialNodeData = {
    onClick: () => void;
};
export type CustomNodeType = Node<CustomNodeData, "CUSTOM">;
export type InitialNodeType = Node<InitialNodeData, "INITIAL">;

export const nodeTypes: NodeTypes = {
    ["INITIAL"]: InitialNode,
    ["CUSTOM"]: CustomNode,
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
            (node as CustomNodeType).data.nodeSchema?.name === "Mannual Trigger",
    );
    return isMannualTriggerExist ? true : false;
};

export const transformNodes = (
    nodes: INode[],
    onInitialNode?: () => void,
) => {
    return nodes.map((node) => {
        let transformedNode: InitialNodeType | CustomNodeType;
        if (node.nodeType === INodeType.INITIAL) {
            transformedNode = {
                id: node.id,
                position: node.position as XYPosition,
                type: node.nodeType,
                data:
                    node.nodeType === INodeType.INITIAL
                        ? { onClick: onInitialNode }
                        : (node.data as Record<string, unknown>),
            } as InitialNodeType;
        } else {
            transformedNode = {
                id: node.id,
                position: node.position as XYPosition,
                type: node.nodeType,
                data: node.data as unknown as CustomNodeData,
            };
        }

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
    }
    return adj;
}
