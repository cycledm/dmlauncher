import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Spinner } from "@renderer/components";
import App from "@renderer/App";

export const Route = createFileRoute("/app")({
  component: () => <App />,
  pendingComponent: () => (
    <div
      className={clsx(
        "h-dvh max-h-dvh w-dvw max-w-dvw",
        "bg-white text-black dark:bg-gray-950 dark:text-white",
        "flex items-center justify-center",
        "select-none"
      )}
    >
      <div
        className={clsx(
          "flex size-full flex-col items-center justify-center gap-8",
          "animate-pulse transition-all duration-500"
        )}
      >
        <h1 className={clsx("font-mono text-5xl font-bold")}>{import.meta.env.COMM_APP_TITLE}</h1>
        <Spinner className={clsx()} center size="4rem" />
      </div>
    </div>
  )
});
