//import { useElectron } from ".";
import { AdoptiumReleasesInfo, AdoptiumReleaseDetails } from "@renderer/interfaces";
import { fetchJava } from "@renderer/utils";
import { useSuspenseQuery } from "@tanstack/react-query";

interface UseAdoptiumResponse {
  releasesInfo: AdoptiumReleasesInfo;
  releaseDetails: AdoptiumReleaseDetails | null;
}

export function useAdoptium(version?: number | null): UseAdoptiumResponse {
  // TODO: 从Electron主进程获取
  const architecture = "x64";
  const os = "windows";

  const { data: releasesInfo } = useSuspenseQuery({
    queryKey: ["https://api.adoptium.net/v3/info/available_releases"],
    queryFn: ({ queryKey }) => fetchJava<AdoptiumReleasesInfo>(queryKey[0]),
  });

  const { data: releaseDetails } = useSuspenseQuery({
    queryKey: [
      `https://api.adoptium.net/v3/assets/latest/${version}/hotspot?architecture=${architecture}&image_type=jdk&os=${os}&vendor=eclipse`,
    ],
    queryFn: ({ queryKey }) => {
      if (!version) return null;
      return fetchJava<AdoptiumReleaseDetails>(queryKey[0]);
    },
  });

  return {
    releasesInfo,
    releaseDetails,
  };
}
