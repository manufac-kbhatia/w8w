import { BaseNodeData, NodeStatus } from "@/utils";
import { ExecutionFunction } from "../getExecutions";
import axios from "axios";
import { prisma } from "@w8w/db/client";
import { NonRetriableError } from "inngest";
import { CredentialData } from "@/types";

export const VpaasActionExecutionFunction: ExecutionFunction = async ({
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

  const credential: CredentialData = await step.run(
    "Fetch credental" + node.id,
    async () => {
      const id = node.data?.credentialId;
      if (!id) {
        throw new NonRetriableError("Credential Id not provided");
      }
      const credential = await prisma.credential.findUnique({ where: { id } });
      return credential?.data as unknown as CredentialData;
    },
  );
  const result = await step.run(
    "Vpaas action execution" + node.id,
    async () => {
      const data = node.data as unknown as BaseNodeData;
      const to = data.parameters?.to as string | undefined;
      const answerUrl =
        (data.parameters?.answerUrl as string | undefined) ??
        `http://localhost:3000/api/instruction/${node.id}`;
      const callbackUrl = data.parameters?.callbackUrl as string | undefined;
      const mainHangupUrl = data.parameters?.mainHangupUrl as
        | string
        | undefined;
      const recordSession = data.parameters?.recordSession as
        | boolean
        | undefined;

      const userId = credential.parameters?.userId as number | undefined;
      const trunk = credential.parameters?.trunk as number | undefined;
      const from = credential.parameters?.did as number | undefined;
      const answerMethod =
        (data.parameters?.answerMethod as string | undefined) ?? "GET";
      const mainHangupMethod =
        (data.parameters?.mainHangupMethod as string | undefined) ?? "POST";

      console.log({
        to,
        answerUrl,
        callbackUrl,
        mainHangupUrl,
        recordSession,
        userId,
        trunk,
        from,
      });

      const response = await axios.post(
        "https://dev-test.therealpbx.co.in:6670/v1/call",
        {
          to,
          from,
          trunk,
          answerUrl,
          callbackUrl,
          mainHangupUrl,
          recordSession,
          userId,
          answerMethod,
          mainHangupMethod,
        },
      );
      return response.data;
    },
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
