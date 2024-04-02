import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type Props = ComponentPropsWithoutRef<"div"> & {
  spacing?: boolean;
};

export function Container({ className, spacing, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", { "space-y-4": spacing }, className)}
      {...props}
    />
  );
}
