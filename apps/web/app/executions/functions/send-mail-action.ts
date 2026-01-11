import { BaseNodeData, NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";
import nodemailer from "nodemailer";
import { prisma } from "@w8w/db/client";
import { NonRetriableError } from "inngest";
import { CredentialData } from "@/types";

export const SendGmailActionExecution: ExecutionFunction = async ({
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

  const credential = await step.run("Fetch credentials", async () => {
    const credentialId = node.data?.credentialId;
    if (!credentialId) {
      throw new NonRetriableError("CredentialId not provided");
    }
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (!credential) throw new NonRetriableError("Credential not found");

    const credentialData = credential.data as unknown as CredentialData;

    const user = credentialData.parameters?.user as string | undefined;
    const pass = credentialData.parameters?.password as string | undefined;

    return { user, pass };
  });

  const result = await step.run("Sending Mail", async () => {
    const user = credential.user;
    const pass = credential.pass;
    if (!user || !pass) throw new NonRetriableError("Invalid credential");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const nodeData = node.data as unknown as BaseNodeData;
    const toMail = nodeData.parameters?.to as string | undefined;
    if (!toMail) throw new NonRetriableError("Sender's mail not provided");
    const info = await transporter.sendMail({
      from: credential.user as string,
      to: toMail,
      subject: nodeData.parameters?.subject as string | undefined,
      text: nodeData.parameters?.message as string | undefined,
    });
    return info;
  });

  await publish({
    channel: `Workflow:${workflowState.workflowId}`,
    topic: `Node:${node.id}`,
    data: {
      status: NodeStatus.Success,
    },
  });

  return result;
};
