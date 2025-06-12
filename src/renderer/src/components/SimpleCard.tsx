import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function SimpleCard({ children, className }: Props): React.JSX.Element {
  const style = clsx(
    "size-auto p-2",
    "rounded-lg shadow-sm outline",
    "bg-white outline-gray-200 dark:bg-gray-800 dark:outline-gray-700",
    "transition-colors",
    "select-none"
  );

  return <div className={twMerge(style, className)}>{children}</div>;
}
