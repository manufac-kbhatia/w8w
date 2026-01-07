"use client";

import { Modal, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import {
  FormField,
  getDefaultConfig,
  MantineInputConfig,
  MantineInputName,
  MantineInputNames,
} from "./utils";
import { AddInput } from "./AddInput";

export interface CreateFormProps {
  onFieldSave: (field: FormField) => void;
}

export default function CreateForm({ onFieldSave }: CreateFormProps) {
  const [value, setValue] = useState<MantineInputName | null>();
  const [opened, { open, close }] = useDisclosure();
  const [config, setConfig] = useState<MantineInputConfig | null>(null);

  const [fieldId, setFieldId] = useState<string | null>(null);
  const handleSave = (config: MantineInputConfig) => {
    if (!value) return;

    if (!fieldId) return;
    const newField: FormField = {
      fieldId,
      inputName: value,
      config,
    };

    onFieldSave(newField);
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

    setValue(inputName);
    setConfig(defaultConfig);
    setFieldId(fieldId);
    open();
  };

  return (
    <Stack>
      <Stack>
        <Text size="md" fw={500}>
          Select a field type to add it in the form
        </Text>
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
          <AddInput
            inputName={value}
            config={config}
            onSaveConfig={(config) => handleSave(config)}
            onCancel={handleClose}
          />
        </Modal>
      )}
    </Stack>
  );
}
