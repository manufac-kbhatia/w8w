"use client";
import { MultiSelectCreatable } from "@/components/createableMultiSelect";
import { SelectCreatable } from "@/components/createableSelect";
import { RatingInput } from "@/components/rating";
import { RadioInput } from "@/components/radio";

import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  MantineComponent,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { getDefaultConfig } from "./utils";

export const MantineInputNames = {
  TextInput: "TextInput",
  Textarea: "Textarea",
  NumberInput: "NumberInput",
  Select: "Select",
  MultiSelect: "MultiSelect",
  Radio: "RadioInput",
  Checkbox: "Checkbox",
  Rating: "RatingInput",
} as const;

export type MantineInputName =
  (typeof MantineInputNames)[keyof typeof MantineInputNames];

export const MantineInputs: Record<MantineInputName, MantineComponent<any>> = {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  RadioInput,
  Checkbox,
  RatingInput,
};

export type FormField = {
  fieldId: string;
  inputName: MantineInputName;
  config: MantineInputConfig;
};

export default function Form() {
  const [value, setValue] = useState<MantineInputName | null>();
  const [opened, { open, close }] = useDisclosure();
  const [config, setConfig] = useState<MantineInputConfig | null>(null);

  const [fieldId, setFieldId] = useState<string | null>(null);

  const [fields, setFields] = useState<FormField[]>([]);

  const handleSave = (config: MantineInputConfig) => {
    if (!value) return;

    if (!fieldId) return;

    setFields((prev) => [
      ...prev,
      {
        fieldId,
        inputName: value,
        config,
      },
    ]);
    setFieldId(null);
    setConfig(null);
    close();
  };

  const handleClose = () => {
    setFieldId(null);
    setConfig(null);
    setValue(null);
    close();
  };

  const handleSelectInput = (inputName: MantineInputName | null) => {
    if (!inputName) return;
    const defaultConfig: MantineInputConfig = getDefaultConfig(inputName);
    const fieldId = crypto.randomUUID();
    console.log(inputName, defaultConfig, fieldId);

    setValue(inputName);
    setConfig(defaultConfig);
    setFieldId(fieldId);
    open();
  };

  return (
    <Stack>
      <Stack>
        <Title>Select a field type to add it in the form</Title>
        <Select
          data={Object.values(MantineInputNames)}
          value={value}
          onChange={(value) => handleSelectInput(value as MantineInputName)}
        />
      </Stack>
      {value && config && (
        <Modal
          opened={opened}
          onClose={handleClose}
          title={<Text fw={800}>Add/Edit new field in the form</Text>}
          centered
        >
          <PreviewInput
            inputName={value}
            config={config}
            onSaveConfig={(config) => handleSave(config)}
            onCancel={handleClose}
          />
        </Modal>
      )}

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
    </Stack>
  );
}

export interface MantineInputConfig {
  name: string;
  label: string;
  placeholder: string;
  description: string;
  defaultValue: string | number | string[] | boolean;
  required: boolean;
  data?: string[];
}
type PreviewTextInput = {
  inputName: MantineInputName;
  config: MantineInputConfig;
  onSaveConfig: (config: MantineInputConfig) => void;
  onCancel: () => void;
};
export function PreviewInput({
  inputName,
  config: initalConfig,
  onSaveConfig,
  onCancel,
}: PreviewTextInput) {
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
          onChange={(value: any) => {
            let updatedValue;

            if (inputName === "TextInput" || inputName === "Textarea") {
              updatedValue = value.currentTarget.value;
            } else {
              updatedValue = value;
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
