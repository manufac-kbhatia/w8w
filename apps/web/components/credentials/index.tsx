"use client";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ICredentialType, NodePropertyTypes } from "@w8w/typeorm/types";
import axios from "axios";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

export const Credentials = () => {
  const [credTypes, setCredTypes] = useState<ICredentialType[]>([]);
  const [
    createCredModalOpened,
    { open: openCreateCredModal, close: closeCreateCredModal },
  ] = useDisclosure(false);

  const [
    addCredModalOpened,
    { open: openAddCredModal, close: closeAddCredModal },
  ] = useDisclosure(false);
  const [selectedCred, setSelectedCred] = useState<ICredentialType | null>(
    null,
  );
  const [credName, setCredName] = useState<string>("");

  const form = useForm({
    mode: "uncontrolled",
  });

  useEffect(() => {
    const getCredentialsJson = async () => {
      const response = await fetch("/api/credentials-json", { method: "GET" });
      if (response.ok) {
        const credsTypesData = (await response.json()) as ICredentialType[];
        setCredTypes(credsTypesData);
      } else {
        notifications.show({
          title: "Something went wrong",
          message: "Please refresh the page",
          color: "red",
        });
      }
    };

    getCredentialsJson();
  }, []);

  const handleConfirm = () => {
    closeCreateCredModal();
    openAddCredModal();
  };

  const handleSelectCredType = (credName: string | null) => {
    if (credName) {
      const cred = credTypes.find((credType) => credType.name === credName);
      if (cred) {
        setSelectedCred(cred);
        const values = Object.fromEntries(
          cred.properties.map((property) => [
            property.name,
            // property.default ??
            property.type === NodePropertyTypes.multiSelect
              ? [property.default ?? ""]
              : (property.default ?? ""),
          ]),
        );

        form.initialize(values);
      }
    }
  };

  const handleCancel = () => {
    setSelectedCred(null);
    closeAddCredModal();
    setCredName("");
    form.reset();
  };

  const handleCredSubmit = async (data: string) => {
    const type = selectedCred?.name;
    const response = await axios.post("/api/credential", {
      data,
      type,
      name: credName,
    });
    console.log(response);
  };

  return (
    <Fragment>
      <Modal
        title={<Text fw={800}>Add new credential</Text>}
        h={700}
        opened={createCredModalOpened}
        onClose={closeCreateCredModal}
        centered
      >
        <Stack gap={"xl"}>
          <Select
            label="Select an app or service to connect to"
            placeholder="Search for an app"
            data={credTypes.map((credType) => {
              return {
                value: credType.name,
                label: credType.displayName,
              };
            })}
            onChange={(value) => handleSelectCredType(value)}
          />
          <Group justify="flex-end">
            <Button
              disabled={selectedCred ? false : true}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button color="red" onClick={closeCreateCredModal}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={addCredModalOpened}
        onClose={closeAddCredModal}
        title={
          <Group>
            {selectedCred?.iconUrl && (
              <Image
                alt={selectedCred.displayName}
                src={selectedCred.iconUrl}
                height={30}
                width={35}
              />
            )}
            <Title order={4}>{selectedCred?.displayName}</Title>
          </Group>
        }
      >
        <Stack>
          {/* TODO: send the value to backend */}
          <TextInput
            label="Name for the credential"
            placeholder="Please enter a name for the credential"
            required
            value={credName}
            onChange={(e) => setCredName(e.currentTarget.value)}
          />
          <form
            onSubmit={form.onSubmit((values) =>
              handleCredSubmit(JSON.stringify(values))
            )}
          >
            <Stack>
              {selectedCred?.properties.map((property) => {
                switch (property.type) {
                  case NodePropertyTypes.string:
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

                  case NodePropertyTypes.number:
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
                  case NodePropertyTypes.multiSelect:
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
    </Fragment>
  );
};
