//import { useElectron } from ".";

import useSWR, { Fetcher } from "swr";
import { AdoptiumReleaseInfo as AdoptiumReleasesInfo } from "@renderer/interfaces";
import { AdoptiumReleaseDetails } from "@renderer/interfaces/adoptium";
import { fetcher } from "@renderer/utils/java";

interface UseAdoptiumResponse {
  releasesInfo: AdoptiumReleasesInfo;
  releaseDetails?: AdoptiumReleaseDetails;
}

const fetchReleasesInfo: Fetcher<AdoptiumReleasesInfo, string> = (url) => fetcher(url);
const fetchReleaseDetails: Fetcher<AdoptiumReleaseDetails | undefined, string> = (url) =>
  fetcher(url);

export function useAdoptium(version?: number | null): UseAdoptiumResponse {
  // TODO: 从Electron主进程获取
  const architecture = "x64";
  const os = "windows";

  const { data: releasesInfo } = useSWR(
    "https://api.adoptium.net/v3/info/available_releases",
    fetchReleasesInfo,
    { suspense: true }
  );

  const { data: releaseDetails } = useSWR(
    version
      ? `https://api.adoptium.net/v3/assets/latest/${version}/hotspot?architecture=${architecture}&image_type=jdk&os=${os}&vendor=eclipse`
      : null,
    fetchReleaseDetails,
    { suspense: true }
  );

  return {
    releasesInfo,
    releaseDetails
  };
}
