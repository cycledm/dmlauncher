import React from "react";
import { clsx } from "clsx";
import { cn } from "@renderer/utils";

const styles = {
  default: clsx(
    "size-auto p-2",
    "rounded-lg shadow-sm outline",
    "bg-white outline-gray-200 dark:bg-gray-800 dark:outline-gray-700",
    "transition-colors",
    "select-none"
  )
};

type Props = React.HTMLAttributes<HTMLDivElement>;

export function SimpleCard({ children, className, ...props }: Props): React.JSX.Element {
  return (
    <div {...props} className={cn(styles.default, className)}>
      {children}
    </div>
  );
}
