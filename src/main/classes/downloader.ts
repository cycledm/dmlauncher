import { app } from "electron";
import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import Stream from "stream";

// 默认最大并行下载线程数
const DEFAULT_LIMIT = 16;
// TODO: 最大失败次数
const MAX_FAILS = 3;

type DownloadCallbacks = {
  onStart?: () => void;
  onProgress?: (data: Global.Types.DownloaderInfo) => void;
  onComplete?: () => void;
};

export class Downloader {
  private static limit: number = DEFAULT_LIMIT;
  private static instances: Downloader[] = [];
  private static tasks: Global.Types.DownloadTask[] = [];
  private static timer: NodeJS.Timeout | null = null;
  private static running: boolean = false;
  private activeTask: Global.Types.DownloadTask | null = null;
  private controller: AbortController | null = null;

  private constructor() {
    if (Downloader.instances.length >= Downloader.limit) {
      throw new Error(`Maximum number of Downloader instances (${Downloader.limit}) reached.`);
    }
    Downloader.instances.push(this);
    console.log(
      "[Downloader]",
      "A new instance has been created. Total instances:",
      Downloader.instances.length,
    );
  }

  /**
   * 获取下载器是否在运行中
   */
  public static isRunning(): boolean {
    return this.running;
  }

  /**
   * 获取一个等待下载的任务，达到最大失败次数的任务不会被获取
   */
  private static getPendingTask(): Global.Types.DownloadTask | null {
    return (
      this.tasks.find(
        (t) => t.status === "pending" || (t.status === "failed" && (t.fails ?? 0) < MAX_FAILS),
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
  public static getTasks(): Global.Types.DownloadTask[] {
    return this.tasks;
  }

  /**
   * 计算文件大小（Headers）
   */
  private static async calcTaskSize(task: Global.Types.DownloadTask): Promise<number> {
    try {
      if (task.total > 0) return task.total;
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
  public static pushTask(opt: Global.Types.DownloadOptions): string {
    try {
      const { url, directory, filename } = opt;
      // 避免重复添加相同的任务
      const existingTask = this.tasks.find((task) => task.url === url);
      if (existingTask) {
        console.warn("[Downloader]", "Task already exists:", existingTask.id);
        return existingTask.id;
      }

      const id = crypto.randomBytes(16).toString("hex");
      const status: Global.Types.DownloadTaskStatus = "pending";
      const transferred = 0;
      const total = opt.size ?? 0;
      const fails = 0;

      const task: Global.Types.DownloadTask = {
        id,
        status,
        url,
        transferred,
        total,
        directory,
        filename,
        fails,
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
   * 启动所有下载任务
   */
  public static async startAll(callbacks?: DownloadCallbacks): Promise<void> {
    if (this.running) return;
    this.running = true;

    callbacks?.onStart?.();
    const startTime = Date.now();

    for (const task of this.tasks) {
      await this.calcTaskSize(task);
    }

    // 计算下载进度信息，出于性能考虑，使用计时器
    let lastUpdateTime = startTime;
    let lastUpdateTransferred = 0;
    let lastUpdateSpeed = 0;
    this.timer = setInterval(() => {
      const currentTime = Date.now();
      const duration = currentTime - lastUpdateTime;
      const calcTasks = this.tasks.filter((task) => (task.fails ?? 0) < MAX_FAILS);
      const transferred = calcTasks.reduce((acc, task) => acc + task.transferred, 0);
      const total = calcTasks.reduce((acc, task) => acc + task.total, 0);
      const progress = total > 0 ? Number.parseFloat((transferred / total).toFixed(2)) : 0;
      const percent = total > 0 ? Number.parseFloat(((transferred / total) * 100).toFixed(2)) : 0;
      const calcSpeed = (): number => {
        if (!this.running) return 0;
        if (duration < 1000) return lastUpdateSpeed;
        return Math.floor(((transferred - lastUpdateTransferred) / duration) * 1000 * 100) / 100;
      };
      const speed = calcSpeed();
      console.log("[Downloader]", `Downloaded: ${percent}% (${transferred} of ${total} bytes)`);
      callbacks?.onProgress?.({
        progress,
        percent,
        transferred,
        total,
        startTime,
        speed,
        tasks: this.tasks,
      });
      if (duration >= 1000) {
        lastUpdateTime = currentTime;
        lastUpdateTransferred = transferred;
        lastUpdateSpeed = speed;
      }

      if (!this.running && this.timer) {
        // 清除定时器
        clearInterval(this.timer);
        this.timer = null;
        // 执行回调函数
        callbacks?.onComplete?.();
      }
    }, 50);

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
      inactiveInstance.start();
      setImmediate(() => recursiveDownload());
    };

    recursiveDownload();
  }

  /**
   * 终止所有下载任务
   */
  public static stopAll(): void {
    this.running = false;
    this.instances.forEach((instance) => instance.stop());
    this.tasks.forEach((task) => {
      const { directory, filename } = task;
      if (!directory || !filename) return;
      // 检查文件是否存在
      if (!fs.existsSync(path.join(directory, filename))) return;
      try {
        fs.unlinkSync(path.join(directory, filename));
      } catch (err) {
        console.log("[Downloader]", `Failed to delete file ${filename}:`, err);
      }
    });
    // TODO: 任务状态
    this.tasks = [];
  }

  /**
   * 强制终止下载器，清理正在使用的回调，主要用于在应用退出时调用
   */
  public static terminate(): void {
    if (!this.running) return;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.stopAll();
  }

  /**
   * 当前实例开始执行被分配的下载任务
   */
  private async start(): Promise<void> {
    if (!this.activeTask) return;
    const task = this.activeTask;
    try {
      this.controller = new AbortController();
      task.startTime = Date.now();

      const { data, headers, status } = await axios.get<Stream>(task.url, {
        responseType: "stream",
        onDownloadProgress: (progressEvent) => {
          task.transferred = progressEvent.loaded;
          // TODO: 对于没有 Content-Length 的响应，需要额外处理
          task.total = progressEvent.total ?? progressEvent.loaded + 1;
        },
        signal: this.controller.signal,
      });
      const filename: string =
        task.filename ??
        headers["content-disposition"].split("filename=")[1] ??
        headers["Content-Disposition"].split("filename=")[1] ??
        task.id;
      const directory: string = task.directory ?? app.getPath("downloads");
      task.filename = filename;
      task.directory = directory;

      if (status === 200) {
        // 确保目录存在
        fs.mkdirSync(directory, { recursive: true });
        // 创建写入流并将数据流写入文件
        const writer = fs.createWriteStream(path.join(directory, filename));
        data.pipe(writer);

        // 接收到终止信号时终止写入流
        this.controller.signal.onabort = () => {
          writer.end();
        };

        writer.on("finish", () => {
          task.status = "completed";
          this.activeTask = null;
          this.controller = null;
        });
        writer.on("error", (error) => {
          console.error("[Downloader]", `Error downloading file from ${task.url}:`, error);
          task.status = "failed";
          task.fails = (task.fails ?? 0) + 1;
          this.activeTask = null;
          this.controller = null;
        });
      } else {
        throw new Error(`Download failed with status ${status} for URL: ${task.url}`);
      }
    } catch (error) {
      console.error("[Downloader]", error);
      task.status = "failed";
      task.fails = (task.fails ?? 0) + 1;
      this.activeTask = null;
      this.controller = null;
    }
  }

  /**
   * 当前实例停止下载任务
   */
  private stop(): void {
    this.controller?.abort();
    this.activeTask = null;
  }
}
