import { RatingInput } from "@/components/rating";
import { RadioInput } from "@/components/radio";

import {
  Checkbox,
  MantineComponent,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";

export const getDefaultConfig = (inputName: MantineInputName) => {
  const defaultValue =
    inputName === "Textarea" || inputName === "TextInput"
      ? ("" as string)
      : inputName === "Select" || inputName === "MultiSelect"
        ? ([] as string[])
        : inputName === "NumberInput" || inputName === "RatingInput"
          ? (0 as number)
          : inputName === "Checkbox"
            ? (false as boolean)
            : "";
  const defaultConfig: MantineInputConfig = {
    defaultValue: defaultValue,
    description: "",
    label: "",
    name: "",
    placeholder: "",
    required: false,
    data: [],
  };
  return defaultConfig;
};

export interface MantineInputConfig {
  name: string;
  label: string;
  placeholder: string;
  description: string;
  defaultValue: string | number | string[] | boolean;
  required: boolean;
  data?: string[];
}

export type FormField = {
  fieldId: string;
  inputName: MantineInputName;
  config: MantineInputConfig;
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
