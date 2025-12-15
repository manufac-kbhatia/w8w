"use client";
import {
  Checkbox,
  Fieldset,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  Rating,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { JSX, useState } from "react";

export const MantineInputs: Record<string, JSX.Element> = {
  TextInput: <TextInput />,
  Textarea: <Textarea />,
  NumberInput: <NumberInput />,
  Select: <Select />,
  MultiSelect: <MultiSelect />,
  Radio: <Radio />,
  Checkbox: <Checkbox />,
  Rating: <Rating />,
};

export default function Form() {
  const [value, setValue] = useState<string | null>("");
  const [opened, { open, close }] = useDisclosure();

  const handleSelectInput = (value: string | null) => {
    if (!value) return;
    setValue(value);
    open();
  };
  return (
    <Stack>
      <Stack>
        <Title>Select a field type to add it in the form</Title>
        <Select
          data={[
            "TextInput",
            "Textarea",
            "NumberInput",
            "Select",
            "MultiSelect",
            "Radio",
            "Checkbox",
            "Rating",
          ]}
          value={value}
          onChange={handleSelectInput}
        />
      </Stack>
      {value && (
        <Modal opened={opened} onClose={close} centered>
          <PreviewTextInput />
        </Modal>
      )}
    </Stack>
  );
}

type TextInputConfig = {
  name: string;
  label: string;
  placeholder: string;
  description: string;
  defaultValue: string;
  required: boolean;
};
export const PreviewTextInput = () => {
  const [config, setConfig] = useState<TextInputConfig>({
    name: "",
    label: "",
    placeholder: "",
    description: "",
    defaultValue: "",
    required: false,
  });

  const update = <K extends keyof TextInputConfig>(
    key: K,
    value: TextInputConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Stack>
      <Title>Preview</Title>

      <TextInput
        label={config.label}
        name={config.name}
        placeholder={config.placeholder}
        value={config.defaultValue}
        description={config.description}
        required={config.required}
        onChange={(e) => update("defaultValue", e.target.value)}
      />

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
        />

        <TextInput
          label="Default value"
          value={config.defaultValue}
          onChange={(e) => update("defaultValue", e.target.value)}
          mt="xs"
        />

        <Switch
          label="Required"
          checked={config.required}
          onChange={(e) => update("required", e.currentTarget.checked)}
          mt="xs"
        />
      </Fieldset>
    </Stack>
  );
};
