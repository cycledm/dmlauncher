import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RiJavaLine } from "react-icons/ri";

export const Route = createFileRoute("/app/java/")({
  component: JavaIndex,
});

function JavaIndex(): React.JSX.Element {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex h-20 items-center justify-center text-center">
          <RiJavaLine className="size-full" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
          选择 Java 版本
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          从左侧列表中选择一个 Java 版本来查看详细信息和安装选项
        </p>
      </div>
    </div>
  );
}
