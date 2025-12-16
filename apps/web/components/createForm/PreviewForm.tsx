import { Stack } from "@mantine/core";
import { FormField, MantineInputs } from "./utils";

export interface PreviewFormProps {
  fields: FormField[];
}
export function PreviewForm({ fields }: PreviewFormProps) {
  return (
    <Stack>
      {fields.map((field) => {
        const InputComponent = MantineInputs[field.inputName];

        return (
          <InputComponent
            key={field.fieldId}
            label={field.config.label}
            name={field.config.name}
            placeholder={field.config.placeholder}
            defaultValue={field.config.defaultValue}
            data={field.config.data}
            description={field.config.description}
            required={field.config.required}
          />
        );
      })}
    </Stack>
  );
}
