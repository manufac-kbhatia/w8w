import { PropertyTypes, SupportedCredential } from "@/types";
import { BaseNodeData } from "@/utils";
import {
  Stack,
  Select,
  TextInput,
  PasswordInput,
  NumberInput,
  MultiSelect,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export interface RenderNodeFormProps {
  data: BaseNodeData;
  onSubmit: (values: Record<string, unknown>) => void;
  supportedCredentials: SupportedCredential[];
  selectedCredential?: string | null;
  setSelectedCredendtial: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  onCancel: () => void;
}
export function RenderNodeForm({
  data,
  onSubmit,
  supportedCredentials,
  selectedCredential,
  setSelectedCredendtial,
  onCancel,
}: RenderNodeFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: data.parameters,
  });
  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
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
        <Button color="red" onClick={onCancel}>
          Cancel
        </Button>
      </Group>
    </form>
  );
}
