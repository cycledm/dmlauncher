import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import prettyBytes from "pretty-bytes";
import { SimpleCard } from "@renderer/components/common";
import { JavaBasicInfoCard } from "@renderer/components/java";
import { useAdoptium, useElectron } from "@renderer/hooks";
import { RiJavaLine } from "react-icons/ri";

export const Route = createFileRoute("/app/java/_version/$version")({
  component: VersionDetails,
});

function VersionDetails(): React.JSX.Element {
  const { version } = Route.useParams();
  const { releaseDetails } = useAdoptium(parseInt(version, 10));
  const { downloader } = useElectron();

  const handleDownload = (url: string): void => {
    downloader.download([{ url }]);
  };

  if (!releaseDetails) {
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

  return (
    <div className="h-full">
      {/* 标题区域 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {releaseDetails.releaseName}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {releaseDetails.vendor} OpenJDK {version} with {releaseDetails.binary.jvmImpl}
        </p>
      </div>

      {/* 基本信息卡片 */}
      <JavaBasicInfoCard details={releaseDetails} />
      {/* 安装选项 */}
      <SimpleCard className="mb-6 h-auto w-full p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">安装选项</h2>
          <button
            onClick={() => handleDownload(releaseDetails.binary.package.link)}
            className="w-32 cursor-pointer rounded-lg bg-blue-700 p-2 hover:brightness-125"
          >
            <span className="font-medium text-white">下载</span>
          </button>
        </div>
        <SimpleCard>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {releaseDetails.binary.package.name}
          </h4>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>大小: {prettyBytes(releaseDetails.binary.package.size, { binary: true })}</span>
            <span>下载次数: {releaseDetails.binary.package.downloadCount.toLocaleString()}</span>
          </div>
        </SimpleCard>
      </SimpleCard>

      {/* 额外信息 */}
      <div className="mt-6 rounded-lg p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">相关链接</h3>
        <div className="space-y-2">
          <a
            href={releaseDetails.releaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            查看发布说明
            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
