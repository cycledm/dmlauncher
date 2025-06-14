import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { MacScrollbar } from "mac-scrollbar";

interface Props extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  suppressAutoHide?: boolean;
  thumbSize?: "small" | "medium" | "large";
}

export function ScrollBox({ ref, ...props }: Props): React.JSX.Element {
  const matchSize = (): string => {
    switch (props.thumbSize) {
      case "small":
        return clsx("scroll-thumb-sm");
      case "medium":
        return clsx("scroll-thumb-md");
      case "large":
        return clsx("scroll-thumb-lg");
      default:
        return clsx("scroll-thumb-sm");
    }
  };

  const styles = {
    size: matchSize(),
    colors: clsx(
      "scroll-thumb-bg-[#00000080] dark:scroll-thumb-bg-[#ffffff80]",
      //"scroll-track-hover-bg-[#f8f8f8c2] dark:scroll-track-hover-bg-[#d2d2d224]",
      "scroll-track-hover-bg-transparent dark:scroll-track-hover-bg-transparent",
      //"scroll-track-hover-border-[#dfdfdf] dark:scroll-track-hover-border-[#e4e4e452]"
      "scroll-track-hover-border-transparent dark:scroll-track-hover-border-transparent"
    )
  };

  return (
    <MacScrollbar
      {...props}
      ref={ref}
      minThumbSize={0}
      trackGap={[8, 8, 8, 8]}
      suppressAutoHide={props.suppressAutoHide}
      className={twMerge(styles.size, styles.colors, props.className)}
    >
      {props.children}
    </MacScrollbar>
  );
}
