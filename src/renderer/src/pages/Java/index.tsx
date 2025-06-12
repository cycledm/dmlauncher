import React, { Suspense, useEffect, useState } from "react";
import { useElectron, useAdoptium } from "@renderer/hooks";
import clsx from "clsx";
import Spinner from "@renderer/components/Spinner";
import { ReleaseDetails } from "./components";

export default function Java(): React.JSX.Element {
  const { releasesInfo } = useAdoptium();
  const { setColorMode } = useElectron();
  const [showLtsOnly, setShowLtsOnly] = useState(false);
  const [filteredReleases, setFilteredReleases] = useState(releasesInfo.availableReleases);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    setColorMode("light");
  }, [releasesInfo, setColorMode]);

  useEffect(() => {
    const filtered = releasesInfo.availableReleases
      .filter((version) => !showLtsOnly || releasesInfo.availableLtsReleases.includes(version))
      .sort((a: number, b: number) => b - a);
    setFilteredReleases(filtered);
  }, [releasesInfo, showLtsOnly]);

  return (
    <div className="grid size-full grid-cols-[16rem_1fr]">
      <div className="flex size-full flex-col gap-2 overflow-auto p-2">
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
              "focus:ring-blue-500 dark:focus:ring-blue-600"
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
              className={clsx(
                "w-full p-2",
                "cursor-pointer transition-colors",
                "rounded-lg shadow-sm",
                "",
                "hover:outline-blue-700 dark:hover:bg-gray-700",
                {
                  "bg-gray-100 outline-2 outline-blue-700 dark:bg-gray-700":
                    selectedVersion === version,
                  "bg-white outline outline-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:outline-gray-700":
                    selectedVersion !== version
                }
              )}
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
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full overflow-auto bg-gray-50 p-6 dark:bg-gray-900">
        <Suspense fallback={<Spinner className="size-full" size="4rem" center pulse />}>
          <ReleaseDetails version={selectedVersion} />
        </Suspense>
      </div>
    </div>
  );
}
