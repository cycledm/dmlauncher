import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { useElectron } from "./use-electron";

const downloaderInfoAtom = atom<SharedTypes.DownloaderInfo | null>(null);

interface UseDownloaderResponse {
  downloaderInfo: SharedTypes.DownloaderInfo | null;
}

export function useDownloader(): UseDownloaderResponse {
  const { downloader } = useElectron();
  const [downloaderInfo, setDownloaderInfo] = useAtom(downloaderInfoAtom);

  useEffect(() => {
    if (downloaderInfo) return;
    downloader.onUpdateProgress((data: SharedTypes.DownloaderInfo) => {
      setDownloaderInfo(data);
    });
  }, [downloader, downloaderInfo, setDownloaderInfo]);

  return { downloaderInfo };
}
