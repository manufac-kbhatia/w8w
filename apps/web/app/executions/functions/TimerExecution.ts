import { NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";

export const TimerExecutionFunction: ExecutionFunction = async ({
  node,
  workflowState,
  step,
  publish,
}) => {
  const parameters = node.data?.parameters as
    | Record<string, unknown>
    | undefined;

  const delay = (parameters?.delay as number | undefined) ?? 0;

  await step.run(`publish loading:${node.id}`, async () => {
    await publish({
      channel: `Workflow:${workflowState.workflowId}`,
      topic: `Node:${node.id}`,
      data: { status: NodeStatus.Loading },
    });
  });

  await step.sleep(`${parameters?.name} : delay`, delay);

  workflowState = { ...workflowState, result: delay };

  await step.run(`publish success:${node.id}`, async () => {
    await publish({
      channel: `Workflow:${workflowState.workflowId}`,
      topic: `Node:${node.id}`,
      data: { status: NodeStatus.Success },
    });
  });

  return workflowState;
};
