import type { InitialNode } from "@/utils";
import { type NodeProps } from "@xyflow/react";
import { BaseNode, BaseNodeContent } from "@/components/base-node";

import { PlaceholderNode } from "@/components/placeholder-node";

export default function InitialNode({ data }: NodeProps<InitialNode>) {
  return (
    <BaseNode>
      <BaseNodeContent>
        <PlaceholderNode>
          <div>+</div>
        </PlaceholderNode>
      </BaseNodeContent>
    </BaseNode>
  );
}
