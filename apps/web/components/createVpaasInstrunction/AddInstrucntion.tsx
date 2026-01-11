"use client";
import {
  Stack,
  Title,
  Group,
  Button,
  Text,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";

import {
  DialInstruction,
  InstructionConfig,
  Instrunction,
  Instrunctions,
  PlayInstruction,
  SpeakInstruction,
} from "./utils";
import { SupportedCredential } from "@/types";
import axios from "axios";

export type AddInstructionProps = {
  instructionName: Instrunction;
  config: InstructionConfig;
  onSaveConfig: (config: InstructionConfig) => void;
  onCancel: () => void;
};

export function AddInstruction({
  instructionName,
  config: initalConfig,
  onSaveConfig,
  onCancel,
}: AddInstructionProps) {
  const [config, setConfig] = useState<InstructionConfig>(initalConfig);
  console.log("config", config);

  const [supportedCredentials, setSupportedCredentials] = useState<
    SupportedCredential[]
  >([]);
  const [selectedCredential, setSelectedCredendtial] = useState<
    string | null
  >();

  useEffect(() => {
    const getSupportedCredentials = async () => {
      const response = await axios.get(`/api/credential/supported?name=VPAAS`);
      const supportedCredentials = response.data
        .supportedCredentials as SupportedCredential[];

      setSupportedCredentials(supportedCredentials);
    };

    if (instructionName === Instrunctions.Dial) getSupportedCredentials();
  }, [instructionName]);

  return (
    <Stack gap={"xl"}>
      <Stack gap={2}>
        <Title>{instructionName}</Title>
        {instructionName === Instrunctions.Play && (
          <TextInput
            label="URL"
            description="Enter the URL to play"
            value={(config as PlayInstruction).url}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setConfig((prev) => {
                return { ...prev, url: value };
              });
            }}
          />
        )}
        {instructionName === Instrunctions.Speak && (
          <>
            <TextInput
              label="Voice Id"
              description="Enter the voice id"
              value={(config as SpeakInstruction).voiceId}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setConfig((prev) => ({
                  ...prev,
                  voiceId: value,
                }));
              }}
            />
            <TextInput
              label="Language"
              description="Enter the language"
              value={(config as SpeakInstruction).language}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setConfig((prev) => ({
                  ...prev,
                  language: value,
                }));
              }}
            />
            <Textarea
              autosize
              label="Text"
              description="Enter the Text which will be converted with TTS to play"
              value={(config as SpeakInstruction).text}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setConfig((prev) => ({
                  ...prev,
                  text: value,
                }));
              }}
            />
          </>
        )}
        {instructionName === Instrunctions.Dial && (
          <>
            <Select
              label="Credential"
              data={supportedCredentials.map((cred) => ({
                value: cred.id,
                label: cred.name,
              }))}
              value={selectedCredential}
              onChange={(value) => {
                if (!value) return;
                setSelectedCredendtial(value);
                setConfig((prev) => ({
                  ...prev,
                  credentialId: value,
                }));
              }}
              required
            />
            <TextInput
              label="To"
              description="Enter the number for second leg"
              value={(config as DialInstruction).to}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setConfig((prev) => ({
                  ...prev,
                  to: value,
                }));
              }}
            />
          </>
        )}
        {instructionName === Instrunctions.Hangup && (
          <Text>Are you sure you want to add hangup instruction?</Text>
        )}
      </Stack>

      <Group justify="flex-end">
        <Button type="submit" onClick={() => onSaveConfig(config)}>
          Save
        </Button>
        <Button onClick={onCancel} color="red">
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}
