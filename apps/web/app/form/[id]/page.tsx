"use client";
import { FormField, MantineInputs } from "@/components/createForm/utils";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Node } from "@w8w/db/prisma-browser";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<Node>();
  const form = useForm({
    mode: "uncontrolled",
  });

  useEffect(() => {
    const getFormData = async () => {
      const { data: responseData } = await axios.get(`/api/node/${id}`);
      setNode(responseData.data.node);
    };

    getFormData();
  }, [id]);

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    try {
      await axios.post(`/api/execute/form/${id}`, { formValues: values });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const meta = node?.data?.meta as Record<string, unknown> | undefined;
  const fields = meta?.fields as FormField[] | undefined;
  const values = node?.data?.parameters as Record<string, string> | undefined;
  return (
    <Stack w={"100vw"} h={"100vh"} justify="center" align="center">
      <Card withBorder shadow="md" radius={"lg"}>
        <Stack gap={12}>
          <Stack gap={2}>
            <Title order={2}>{values?.name}</Title>
            <Text className="text-md text-dimmed font-semibold">
              {values?.description}
            </Text>
          </Stack>

          <form
            onSubmit={form.onSubmit((values) => handleFormSubmit(values))}
            className="min-w-xl space-x-3"
          >
            <Stack>
              {fields?.map((field) => {
                const InputComponent = MantineInputs[field.inputName];

                return (
                  <InputComponent
                    size="md"
                    key={form.key(field.config.name)}
                    {...form.getInputProps(field.config.name)}
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
              <Group>
                <Button type="submit">Submit</Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Stack>
  );
}
