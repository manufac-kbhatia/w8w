"use client";

import React, { type ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { BaseNode } from "@/components/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
};

export function PlaceholderNode({ children }: PlaceholderNodeProps) {
  return (
    <BaseNode
      className="bg-card w-[150px] border-dashed border-gray-400 p-2 text-center text-gray-400 shadow-none"
      // onClick={}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
