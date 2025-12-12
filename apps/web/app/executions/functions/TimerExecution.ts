import { ExecutionFunction } from "../getExecutions";

export const TimerExecutionFunction: ExecutionFunction = async ({
  node,
  workflowState,
  step,
}) => {
  const parameters = node.data?.parameters as
    | Record<string, unknown>
    | undefined;

  const delay = parameters?.delay as number | undefined;

  const result = await step.run(`${parameters?.name} : ${delay}`, async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(delay);
      }, delay)
    );
  });
  workflowState = { ...workflowState, result };
  return workflowState;
};
