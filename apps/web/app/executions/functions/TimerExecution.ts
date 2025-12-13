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

  const delay = parameters?.delay as number | undefined;
  await publish({
    channel: `Workflow:${workflowState.workflowId}`,
    topic: `Node:${node.id}`,
    data: {
      status: NodeStatus.Loading,
    },
  });

  const result = await step.run(`${parameters?.name} : ${delay}`, async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(delay);
      }, delay)
    );
  });
  workflowState = { ...workflowState, result };

  await publish({
    channel: `Workflow:${workflowState.workflowId}`,
    topic: `Node:${node.id}`,
    data: {
      status: NodeStatus.Success,
    },
  });
  return workflowState;
};
