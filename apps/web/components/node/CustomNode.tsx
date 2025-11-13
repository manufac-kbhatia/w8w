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
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { PropertyTypes } from "@w8w/types";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CustomNode({ data, id }: NodeProps<CustomNodeType>) {
  const { updateNodeData } = useReactFlow();
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure();
  const [selectedCredential, setSelectedCredendtial] = useState<string | null>(
    null
  );
  const form = useForm({
    mode: "uncontrolled",
  });

  const [supportedCredentials, setSupportedCredentials] = useState<
    SupportedCredential[]
  >([]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (selectedCredential) {
      updateNodeData(id, {
        ...data,
        parameter: values,
        credentialId: selectedCredential,
      });
    }
  };

  useEffect(() => {
    const getSupportedCredentials = async () => {
      const response = await axios.get(
        `/api/credential/supported?type=${data.nodeSchema.type}`
      );
      const supportedCredentials = response.data
        .supportedCredentials as SupportedCredential[];

      setSupportedCredentials(supportedCredentials);
    };

    getSupportedCredentials();
  }, [data.nodeSchema.type]);

  return (
    <>
      <Group>
        <ActionIcon
          onClick={open}
          variant="filled"
          bd={"1px solid black"}
          bg={theme.colors.blue[1]}
          size={40}
        >
          <Image
            src={data.nodeSchema.iconUrl ?? ""}
            alt={data.nodeSchema.name}
            width={20}
            height={20}
          />
        </ActionIcon>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </Group>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Title component={"div"} order={5}>
            {data.nodeSchema.displayName}
          </Title>
        }
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack>
            {data.nodeSchema.requiredCredential ? (
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
            {data.nodeSchema.properties.map((property) => {
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
