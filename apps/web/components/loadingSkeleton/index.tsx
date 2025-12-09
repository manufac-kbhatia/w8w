import { Skeleton, SkeletonProps } from "@mantine/core";

export interface LoadingSkeletonProps extends SkeletonProps {
  lenght: number;
}
export default function LoadingSkeleton({
  lenght,
  ...rest
}: LoadingSkeletonProps) {
  return Array.from({ length: lenght }).map((_, idx) => (
    <Skeleton key={idx} {...rest} />
  ));
}
