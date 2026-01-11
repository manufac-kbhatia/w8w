"use client";
import { type CustomNode } from "@/utils";
import { Button, CopyButton, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SupportedCredential } from "@/types";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/app/actions/get-subscribe-token";
import { useParams } from "next/navigation";
import W8WBaseNode from "./W8WBaseNode";
import { NodeStatus } from "../node-status-indicator";
import { RenderNodeForm } from "./RenderNodeSchema";

export default function WebhookNode({
  data,
  id,
  ...rest
}: NodeProps<CustomNode>) {
  const { id: workflowId } = useParams<{ id: string }>();
  const { updateNodeData } = useReactFlow();
  const [opened, { close, open }] = useDisclosure();
  const [selectedCredential, setSelectedCredendtial] = useState(
    data.credentialId,
  );

  const { latestData } = useInngestSubscription({
    refreshToken: () => fetchRealtimeSubscriptionToken(workflowId, id),
  });

  const [supportedCredentials, setSupportedCredentials] = useState<
    SupportedCredential[]
  >([]);

  const handleSubmit = (values: Record<string, unknown>) => {
    updateNodeData(id, {
      ...data,
      parameters: values,
      credentialId: selectedCredential,
    });
    close();
  };

  useEffect(() => {
    const getSupportedCredentials = async () => {
      const response = await axios.get(
        `/api/credential/supported?name=${data.nodeSchema?.name}`,
      );
      const supportedCredentials = response.data
        .supportedCredentials as SupportedCredential[];

      setSupportedCredentials(supportedCredentials);
    };

    getSupportedCredentials();
  }, [data.nodeSchema?.name]);

  useEffect(() => {
    updateNodeData(id, {
      ...data,
      parameters: {
        ...data.parameters,
        baseUrl: id,
      },
    });
  }, []);

  return (
    <>
      <W8WBaseNode
        {...rest}
        data={data}
        id={id}
        onDoubleClick={open}
        onNodeEdit={open}
        showToolbar={true}
        status={latestData?.data.status as NodeStatus}
      >
        <Image
          src={data.nodeSchema?.iconUrl ?? ""}
          alt={data.nodeSchema?.name ?? ""}
          width={20}
          height={20}
        />
      </W8WBaseNode>

      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          <Stack gap={1}>
            <Title component={"div"} order={1}>
              {data.nodeSchema?.name}
            </Title>
            <Text c="dimmed">{data.nodeSchema?.description}</Text>
          </Stack>
        }
      >
        <CopyButton value={`http://localhost:3000/api/execute/webhook/${id}`}>
          {({ copied, copy }) => (
            <Button onClick={copy} w={"fit-content"}>
              {copied ? "Copied!" : "Copy webhook url"}
            </Button>
          )}
        </CopyButton>
        <RenderNodeForm
          data={data}
          onSubmit={handleSubmit}
          setSelectedCredendtial={setSelectedCredendtial}
          selectedCredential={selectedCredential}
          supportedCredentials={supportedCredentials}
          onCancel={close}
        />
      </Modal>
    </>
  );
}
