import { NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";

export const ManualTriggerExecutionFunction: ExecutionFunction = async ({
  node,
  workflowState,
  step,
  publish,
}) => {
  await step.run(`publish loading:${node.id}`, async () => {
    await publish({
      channel: `Workflow:${workflowState.workflowId}`,
      topic: `Node:${node.id}`,
      data: { status: NodeStatus.Loading },
    });
  });
  const result = await step.run(
    "Manual trigger execution" + node.id,
    () => workflowState,
  );

  await step.run(`publish success:${node.id}`, async () => {
    await publish({
      channel: `Workflow:${workflowState.workflowId}`,
      topic: `Node:${node.id}`,
      data: { status: NodeStatus.Success },
    });
  });
  return result;
};
