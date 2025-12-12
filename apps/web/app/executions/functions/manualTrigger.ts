import { ExecutionFunction } from "../getExecutions";

export const ManualTriggerExecutionFunction: ExecutionFunction = async ({
  node,
  workflowState,
  step,
}) => {
  console.log("Running Mannual");
  const result = await step.run(
    "Manual trigger execution",
    () => workflowState
  );
  return result;
};
