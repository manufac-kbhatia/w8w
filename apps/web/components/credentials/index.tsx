"use client";
import { formatUpdatedAt } from "@/utils";
import {
  Modal,
  Stack,
  Select,
  Button,
  Text,
  Group,
  TextInput,
  MultiSelect,
  NumberInput,
  Title,
  PasswordInput,
  Card,
  Divider,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { Credential } from "@w8w/db/prisma-browser";
import { CredentialSchema, PropertyTypes } from "@w8w/types";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../loadingSkeleton";

export const Credentials = () => {
  const [credentialSchemas, setCredentialSchemas] = useState<
    CredentialSchema[]
  >([]);
  const [
    createCredentialModalOpened,
    { open: openCreateCredModal, close: closeCreateCredentialModal },
  ] = useDisclosure(false);

  const [
    addCredentialModalOpened,
    { open: openAddCredentialModal, close: closeAddCredentialModal },
  ] = useDisclosure(false);
  const [selectedCredentialSchema, setSelectedCredentialSchema] =
    useState<CredentialSchema | null>(null);

  const [credentialName, setCredentialName] = useState<string>("");
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
  });

  useEffect(() => {
    const getCredentialsJson = async () => {
      const { data } = await axios.get<{
        credentialSchemas: CredentialSchema[];
      }>("/api/credentials-json");
      setCredentialSchemas(data.credentialSchemas);
    };
    getCredentialsJson();
  }, []);

  const handleConfirm = () => {
    closeCreateCredentialModal();
    openAddCredentialModal();
  };

  const handleSelectCredentialSchema = (
    credentialSchemaName: string | null,
  ) => {
    if (credentialSchemaName) {
      const selectedCredentialSchema = credentialSchemas.find(
        (credentialSchema) => credentialSchema.name === credentialSchemaName,
      );
      if (selectedCredentialSchema && selectedCredentialSchema.properties) {
        setSelectedCredentialSchema(selectedCredentialSchema);
        const values = Object.fromEntries(
          selectedCredentialSchema.properties.map((property) => [
            property.name,
            property.type === PropertyTypes.multiSelect
              ? [property.default ?? ""]
              : (property.default ?? ""),
          ]),
        );

        form.initialize(values);
      }
    }
  };

  const handleCancel = () => {
    setSelectedCredentialSchema(null);
    closeAddCredentialModal();
    setCredentialName("");
    form.reset();
  };

  const handleCredentialSubmit = async (data: string) => {
    try {
      const type = selectedCredentialSchema?.name;
      const supportedNodes = selectedCredentialSchema?.supportedNodes;
      const response = await axios.post("/api/credential", {
        data,
        type,
        name: credentialName,
        supportedNodes,
      });
      setCredentials((prev) => [...prev, response.data.credential]);
    } catch (error) {
      console.log(error);
    }
    closeAddCredentialModal();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/credential/${id}`);
    setCredentials((prev) => {
      return prev.filter((cred) => cred.id != id);
    });
  };

  useEffect(() => {
    const getCredentials = async () => {
      setLoadingCredentials(true);
      const response = await axios.get("/api/credential");
      setLoadingCredentials(false);
      setCredentials(response.data.credentials);
    };
    getCredentials();
  }, []);

  return (
    <Stack>
      <Modal
        title={<Text fw={800}>Add new credential</Text>}
        h={700}
        opened={createCredentialModalOpened}
        onClose={closeCreateCredentialModal}
        centered
      >
        <Stack gap={"xl"}>
          <Select
            label="Select an app or service to connect to"
            placeholder="Search for an app"
            data={credentialSchemas.map((credentialSchema) => {
              return {
                value: credentialSchema.name ?? "",
                label: credentialSchema.displayName ?? "",
              };
            })}
            onChange={(value) => handleSelectCredentialSchema(value)}
          />
          <Group justify="flex-end">
            <Button
              disabled={selectedCredentialSchema ? false : true}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button color="red" onClick={closeCreateCredentialModal}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={addCredentialModalOpened}
        onClose={closeAddCredentialModal}
        title={
          <Group>
            {selectedCredentialSchema?.iconUrl && (
              <Image
                alt={selectedCredentialSchema.displayName ?? ""}
                src={selectedCredentialSchema.iconUrl}
                height={30}
                width={35}
              />
            )}
            <Title order={4}>{selectedCredentialSchema?.displayName}</Title>
          </Group>
        }
      >
        <Stack>
          <TextInput
            label="Name for the credential"
            placeholder="Please enter a name for the credential"
            required
            value={credentialName}
            onChange={(e) => setCredentialName(e.currentTarget.value)}
          />
          <form
            onSubmit={form.onSubmit((values) =>
              handleCredentialSubmit(JSON.stringify(values)),
            )}
          >
            <Stack>
              {selectedCredentialSchema?.properties?.map((property) => {
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
                          label: option.description ?? "",
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
              <Button color="red" onClick={handleCancel}>
                Cancel
              </Button>
            </Group>
          </form>
        </Stack>
      </Modal>

      <Group justify="flex-end">
        <Button variant="default" onClick={openCreateCredModal}>
          Create Credentials
        </Button>
      </Group>
      {loadingCredentials ? (
        <LoadingSkeleton lenght={5} height={70} />
      ) : (
        <Stack>
          {credentials.map((credential) => (
            <Card
              key={credential.id}
              shadow="sm"
              withBorder
              className="transition-all duration-200 hover:scale-101 hover:shadow-lg cursor-pointer"
            >
              <Group justify="space-between" align="center">
                <Group>
                  <Image
                    src={`./${credential.type}.svg`}
                    alt={credential.name}
                    width={40}
                    height={40}
                  />
                  <Stack gap={0}>
                    <Title order={1}>{credential.name}</Title>
                    <Group>
                      <Text>
                        Last updated at {formatUpdatedAt(credential.updatedAt)}
                      </Text>
                      <Divider orientation="vertical" size="sm" />
                      <Text>
                        Last updated at {formatUpdatedAt(credential.createdAt)}
                      </Text>
                    </Group>
                  </Stack>
                </Group>
                <Menu trigger="click" openDelay={100} closeDelay={400}>
                  <Menu.Target>
                    <ActionIcon variant="light">
                      <IconDotsVertical size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => handleDelete(credential.id)}
                      leftSection={<IconTrash size={14} />}
                    >
                      Delete credential
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
