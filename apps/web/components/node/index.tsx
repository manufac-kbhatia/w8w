import { CustomNodeType } from "@/utils";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { NodePropertyTypes } from "@w8w/types";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import Image from "next/image";

export default function CustomNode({ data }: NodeProps<CustomNodeType>) {
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure();
  const form = useForm({
    mode: "uncontrolled",
  });

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
            src={data.iconUrl ?? ""}
            alt={data.name}
            width={20}
            height={20}
          />
        </ActionIcon>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </Group>
      <Modal opened={opened} onClose={close} title={<Title component={"div"} order={5}>{data.displayName}</Title>}>
        <form>
          <Stack>
            {data?.properties.map((property) => {
              switch (property.type) {
                case NodePropertyTypes.string:
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

                case NodePropertyTypes.number:
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
                case NodePropertyTypes.multiSelect:
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
