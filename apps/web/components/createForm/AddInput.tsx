import {
  Stack,
  Title,
  Fieldset,
  TextInput,
  Switch,
  Group,
  Button,
  Text,
} from "@mantine/core";
import { useState } from "react";

import { MultiSelectCreatable } from "../createableMultiSelect";
import { SelectCreatable } from "../createableSelect";
import { MantineInputConfig, MantineInputName, MantineInputs } from "./utils";

export type AddInputProps = {
  inputName: MantineInputName;
  config: MantineInputConfig;
  onSaveConfig: (config: MantineInputConfig) => void;
  onCancel: () => void;
};

export function AddInput({
  inputName,
  config: initalConfig,
  onSaveConfig,
  onCancel,
}: AddInputProps) {
  const [config, setConfig] = useState<MantineInputConfig>(initalConfig);
  const update = <K extends keyof MantineInputConfig>(
    key: K,
    value: MantineInputConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const InputComponent = MantineInputs[inputName];

  if (!InputComponent) return null;
  return (
    <Stack gap={"xl"}>
      <Stack gap={2}>
        <Title>Preview</Title>
        <InputComponent
          label={config.label}
          name={config.name}
          placeholder={config.placeholder}
          value={config.defaultValue}
          data={config.data}
          description={config.description}
          required={config.required}
          onChange={(value: React.ChangeEvent<HTMLInputElement> | string) => {
            let updatedValue;

            if (typeof value === "string") {
              updatedValue = value;
            } else {
              updatedValue = value.currentTarget.value;
            }

            update("defaultValue", updatedValue);
          }}
        />
        <Text fw={500} c="dimmed">
          You can enter or select the default value here
        </Text>
      </Stack>

      <Fieldset legend={<Title>Edit the field</Title>}>
        <TextInput
          label="Name"
          description="Name field will be used for accessing the form data in other nodes"
          value={config.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />

        <TextInput
          label="Label"
          value={config.label}
          onChange={(e) => update("label", e.target.value)}
          required
          mt="xs"
        />

        <TextInput
          label="Description"
          value={config.description}
          onChange={(e) => update("description", e.target.value)}
          mt="xs"
        />

        <TextInput
          label="Placeholder"
          value={config.placeholder}
          onChange={(e) => update("placeholder", e.target.value)}
          mt="xs"
          disabled={
            inputName === "Checkbox" ||
            inputName == "RatingInput" ||
            inputName === "RadioInput"
          }
        />

        {(inputName === "Select" || inputName === "RadioInput") &&
          config.data && (
            <SelectCreatable
              data={config.data}
              onDataCreate={(value) => update("data", [...config.data!, value])}
            />
          )}

        {inputName === "MultiSelect" && config.data && (
          <MultiSelectCreatable
            data={config.data}
            onDataCreate={(value) => update("data", [...config.data!, value])}
          />
        )}

        <Switch
          label="Required"
          checked={config.required}
          onChange={(e) => update("required", e.currentTarget.checked)}
          mt="xs"
          disabled={inputName == "RatingInput"}
          radius="sm"
        />
      </Fieldset>

      <Group justify="flex-end">
        <Button onClick={() => onSaveConfig(config)}>Save</Button>
        <Button onClick={onCancel} color="red">
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}
