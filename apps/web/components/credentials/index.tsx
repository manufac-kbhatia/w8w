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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  Credential,
  CredentialData,
  CredentialSchema,
  PropertyTypes,
} from "@/types";
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

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
  });

  useEffect(() => {
    const getCredentialsSchema = async () => {
      const { data } = await axios.get<{
        credentialSchemas: CredentialSchema[];
      }>("/api/credentials-json");

      setCredentialSchemas(data.credentialSchemas);
    };
    getCredentialsSchema();
  }, []);

  const handleConfirm = () => {
    closeCreateCredentialModal();
    openAddCredentialModal();
  };

  const handleSelectCredentialSchema = (
    credentialSchemaName: string | null
  ) => {
    if (credentialSchemaName) {
      const selectedCredentialSchema = credentialSchemas.find(
        (credentialSchema) => credentialSchema.name === credentialSchemaName
      );
      if (selectedCredentialSchema && selectedCredentialSchema.properties) {
        setSelectedCredentialSchema(selectedCredentialSchema);
        const values = Object.fromEntries(
          selectedCredentialSchema.properties.map((property) => [
            property.name,
            property.type === PropertyTypes.multiSelect
              ? [property.default ?? ""]
              : (property.default ?? ""),
          ])
        );

        form.initialize(values);
      }
    }
  };

  const handleCancel = () => {
    setSelectedCredentialSchema(null);
    closeAddCredentialModal();
    form.reset();
  };

  const handleCredentialSubmit = async (values: Record<string, unknown>) => {
    try {
      if (selectedCredentialSchema) {
        const data: CredentialData = {
          parameters: values,
          credentialSchema: selectedCredentialSchema,
        };
        const supportedNodes = selectedCredentialSchema?.supportedNodes;
        const response = await axios.post("/api/credential", {
          data,
          supportedNodes,
        });
        setCredentials((prev) => [...prev, response.data.credential]);
      }
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
            data={credentialSchemas.map(
              (credentialSchema) => credentialSchema.name ?? ""
            )}
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
                alt={selectedCredentialSchema.name ?? ""}
                src={selectedCredentialSchema.iconUrl}
                height={30}
                width={35}
              />
            )}
            <Title order={4}>{selectedCredentialSchema?.name}</Title>
          </Group>
        }
      >
        <Stack>
          <form
            onSubmit={form.onSubmit((values) => handleCredentialSubmit(values))}
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
          {credentials.map((credential) => {
            const name: string =
              (credential.data?.parameters?.name as string | undefined) ??
              credential.data?.credentialSchema?.name ??
              "";
            return (
              <Card
                key={credential.id}
                shadow="sm"
                withBorder
                className="transition-all duration-200 hover:scale-101 hover:shadow-lg cursor-pointer"
              >
                <Group justify="space-between" align="center">
                  <Group>
                    <Image
                      src={credential.data?.credentialSchema?.iconUrl ?? ""}
                      alt={
                        credential.data?.credentialSchema?.name ??
                        "Credntial Image"
                      }
                      width={40}
                      height={40}
                    />
                    <Stack gap={0}>
                      <Title order={1}>{name}</Title>
                      <Group>
                        <Text>
                          Last updated at{" "}
                          {formatUpdatedAt(credential.updatedAt)}
                        </Text>
                        <Divider orientation="vertical" size="sm" />
                        <Text>
                          Created at {formatUpdatedAt(credential.createdAt)}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                  <Group>
                    <ActionIcon size="md" radius="md" variant="light">
                      <IconEdit size={20} />
                    </ActionIcon>
                    <ActionIcon
                      size="md"
                      radius="md"
                      variant="light"
                      onClick={() => handleDelete(credential.id)}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
