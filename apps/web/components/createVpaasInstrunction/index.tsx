"use client";

import { Modal, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import {
  getDefaultConfig,
  InstructionConfig,
  InstructionField,
  Instrunction,
  Instrunctions,
} from "./utils";
import { AddInstruction } from "./AddInstrucntion";

export interface CreateInstrunctionsProps {
  onInstructionSave: (field: InstructionField) => void;
}

export default function CreateInstrunctions({
  onInstructionSave,
}: CreateInstrunctionsProps) {
  const [value, setValue] = useState<Instrunction | null>();
  const [opened, { open, close }] = useDisclosure();
  const [config, setConfig] = useState<InstructionConfig | null>(null);

  const [fieldId, setFieldId] = useState<string | null>(null);
  const handleSave = (config?: InstructionConfig) => {
    if (!value) return;
    if (!fieldId) return;
    const newInstrunction: InstructionField = {
      fieldId,
      instructionName: value,
      config,
    };

    onInstructionSave(newInstrunction);
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

  const handleSelectInput = (instruction: Instrunction | null) => {
    if (!instruction) return;

    const fieldId = crypto.randomUUID();

    setFieldId(fieldId);
    const defaultConfig = getDefaultConfig(instruction);
    setConfig(defaultConfig);
    setValue(instruction);
    setFieldId(fieldId);
    open();
  };

  return (
    <Stack>
      <Stack>
        <Text size="md" fw={500}>
          Select a instruction to add
        </Text>
        <Select
          data={Object.values(Instrunctions)}
          value={value}
          onChange={(value) => handleSelectInput(value as Instrunction)}
        />
      </Stack>
      {value && config && (
        <Modal
          opened={opened}
          onClose={handleClose}
          title={<Text fw={800}>Add a instruction</Text>}
          centered
        >
          <AddInstruction
            instructionName={value}
            config={config}
            onSaveConfig={(config) => handleSave(config)}
            onCancel={handleClose}
          />
        </Modal>
      )}
    </Stack>
  );
}
