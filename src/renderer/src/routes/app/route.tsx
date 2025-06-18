import React, { useEffect } from "react";
import { createFileRoute, ErrorComponentProps, useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Spinner } from "@renderer/components";
import App from "@renderer/App";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { cn } from "@renderer/utils";

export const Route = createFileRoute("/app")({
  component: App,
  pendingComponent: CustomPendingComponent,
  errorComponent: CustomErrorComponent
});

function Layout({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      {...props}
      className={cn(
        "h-dvh max-h-dvh w-dvw max-w-dvw",
        "bg-white text-black dark:bg-gray-950 dark:text-white",
        "flex items-center justify-center",
        "select-none",
        className
      )}
    >
      {children}
    </div>
  );
}

function CustomPendingComponent(): React.JSX.Element {
  return (
    <Layout>
      <div
        className={clsx(
          "flex size-full flex-col items-center justify-center gap-8",
          "animate-pulse transition-all duration-500"
        )}
      >
        <h1 className={clsx("font-mono text-5xl font-bold")}>{import.meta.env.COMM_APP_TITLE}</h1>
        <Spinner className={clsx()} center size="4rem" />
      </div>
    </Layout>
  );
}

function CustomErrorComponent({ error }: ErrorComponentProps): React.JSX.Element {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return <Layout onClick={() => router.invalidate()}>{error.message}</Layout>;
}
