import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import DetailsBaseNode from "./DetailsBaseNode";
import { BaseNode, BaseNodeContent } from "../base-node";
import { BaseHandle } from "../base-handle";
import { BaseNodeData } from "@/utils";
import { NodeStatus, NodeStatusIndicator } from "../node-status-indicator";

export interface W8WBaseNodeProps extends NodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDoubleClick?: () => void;
  onNodeEdit?: () => void;
  status?: NodeStatus;
  data: BaseNodeData;
}

export default function W8WBaseNode({
  showToolbar,
  onNodeEdit,
  onDoubleClick,
  children,
  data,
  id,
  status,
}: W8WBaseNodeProps) {
  const { deleteElements, getNode } = useReactFlow();
  const currentNode = getNode(id);
  if (!currentNode) return;

  return (
    <DetailsBaseNode
      showToolbar={showToolbar}
      onNodeDelete={() => deleteElements({ nodes: [currentNode] })}
      onNodeEdit={onNodeEdit}
      name={
        (data.parameters?.name as string | undefined) ?? data.nodeSchema?.name
      }
      descritpion={
        (data.parameters?.description as string) ?? data.nodeSchema?.description
      }
    >
      <NodeStatusIndicator
        status={status}
        variant="border"
        className={
          data?.nodeSchema?.executionType === "trigger" ? "rounded-l-2xl" : ""
        }
      >
        <BaseNode
          onDoubleClick={onDoubleClick}
          className={
            data?.nodeSchema?.executionType === "trigger"
              ? "rounded-l-2xl relative group"
              : ""
          }
          status={status}
        >
          <BaseNodeContent>
            {children}
            {data.nodeSchema?.executionType === "action" && (
              <BaseHandle
                id="main-target"
                type="target"
                position={Position.Left}
              />
            )}
            <BaseHandle
              id="main-source"
              type="source"
              position={Position.Right}
            />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </DetailsBaseNode>
  );
}
