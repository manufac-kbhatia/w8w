"use client";
import { type VpaasNode } from "@/utils";
import { Code, Modal, Stack, Tabs, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SupportedCredential } from "@/types";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/app/actions/get-subscribe-token";
import { useParams } from "next/navigation";
import { IconEditCircle, IconEye, IconInfoCircle } from "@tabler/icons-react";
import { RenderNodeForm } from "./RenderNodeSchema";
import W8WBaseNode from "./W8WBaseNode";
import { NodeStatus } from "../node-status-indicator";
import {
  getInstructionInXml,
  InstructionField,
} from "../createVpaasInstrunction/utils";
import CreateInstrunctions from "../createVpaasInstrunction";

export default function VpaasNode({ data, id, ...rest }: NodeProps<VpaasNode>) {
  const { id: workflowId } = useParams<{ id: string }>();
  const { updateNodeData, getNode } = useReactFlow();
  const [opened, { close, open }] = useDisclosure();
  const [selectedCredential, setSelectedCredendtial] = useState(
    data.credentialId,
  );
  const [instructions, setInstructions] = useState<InstructionField[]>(
    (data.meta?.instructions as InstructionField[] | undefined) ?? [],
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
      meta: { instructions },
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

  const currentNode = getNode(id);
  if (!currentNode) return;

  console.log(instructions);

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
        <Tabs defaultValue="Basics">
          <Tabs.List>
            <Tabs.Tab value="Basics" leftSection={<IconInfoCircle size={20} />}>
              Basics
            </Tabs.Tab>
            <Tabs.Tab value="Design" leftSection={<IconEditCircle size={20} />}>
              Design Instructions
            </Tabs.Tab>
            <Tabs.Tab value="Preview" leftSection={<IconEye size={20} />}>
              Preview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Basics" p="md">
            <Stack>
              <RenderNodeForm
                data={data}
                onSubmit={handleSubmit}
                setSelectedCredendtial={setSelectedCredendtial}
                selectedCredential={selectedCredential}
                supportedCredentials={supportedCredentials}
                onCancel={close}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="Design" p="md">
            <CreateInstrunctions
              onInstructionSave={(instruction) =>
                setInstructions((prev) => [...prev, instruction])
              }
            />
          </Tabs.Panel>

          <Tabs.Panel value="Preview" p="md">
            <Code color="blue.9" c="white" block>
              {getInstructionInXml(instructions)}
            </Code>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}
