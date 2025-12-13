import { NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";

export const ManualTriggerExecutionFunction: ExecutionFunction = async ({
  node,
  workflowState,
  step,
  publish,
}) => {
  await publish({
    channel: `Workflow:${workflowState.workflowId}`,
    topic: `Node:${node.id}`,
    data: {
      status: NodeStatus.Loading,
    },
  });
  const result = await step.run(
    "Manual trigger execution",
    () => workflowState,
  );

  await publish({
    channel: `Workflow:${workflowState.workflowId}`,
    topic: `Node:${node.id}`,
    data: {
      status: NodeStatus.Success,
    },
  });
  return result;
};
