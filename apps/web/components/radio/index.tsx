import { Radio, Group, RadioGroupProps } from "@mantine/core";

export interface RadioInputProps extends RadioGroupProps {
  data?: string[];
}
export function RadioInput({ data, ...rest }: RadioInputProps) {
  return (
    <Radio.Group {...rest}>
      <Group mt="xs">
        {data?.map((value) => {
          return <Radio key={value} value={value} label={value} />;
        })}
      </Group>
    </Radio.Group>
  );
}
