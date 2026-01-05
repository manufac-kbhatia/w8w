import { NodeName, NodeNames } from "@/utils";
import { Node } from "@w8w/db/prisma-client";
import { GetStepTools, Inngest } from "inngest";
import { TimerExecutionFunction } from "./functions/TimerExecution";
import { ManualTriggerExecutionFunction } from "./functions/manualTrigger";
import { Realtime } from "@inngest/realtime/middleware";

export type WorkflowState = Record<string, unknown>;

export type ExecutionFunctionArgs = {
  node: Node;
  workflowState: WorkflowState;
  step: GetStepTools<Inngest.Any>;
  publish: Realtime.PublishFn;
};

export type ExecutionFunction = (
  args: ExecutionFunctionArgs
) => Promise<WorkflowState>;

export const ExecutionFunctions: Record<NodeName, ExecutionFunction> = {
  [NodeNames.Timer]: TimerExecutionFunction,
  [NodeNames.Manual]: ManualTriggerExecutionFunction,
  [NodeNames.Webhook]: ManualTriggerExecutionFunction,
  [NodeNames.Form]: ManualTriggerExecutionFunction, // Add form execution instead
};

export function getExecutionFucntion(name: NodeName): ExecutionFunction {
  const executionFunction = ExecutionFunctions[name];
  return executionFunction;
}
