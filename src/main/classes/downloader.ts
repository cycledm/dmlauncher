import crypto from "crypto";
import axios from "axios";
import Stream from "stream";
import fs from "fs";
import path from "path";
import { app } from "electron";
import {
  DownloaderInfoForRenderer,
  DownloadOptions,
  DownloadTask,
  DownloadTaskStatus
} from "@main/interfaces/downloader";

// 默认最大并行下载线程数
const DEFAULT_LIMIT = 16;
// TODO: 最大失败次数
const MAX_FAILS = 3;

type DownloadCallbacks = {
  onProgress?: (data: DownloaderInfoForRenderer) => void;
  onComplete?: () => void;
};

export class Downloader {
  private static limit: number = DEFAULT_LIMIT;
  private static instances: Downloader[] = [];
  private static tasks: DownloadTask[] = [];
  private static running: boolean = false;
  private activeTask: DownloadTask | null = null;

  private constructor() {
    if (Downloader.instances.length >= Downloader.limit) {
      throw new Error(`Maximum number of Downloader instances (${Downloader.limit}) reached.`);
    }
    Downloader.instances.push(this);
    console.log(
      "[Downloader]",
      "A new instance has been created. Total instances:",
      Downloader.instances.length
    );
  }

  /**
   * 获取批量下载是否在进行中
   */
  public static isRunning(): boolean {
    return this.running;
  }

  /**
   * 获取一个等待下载的任务，达到最大失败次数的任务不会被获取
   */
  private static getPendingTask(): DownloadTask | null {
    return (
      this.tasks.find(
        (t) => t.status === "pending" || (t.status === "failed" && (t.fails ?? 0) < MAX_FAILS)
      ) ?? null
    );
  }

  /**
   * 获取一个空闲的下载器实例，如果未达到最大限制，则优先创建一个新的实例
   */
  private static getInactiveInstance(): Downloader | null {
    if (this.instances.length >= this.limit) {
      const inactiveInstance = this.instances.find((instance) => instance.activeTask === null);
      return inactiveInstance ?? null;
    } else {
      return new Downloader();
    }
  }

  /**
   * 获取一个活跃的下载器实例
   */
  private static getActiveInstance(): Downloader | null {
    const activeInstance = this.instances.find((instance) => instance.activeTask !== null);
    return activeInstance ?? null;
  }

  /**
   * 设置最大并行下载线程数
   */
  public static setLimit(limit: number): void {
    if (limit <= 0) limit = DEFAULT_LIMIT;
    Downloader.limit = limit;
  }

  /**
   * 返回下载任务列表
   */
  public static getTasks(): DownloadTask[] {
    return this.tasks;
  }

  /**
   * 计算文件大小（Headers）
   */
  private static async calcTaskSize(task: DownloadTask): Promise<number> {
    try {
      const { headers } = await axios.head(task.url);
      const size = Number(headers["content-length"] ?? headers["Content-Length"] ?? 1);
      task.total = size;
      return size;
    } catch (error) {
      console.error("[Downloader]", "Error calculating task size:", error);
      throw error;
    }
  }

  /**
   * 添加下载任务，同时获取文件的基本信息（Headers）
   */
  public static async pushTask(opt: DownloadOptions): Promise<string> {
    try {
      const { url, directory, filename } = opt;
      // 避免重复添加相同的任务
      const existingTask = this.tasks.find(
        (task) => task.url === url && task.directory === directory && task.filename === filename
      );
      if (existingTask) {
        console.warn("[Downloader]", "Task already exists:", existingTask.id);
        return existingTask.id;
      }

      const id = crypto.randomBytes(16).toString("hex");
      const status: DownloadTaskStatus = "pending";
      const transferred = 0;
      const total = 0;
      const fails = 0;

      const task: DownloadTask = {
        id,
        status,
        url,
        transferred,
        total,
        directory,
        filename,
        fails
      };
      this.tasks.push(task);
      console.log("[Downloader]", "Task added:", task.id);
      // 如果任务是下载中途添加的，则立即计算文件大小
      if (this.running) {
        this.calcTaskSize(task);
      }
      return id;
    } catch (error) {
      console.error("[Downloader]", "Error pushing task:", error);
      throw error;
    }
  }

  /**
   * 启动下载任务（批量）
   */
  public static async start(callbacks?: DownloadCallbacks): Promise<void> {
    if (this.running) return;
    this.running = true;

    // 计算下载进度信息，出于性能考虑，使用计时器
    const interval = setInterval(() => {
      const calcTasks = this.tasks.filter((task) => (task.fails ?? 0) < MAX_FAILS);
      const transferredBytes = calcTasks.reduce((acc, task) => acc + task.transferred, 0);
      const totalBytes = calcTasks.reduce((acc, task) => acc + task.total, 0);
      const totalProgress =
        totalBytes > 0 ? Math.floor((transferredBytes / totalBytes) * 10000) / 100 : 0;
      console.log(
        "[Downloader]",
        `Downloaded: ${totalProgress}% (${transferredBytes} of ${totalBytes} bytes)`
      );
      callbacks?.onProgress?.({
        totalProgress,
        transferredBytes,
        totalBytes,
        tasks: this.tasks
      });

      if (!this.running) {
        // 清除定时器
        clearInterval(interval);
        // 执行回调函数
        callbacks?.onComplete?.();
      }
    }, 100);

    // TODO: 启动下载循环，为每个实例分配下载任务（会阻塞主线程，也许可以在 Worker 中使用）
    /*
    while (this.running) {
      // 等待下载的任务
      const task = this.getPendingTask();
      // 获取一个空闲的下载器实例
      const instance = this.getInactiveInstance();
      // 如果待下载任务和可用实例都不存在，则终止循环（视为下载完成）
      if (!task && !instance) {
        this.running = false;
        continue;
      }

      // 如果没有待下载任务或没有可用实例，则进入下一次循环
      if (!task || !instance) continue;
      // 使用空闲实例开始下载
      instance.activeTask = task;
      task.status = "downloading";
      instance.download();
    }
    // 清除定时器
    clearInterval(interval);
    // 执行回调函数
    callbacks?.onComplete?.();
    */

    // 递归调用此函数进行下载
    const recursiveDownload = (): void => {
      if (!this.running) return;
      // 获取一个等待下载的任务
      const task = this.getPendingTask();
      // 获取一个空闲的下载器实例
      const inactiveInstance = this.getInactiveInstance();
      // 获取一个活跃的下载器实例
      const activeInstance = this.getActiveInstance();
      // 如果待下载任务和任何活跃实例都不存在，则终止循环（视为下载完成）
      if (!task && !activeInstance) {
        this.running = false;
        return;
      }
      // 如果没有待下载任务或没有空闲实例，则直接进行下一次递归
      if (!task || !inactiveInstance) {
        setImmediate(() => recursiveDownload());
        return;
      }
      // 使用空闲实例开始下载
      inactiveInstance.activeTask = task;
      task.status = "downloading";
      inactiveInstance.download();
      setImmediate(() => recursiveDownload());
    };

    recursiveDownload();
  }

  /**
   * 当前实例开始执行被分配的下载任务
   */
  private async download(): Promise<void> {
    if (!this.activeTask) return;
    const task = this.activeTask;
    try {
      const { data, headers, status } = await axios.get<Stream>(task.url, {
        responseType: "stream",
        onDownloadProgress: (progressEvent) => {
          task.transferred = progressEvent.loaded;
          // TODO: 对于没有 Content-Length 的响应，需要额外处理
          task.total = progressEvent.total ?? progressEvent.loaded + 1;
        }
      });
      const filename =
        task.filename ??
        headers["content-disposition"].split("filename=")[1] ??
        headers["Content-Disposition"].split("filename=")[1] ??
        task.id;
      const directory = task.directory ?? app.getPath("downloads");

      if (status === 200) {
        // 确保目录存在
        fs.mkdirSync(directory, { recursive: true });
        // 创建写入流并将数据流写入文件
        const writer = fs.createWriteStream(path.join(directory, filename));
        data.pipe(writer);
        writer.on("finish", () => {
          task.status = "completed";
          this.activeTask = null;
        });
        writer.on("error", (error) => {
          console.error("[Downloader]", `Error downloading file from ${task.url}:`, error);
          task.status = "failed";
          task.fails = (task.fails ?? 0) + 1;
          this.activeTask = null;
        });
      } else {
        throw new Error(`Download failed with status ${status} for URL: ${task.url}`);
      }
    } catch (error) {
      console.error("[Downloader]", error);
      task.status = "failed";
      task.fails = (task.fails ?? 0) + 1;
      this.activeTask = null;
    }
  }
}
