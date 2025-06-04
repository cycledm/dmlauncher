import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { formatHex8, parse } from "culori";

type Props = {
  icon?: string;
};

export default function TitleBar({ icon }: Props): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const setColor = async (): Promise<void> => {
    if (!ref.current) return;
    const focused = await window.api.titlebar.isFocused();
    const bgColor = window.getComputedStyle(ref.current).backgroundColor;
    const textColor = window.getComputedStyle(ref.current).color;
    if (!bgColor || !textColor) return;

    const parsedBgColor = parse(bgColor);
    const parsedTextColor = parse(textColor);
    if (parsedBgColor) parsedBgColor.alpha = 0;
    if (parsedTextColor) parsedTextColor.alpha = focused ? 1 : 0.5;

    const color = formatHex8(parsedBgColor);
    const symbolColor = formatHex8(parsedTextColor);
    if (!color || !symbolColor) return;

    window.api.titlebar.setColor({ color, symbolColor });
  };

  useEffect(() => {
    window.api.titlebar.isFocused().then(setFocused);
    window.api.titlebar.onFocusChange(setFocused);
    window.api.titlebar.onColorModeChange(() => setColor());
  }, []);

  useEffect(() => {
    setColor();
  });

  return (
    <div
      className={clsx(
        "app-drag absolute top-[var(--titlebar-y)] z-100 h-[var(--titlebar-h)] w-dvw overflow-hidden select-none",
        "bg-[#f0f0f0] dark:bg-[#202020]",
        {
          "text-black dark:text-white": focused,
          "text-black/50 dark:text-white/50": !focused
        }
      )}
      draggable={false}
      ref={ref}
    >
      <div className="left-[var(--titlebar-x)] h-full w-[var(--titlebar-w)]">
        <div className="ms-2 flex h-full items-center justify-start gap-1">
          {icon && (
            <img
              className="aspect-square size-[min(1.2rem,calc(var(--titlebar-h)-0.8rem))]"
              src={icon}
            />
          )}
          <span className="font-sans text-sm">{import.meta.env.COMM_APP_TITLE}</span>
        </div>
      </div>
    </div>
  );
}
