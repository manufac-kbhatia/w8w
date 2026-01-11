import { NodeName, NodeNames } from "@/utils";
import { Node } from "@w8w/db/prisma-client";
import { GetStepTools, Inngest } from "inngest";
import { TimerExecutionFunction } from "./functions/TimerExecution";
import { ManualTriggerExecutionFunction } from "./functions/manualTrigger";
import { Realtime } from "@inngest/realtime/middleware";
import { FormTriggerExecutionFunction } from "./functions/formTrigger";
import { WebhookExecutionFunction } from "./functions/webhookTrigger";
import { SendGmailActionExecution } from "./functions/send-mail-action";
import { SendTelegramMessageActionExecution } from "./functions/send-telegram-message";

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
  [NodeNames.Webhook]: WebhookExecutionFunction,
  [NodeNames.Form]: FormTriggerExecutionFunction,
  [NodeNames.Send_Mail]: SendGmailActionExecution,
  [NodeNames.Send_Telegram_Message]: SendTelegramMessageActionExecution,
};

export function getExecutionFucntion(name: NodeName): ExecutionFunction {
  const executionFunction = ExecutionFunctions[name];
  return executionFunction;
}
