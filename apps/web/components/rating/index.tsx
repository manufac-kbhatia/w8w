import { Rating, RatingProps, Stack, Text, Title } from "@mantine/core";

export interface RatingInputProps extends RatingProps {
  label?: string;
  description?: string;
}
export function RatingInput({ label, description, ...rest }: RatingInputProps) {
  return (
    <Stack gap={1}>
      {label && <Text fw={500}>{label}</Text>}
      {description && (
        <Text fw={400} size="xs" c="dimmed">
          {description}
        </Text>
      )}
      <Rating {...rest} size={"lg"} />
    </Stack>
  );
}
