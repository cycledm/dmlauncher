export type DownloadTaskStatus = "pending" | "downloading" | "completed" | "failed";

export interface DownloadTask {
  id: string;
  status: DownloadTaskStatus;
  url: string;
  transferred: number;
  total: number;
  directory?: string;
  filename?: string;
  fails?: number;
}

export interface DownloadOptions {
  url: string;
  directory?: string;
  filename?: string;
}

// 用于渲染进程获取下载器信息
export interface DownloaderInfoForRenderer {
  totalProgress: number;
  transferredBytes: number;
  totalBytes: number;
  tasks: DownloadTask[];
}
