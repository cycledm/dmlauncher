import { useSuspenseQuery } from "@tanstack/react-query";
import { AdoptiumReleasesInfo, AdoptiumReleaseDetails } from "@renderer/interfaces";
import { fetchJava } from "@renderer/utils";

//import { useElectron } from ".";

interface UseAdoptiumResponse {
  releasesInfo: AdoptiumReleasesInfo;
}

interface UseAdoptiumDetailsResponse {
  releaseDetails: AdoptiumReleaseDetails;
}

export function useAdoptium(): UseAdoptiumResponse {
  const { data: releasesInfo } = useSuspenseQuery({
    queryKey: ["https://api.adoptium.net/v3/info/available_releases"],
    queryFn: ({ queryKey }) => fetchJava<AdoptiumReleasesInfo>(queryKey[0]),
  });

  return { releasesInfo };
}

export function useAdoptiumDetails(version: number): UseAdoptiumDetailsResponse {
  // TODO: 从Electron主进程获取
  const architecture = "x64";
  const os = "windows";

  const { data: releaseDetails } = useSuspenseQuery({
    queryKey: [
      `https://api.adoptium.net/v3/assets/latest/${version}/hotspot?architecture=${architecture}&image_type=jdk&os=${os}&vendor=eclipse`,
    ],
    queryFn: ({ queryKey }) => fetchJava<AdoptiumReleaseDetails>(queryKey[0]),
  });

  return { releaseDetails };
}
