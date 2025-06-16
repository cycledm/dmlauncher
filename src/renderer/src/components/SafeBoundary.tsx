import React, { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useLocation } from "react-router";
import { mutate } from "swr";
import { Spinner } from "./Spinner";

type Props = {
  children: React.ReactNode;
};

/**
 * 安全的边界组件，包含错误边界和加载回退
 *
 * 包含错误重置功能，当发生错误时可以重置状态并重新加载数据
 */
export function SafeBoundary({ children }: Props): React.JSX.Element {
  const location = useLocation();

  const handleReset = async (): Promise<void> => {
    await mutate((key) => typeof key === "undefined", undefined, {
      revalidate: false
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryFallback}
      resetKeys={[location.pathname]}
      onReset={handleReset}
    >
      <Suspense
        fallback={<Spinner className="size-full" size="4rem" center pulse />}
        key={location.pathname}
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorBoundaryFallback({ resetErrorBoundary }: FallbackProps): React.JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Oops, an error has occurred.</h2>
      <button onClick={resetErrorBoundary} className="cursor-pointer">
        Try Again
      </button>
    </div>
  );
}
