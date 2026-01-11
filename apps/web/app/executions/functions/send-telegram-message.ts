import { BaseNodeData, NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";
import { prisma } from "@w8w/db/client";
import { NonRetriableError } from "inngest";
import { CredentialData } from "@/types";
import TelegramBot from "node-telegram-bot-api";

export const SendTelegramMessageActionExecution: ExecutionFunction = async ({
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

  const credential = await step.run("Fetch credentials" + node.id, async () => {
    const credentialId = node.data?.credentialId;
    if (!credentialId) {
      throw new NonRetriableError("CredentialId not provided");
    }
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (!credential) throw new NonRetriableError("Credential not found");

    const credentialData = credential.data as unknown as CredentialData;

    const apiToken = credentialData.parameters?.accessToken as
      | string
      | undefined;

    return { apiToken };
  });

  const result = await step.run("Sending Message" + node.id, async () => {
    const apiToken = credential.apiToken;
    if (!apiToken) throw new NonRetriableError("Invalid credential");

    const nodeData = node.data as unknown as BaseNodeData;
    const chatId = nodeData.parameters?.chatId as string | undefined;
    const text = (nodeData.parameters?.text as string | undefined) ?? "";
    if (!chatId) throw new NonRetriableError("Chat Id not provided");
    const bot = new TelegramBot(apiToken);
    const info = await bot.sendMessage(chatId, text);
    return info;
  });

  await step.run(`publish success:${node.id}`, async () => {
    await publish({
      channel: `Workflow:${workflowState.workflowId}`,
      topic: `Node:${node.id}`,
      data: { status: NodeStatus.Success },
    });
  });

  return result;
};
