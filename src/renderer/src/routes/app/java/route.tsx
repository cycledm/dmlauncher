import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ScrollBox, SimpleCard } from "@renderer/components/common";
import { useAdoptium } from "@renderer/hooks";

export const Route = createFileRoute("/app/java")({
  component: Java,
});

function Java(): React.JSX.Element {
  const navigate = useNavigate({ from: Route.id });
  const { releasesInfo } = useAdoptium();
  const [showLtsOnly, setShowLtsOnly] = useState(false);
  const [filteredReleases, setFilteredReleases] = useState(releasesInfo.availableReleases);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    const filtered = releasesInfo.availableReleases
      .filter((version) => !showLtsOnly || releasesInfo.availableLtsReleases.includes(version))
      .sort((a: number, b: number) => b - a);
    setFilteredReleases(filtered);
  }, [releasesInfo, showLtsOnly]);

  useEffect(() => {
    if (selectedVersion) {
      navigate({ to: `/app/java/${selectedVersion}`, viewTransition: true });
    }
  }, [navigate, selectedVersion]);

  return (
    <div className="grid size-full grid-cols-[16rem_1fr] select-none">
      <ScrollBox className={clsx("flex flex-col gap-2")}>
        {/* LTS 筛选复选框 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lts-filter"
            checked={showLtsOnly}
            onChange={(e) => setShowLtsOnly(e.target.checked)}
            className={clsx(
              "h-4 w-4",
              "rounded border-gray-300 text-blue-600",
              "dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800",
              "focus:ring-blue-500 dark:focus:ring-blue-600",
            )}
          />
          <label
            htmlFor="lts-filter"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            仅显示 LTS 版本
          </label>
        </div>
        {/* Java 版本列表 */}
        <ul className="flex w-full flex-col gap-2">
          {filteredReleases.map((version) => (
            <li
              key={version}
              onClick={() => setSelectedVersion(version)}
              className={clsx("w-full")}
            >
              <SimpleCard
                className={clsx("cursor-pointer", "hover:outline-blue-700 dark:hover:bg-gray-700", {
                  "bg-gray-100 outline-2 outline-blue-700 dark:bg-gray-700 dark:outline-blue-700":
                    selectedVersion === version,
                  "bg-white outline outline-gray-200 hover:bg-gray-50 dark:bg-gray-800":
                    selectedVersion !== version,
                })}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Adoptium Java {version}</span>
                  {releasesInfo.availableLtsReleases.includes(version) && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">LTS</span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  OpenJDK {version} with HotSpot
                </div>
              </SimpleCard>
            </li>
          ))}
        </ul>
      </ScrollBox>
      <ScrollBox className={clsx("size-full bg-gray-50 p-6 dark:bg-gray-900")}>
        <Outlet />
      </ScrollBox>
    </div>
  );
}
