import { MantineInputConfig, MantineInputName } from "./page";

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
