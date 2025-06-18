import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { useElectron } from "./useElectron";

type DownloaderInfo = Parameters<Parameters<typeof window.api.downloader.onUpdateProgress>[0]>[0];

const downloaderInfoAtom = atom<DownloaderInfo | null>(null);

interface UseDownloaderResponse {
  downloaderInfo: DownloaderInfo | null;
}

export function useDownloader(): UseDownloaderResponse {
  const { downloader } = useElectron();
  const [downloaderInfo, setDownloaderInfo] = useAtom(downloaderInfoAtom);

  useEffect(() => {
    if (downloaderInfo) return;
    downloader.onUpdateProgress((data: DownloaderInfo) => {
      setDownloaderInfo(data);
    });
  }, [downloader, downloaderInfo, setDownloaderInfo]);

  return { downloaderInfo };
}
