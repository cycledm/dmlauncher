import { app } from "electron";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * 从资源目录读取指定的本地化文件
 *
 * @param language 语言代码（文件夹）
 * @param namespace 命名空间（文件名）
 * @returns 本地化 JSON 数据
 */
export async function loadResource(
  language: string,
  namespace: string,
): Promise<Record<string, string>> {
  const filePath = resolve(app.getAppPath(), "resources", "locales", language, `${namespace}.json`);
  return JSON.parse(readFileSync(filePath, "utf-8"));
}
