import React, { useEffect } from "react";
import { clsx } from "clsx";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorComponentProps, useRouter } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: ErrorComponentProps): React.JSX.Element {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div
      onClick={() => router.invalidate()}
      className={clsx("flex size-full items-center justify-center", "select-none")}
    >
      {error.message}
    </div>
  );
}
