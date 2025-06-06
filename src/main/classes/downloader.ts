import crypto from "crypto";
import axios from "axios";
import Stream from "stream";
import fs from "fs";
import path from "path";
import { app } from "electron";
import {
  DownloaderInfoForRenderer,
  DownloadOptions,
  DownloadTask
} from "@main/interfaces/downloader";

// TODO: 下载线程数
const LIMIT = 16;
// TODO: 最大失败次数
const MAX_FAILS = 3;

export class Downloader {
  private static instances: Downloader[] = [];
  private static tasks: DownloadTask[] = [];
  private activeTask: DownloadTask | null = null;

  // 私有构造函数，防止外部实例化
  private constructor() {
    if (Downloader.instances.length >= LIMIT) {
      throw new Error(`Maximum number of Downloader instances (${LIMIT}) reached.`);
    }
    Downloader.instances.push(this);
  }

  private async download(): Promise<void> {
    const task = Downloader.tasks.find(
      (task) => task.status === "pending" || task.status === "failed"
    );
    if (!task || (task.fails ?? 0) > MAX_FAILS) {
      // 如果没有待下载的任务，或者任务失败次数超过最大限制，则退出
      this.activeTask = null;
      return;
    }

    this.activeTask = task;
    task.status = "downloading";
    const { data, headers, status } = await axios.get<Stream>(task.url, {
      responseType: "stream",
      onDownloadProgress: (progressEvent) => {
        task.transferred = progressEvent.loaded;
        task.total = progressEvent.total ?? 0;
      }
    });
    const filename =
      task.filename ?? headers["content-disposition"].split("filename=")[1] ?? task.id;
    const directory = task.directory ?? app.getPath("downloads");
    if (status === 200) {
      // 确保目录存在
      fs.mkdirSync(directory, { recursive: true });
      // 创建写入流并将数据流写入文件
      const writer = fs.createWriteStream(path.join(directory, filename));
      data.pipe(writer);
      // 下载完成后重新调用 download 方法
      writer.on("finish", () => {
        task.status = "completed";
        this.download();
      });
      writer.on("error", (error) => {
        console.error(`Error downloading file from ${task.url}:`, error);
        task.status = "failed";
        task.fails = (task.fails ?? 0) + 1;
      });
    } else {
      task.status = "failed";
      task.fails = (task.fails ?? 0) + 1;
    }
  }

  private static createInstance(): Downloader | null {
    if (Downloader.instances.length >= LIMIT) {
      const inactiveInstance = Downloader.instances.find(
        (instance) => instance.activeTask === null
      );
      return inactiveInstance ?? null;
    }
    return new Downloader();
  }

  // private static getInstances(): Downloader[] {
  //   return Downloader.instances;
  // }

  public static pushTask(opt: DownloadOptions): string {
    const { url, directory, filename } = opt;

    // 生成唯一的任务 ID
    const id = crypto.randomBytes(16).toString("hex");
    const status = "pending";

    // 创建下载任务对象
    const task: DownloadTask = {
      id,
      status,
      url,
      directory,
      filename,
      transferred: 0,
      total: 0,
      fails: 0
    };

    // 检查任务是否已存在
    const existingTask = Downloader.tasks.find(
      (t) => t.url === url && t.directory === directory && t.filename === filename
    );
    if (existingTask) {
      if (existingTask.status !== "downloading" && existingTask.status !== "completed") {
        existingTask.status = "pending";
        existingTask.transferred = 0;
        existingTask.total = 0;
        existingTask.fails = 0;
      }
      return existingTask.id;
    }

    // 添加任务到任务列表
    Downloader.tasks.push(task);

    return id;
  }

  public static removeTask(id: string): void {
    Downloader.tasks = Downloader.tasks.filter((task) => task.id !== id);
  }

  public static clearTasks(): void {
    Downloader.tasks = [];
  }

  public static async startDownload(
    onProgress?: (info: DownloaderInfoForRenderer) => void,
    onComplete?: () => void
  ): Promise<void> {
    console.log("Calculating download sizes...");
    for (const task of Downloader.tasks) {
      if (task.status !== "pending") continue;
      const res = await axios.head(task.url);
      const length = (res.headers["content-length"] =
        res.headers["content-length"] ?? res.headers["Content-Length"] ?? 0);
      task.total = Number(length);
    }

    const min = Math.min(LIMIT, Downloader.tasks.length);
    console.log("Starting downloads with threads count:", min);
    for (let i = 0; i < min; i++) {
      Downloader.createInstance()?.download();
    }

    // 计算下载进度并输出
    const interval = setInterval(() => {
      const calcTasks = Downloader.tasks.filter((task) => task.status !== "failed");
      const validTasks = calcTasks.filter(
        (task) => task.status !== "failed" && task.status !== "completed"
      );

      const transferredBytes = calcTasks.reduce((acc, task) => acc + task.transferred, 0);
      const totalBytes = calcTasks.reduce((acc, task) => acc + task.total, 0);
      const totalProgress =
        totalBytes > 0 ? Math.floor((transferredBytes / totalBytes) * 10000) / 100 : 0;
      console.log(`Downloaded: ${totalProgress}% (${transferredBytes} of ${totalBytes} bytes)`);
      onProgress?.({
        totalProgress,
        transferredBytes,
        totalBytes,
        tasks: Downloader.tasks
      });

      if (validTasks.length === 0) {
        clearInterval(interval);
        onComplete?.();
        Downloader.clearTasks();
        return;
      }
    }, 100);
  }
}
