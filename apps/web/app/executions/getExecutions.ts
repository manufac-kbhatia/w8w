import { NodeName, NodeNames } from "@/utils";
import { INode } from "@w8w/db/prisma-client";
import { GetStepTools, Inngest } from "inngest";
import { TimerExecutionFunction } from "./functions/TimerExecution";
import { ManualTriggerExecutionFunction } from "./functions/manualTrigger";

export type WorkflowState = Record<string, unknown>;

export type ExecutionFunctionArgs = {
  node: INode;
  workflowState: WorkflowState;
  step: GetStepTools<Inngest.Any>;
};

export type ExecutionFunction = (
  args: ExecutionFunctionArgs
) => Promise<WorkflowState>;

export const ExecutionFunctions: Record<NodeName, ExecutionFunction> = {
  [NodeNames.Timer]: TimerExecutionFunction,
  [NodeNames.Manual]: ManualTriggerExecutionFunction,
  [NodeNames.Webhook]: ManualTriggerExecutionFunction,
};

export function getExecutionFucntion(name: NodeName): ExecutionFunction {
  const executionFunction = ExecutionFunctions[name];
  return executionFunction;
}
