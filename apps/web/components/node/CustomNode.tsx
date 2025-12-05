import { CustomNodeType, SupportedCredential } from "@/utils";
import {
    ActionIcon,
    Button,
    Group,
    Modal,
    MultiSelect,
    NumberInput,
    PasswordInput,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { PropertyTypes } from "@w8w/types";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import BaseNode from "./BaseNode";

export default function CustomNode({ data, id }: NodeProps<CustomNodeType>) {
    const { updateNodeData, deleteElements, getNode } = useReactFlow();
    const [opened, { close, open }] = useDisclosure();
    const [selectedCredential, setSelectedCredendtial] = useState<string | null>(
        null,
    );

    const form = useForm({
        mode: "uncontrolled",
        initialValues: data.parameters
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
                `/api/credential/supported?type=${data.nodeSchema?.type}`,
            );
            const supportedCredentials = response.data
                .supportedCredentials as SupportedCredential[];

            setSupportedCredentials(supportedCredentials);
        };

        getSupportedCredentials();
    }, [data.nodeSchema?.type]);

    const currentNode = getNode(id);
    if (!currentNode) return;

    console.log(data.parameters)

    return (
        <>
            <BaseNode
                showToolbar={true}
                name={data.parameters?.name as string ?? data.nodeSchema?.displayName}
                descritpion={data.parameters?.description as string ?? data.nodeSchema?.description}
                onNodeDelete={() => deleteElements({ nodes: [currentNode] })}
            >
                <ActionIcon
                    onClick={open}
                    variant="white"
                    bd={"1px solid black"}
                    size={40}
                >
                    <Image
                        src={data.nodeSchema?.iconUrl ?? ""}
                        alt={data.nodeSchema?.name ?? ""}
                        width={20}
                        height={20}
                    />
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
                            {data.nodeSchema?.displayName}
                        </Title>
                        <Text c="dimmed">{data.nodeSchema?.description}</Text>
                    </Stack>
                }
            >
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <Stack>
                        {data.nodeSchema?.requiredCredential ? (
                            <Select
                                label="Credential"
                                data={supportedCredentials.map((cred) => ({
                                    value: cred.id,
                                    label: cred.name,
                                }))}
                                value={selectedCredential}
                                onChange={setSelectedCredendtial}
                                required
                            />
                        ) : null}
                        {data.nodeSchema?.properties.map((property) => {
                            switch (property.type) {
                                case PropertyTypes.string:
                                    return !property.typeOptions?.password ? (
                                        <TextInput
                                            label={property.displayName}
                                            placeholder={property.placeholder}
                                            required={property.required}
                                            description={property.description}
                                            key={form.key(property.name)}
                                            name={property.name}
                                            {...form.getInputProps(property.name)}
                                        />
                                    ) : (
                                        <PasswordInput
                                            label={property.displayName}
                                            placeholder={property.placeholder}
                                            required={property.required}
                                            description={property.description}
                                            key={form.key(property.name)}
                                            name={property.name}
                                            {...form.getInputProps(property.name)}
                                        />
                                    );

                                case PropertyTypes.number:
                                    return (
                                        <NumberInput
                                            key={form.key(property.name)}
                                            label={property.displayName}
                                            placeholder={property.placeholder}
                                            required={property.required}
                                            description={property.description}
                                            name={property.name}
                                            {...form.getInputProps(property.name)}
                                        />
                                    );
                                case PropertyTypes.multiSelect:
                                    return (
                                        <MultiSelect
                                            key={form.key(property.name)}
                                            data={property.options?.map((option) => ({
                                                value: option.name ?? "",
                                                label: option.displayName ?? "",
                                            }))}
                                            label={property.displayName}
                                            placeholder={property.placeholder}
                                            required={property.required}
                                            description={property.description}
                                            name={property.name}
                                            {...form.getInputProps(property.name)}
                                        />
                                    );
                            }
                        })}
                    </Stack>
                    <Group justify="flex-end" mt="lg">
                        <Button type="submit">Save</Button>
                        <Button color="red" onClick={() => close()}>
                            Cancel
                        </Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
}
