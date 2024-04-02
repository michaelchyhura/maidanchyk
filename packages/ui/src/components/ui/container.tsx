import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type Props = ComponentPropsWithoutRef<"div"> & {
  centered?: boolean;
  spacing?: boolean;
};

export function Container({ className, centered = true, spacing, ...props }: Props) {
  return (
    <div
      className={cn(
        "max-w-7xl px-4 sm:px-6 lg:px-8",
        { "space-y-4": spacing },
        { "mx-auto": centered },
        className,
      )}
      {...props}
    />
  );
}
