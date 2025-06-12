import React from "react";
import clsx from "clsx";
import { useAdoptium } from "@renderer/hooks";

type Props = {
  version?: number | null;
};

export default function ReleaseDetails({ version }: Props): React.JSX.Element {
  const { releaseDetails } = useAdoptium(version);

  if (!version || !releaseDetails) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">☕</div>
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

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

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
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">基本信息</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">架构</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {releaseDetails.binary.architecture}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">操作系统</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {releaseDetails.binary.os}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">堆内存大小</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {releaseDetails.binary.heapSize}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">镜像类型</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {releaseDetails.binary.imageType.toUpperCase()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">项目</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {releaseDetails.binary.project}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">更新时间</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(releaseDetails.binary.updateAt)}
            </dd>
          </div>
        </dl>
      </div>

      {/* 下载选项 */}
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">下载选项</h2>
          <DownloadCard
            title={releaseDetails.binary.package.name}
            size={formatBytes(releaseDetails.binary.package.size)}
            downloadCount={releaseDetails.binary.package.downloadCount}
            downloadUrl={releaseDetails.binary.package.link}
            checksumUrl={releaseDetails.binary.package.checksumLink}
          />
        </div>
      </div>

      {/* 额外信息 */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
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

interface DownloadCardProps {
  title: string;
  size: string;
  downloadCount: number;
  downloadUrl: string;
  checksumUrl: string;
}

function DownloadCard({
  title,
  size,
  downloadCount,
  downloadUrl,
  checksumUrl
}: DownloadCardProps): React.JSX.Element {
  const handleDownload = (): void => {
    // 这里将来可以集成下载功能
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>大小: {size}</span>
            <span>下载次数: {downloadCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className={clsx(
              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-700",
              "ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              "dark:focus:ring-offset-gray-800"
            )}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            下载
          </button>
          <a
            href={checksumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
              "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              "dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
              "ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              "dark:focus:ring-offset-gray-800"
            )}
          >
            校验和
          </a>
        </div>
      </div>
    </div>
  );
}
