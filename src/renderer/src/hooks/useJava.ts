//import { useElectron } from ".";

import { AdoptiumReleaseInfo } from "@renderer/interfaces";
import { AdoptiumReleaseDetails } from "@renderer/interfaces/adoptium";
import { fetchAdoptiumReleaseDetails, fetchAdoptiumReleases } from "@renderer/utils/java";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import { ref } from "process";
import { cache, use, useEffect, useMemo } from "react";

interface UseJavaResponse {
  adoptiumReleases: AdoptiumReleaseInfo;
  adoptiumReleaseDetails: AdoptiumReleaseDetails | null;
}

const releaseDetailsListAtom = atom<AdoptiumReleaseDetails[]>([]);
const releasesInfoAtom = atomWithRefresh(() => fetchAdoptiumReleases());

export function useJava(version?: number | null): UseJavaResponse {
  //const {} = useElectron();
  //const [releaseDetailsList, setReleaseDetailsList] = useAtom(releaseDetailsListAtom);

  //const releasesInfoAtom = useMemo(() => atomWithRefresh(() => fetchAdoptiumReleases()), []);
  const fetchData = cache(async () => await fetchAdoptiumReleases());
  const adoptiumReleases = use(fetchData());

  //const releaseDetailsListAtom = useMemo(() => atom(async ()))

  // const releaseDetailsAtom = useMemo(
  //   () =>
  //     atom(async () => {
  //       if (!version) return null;
  //       return fetchAdoptiumReleaseDetails(version);
  //     }),
  //   [version]
  // );

  return {
    adoptiumReleases,
    //adoptiumReleaseDetails: useAtomValue(releaseDetailsAtom),
    adoptiumReleaseDetails: null
  };
}
