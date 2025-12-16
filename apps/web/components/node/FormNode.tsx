"use client";
import { type FormNode, NodeStatus } from "@/utils";
import {
  ActionIcon,
  Loader,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { SupportedCredential } from "@/types";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import BaseNode from "./BaseNode";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/app/actions/get-subscribe-token";
import { useParams } from "next/navigation";
import {
  IconCircleCheckFilled,
  IconEditCircle,
  IconEye,
  IconInfoCircle,
} from "@tabler/icons-react";
import { RenderNodeForm } from "./RenderNodeSchema";
import { PreviewForm } from "../createForm/PreviewForm";
import { FormField } from "../createForm/utils";
import CreateForm from "../createForm";

export default function FormNode({ data, id }: NodeProps<FormNode>) {
  const { id: workflowId } = useParams<{ id: string }>();
  const { updateNodeData, deleteElements, getNode } = useReactFlow();
  const [opened, { close, open }] = useDisclosure();
  const [selectedCredential, setSelectedCredendtial] = useState(
    data.credentialId,
  );
  const [fields, setFields] = useState<FormField[]>([]);

  const theme = useMantineTheme();

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

  const currentNode = getNode(id);
  if (!currentNode) return;

  return (
    <>
      <BaseNode
        showToolbar={true}
        name={
          (data.parameters?.name as string | undefined) ?? data.nodeSchema?.name
        }
        descritpion={
          (data.parameters?.description as string) ??
          data.nodeSchema?.description
        }
        onNodeDelete={() => deleteElements({ nodes: [currentNode] })}
      >
        <ActionIcon
          onClick={open}
          variant="white"
          bd={"1px solid black"}
          size={40}
          style={{ position: "relative" }}
        >
          <Image
            src={data.nodeSchema?.iconUrl ?? ""}
            alt={data.nodeSchema?.name ?? ""}
            width={20}
            height={20}
          />
          {latestData?.data.status === NodeStatus.Loading && (
            <Loader
              size={10}
              style={{
                position: "absolute",
                bottom: "5%",
                right: "5%",
              }}
            />
          )}

          {latestData?.data.status === NodeStatus.Success && (
            <IconCircleCheckFilled
              color={theme.colors.green[5]}
              size={10}
              style={{
                position: "absolute",
                bottom: "5%",
                right: "5%",
              }}
            />
          )}
        </ActionIcon>

        {data.nodeSchema?.executionType === "action" && (
          <Handle id="main-target" type="target" position={Position.Left} />
        )}
        <Handle id="main-source" type="source" position={Position.Right} />
      </BaseNode>

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
              Design
            </Tabs.Tab>
            <Tabs.Tab value="Preview" leftSection={<IconEye size={20} />}>
              Preview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Basics" p="md">
            <RenderNodeForm
              data={data}
              onSubmit={handleSubmit}
              setSelectedCredendtial={setSelectedCredendtial}
              selectedCredential={selectedCredential}
              supportedCredentials={supportedCredentials}
              onCancel={close}
            />
          </Tabs.Panel>

          <Tabs.Panel value="Design" p="md">
            <CreateForm
              fields={fields}
              onFieldSave={(field) => setFields((prev) => [...prev, field])}
            />
          </Tabs.Panel>

          <Tabs.Panel value="Preview" p="md">
            <PreviewForm fields={fields} />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}
