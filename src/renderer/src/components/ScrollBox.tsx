import React from "react";
import { clsx } from "clsx";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@renderer/utils";
import { MacScrollbar } from "mac-scrollbar";

const styles = {
  colors: clsx(
    "scroll-thumb-bg-[#00000080] dark:scroll-thumb-bg-[#ffffff80]",
    //"scroll-track-hover-bg-[#f8f8f8c2] dark:scroll-track-hover-bg-[#d2d2d224]",
    "scroll-track-hover-bg-transparent dark:scroll-track-hover-bg-transparent",
    //"scroll-track-hover-border-[#dfdfdf] dark:scroll-track-hover-border-[#e4e4e452]"
    "scroll-track-hover-border-transparent dark:scroll-track-hover-border-transparent",
  ),
};

const thumbVariants = cva(styles.colors, {
  variants: {
    size: {
      small: "scroll-thumb-sm",
      medium: "scroll-thumb-md",
      large: "scroll-thumb-lg",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

interface Props extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  suppressAutoHide?: boolean;
  thumbSize?: VariantProps<typeof thumbVariants>["size"];
}

export function ScrollBox({
  ref,
  children,
  className,
  thumbSize,
  ...props
}: Props): React.JSX.Element {
  return (
    <MacScrollbar
      {...props}
      ref={ref}
      minThumbSize={0}
      trackGap={[8, 8, 8, 8]}
      className={cn(thumbVariants({ size: thumbSize }), className)}
    >
      {children}
    </MacScrollbar>
  );
}
