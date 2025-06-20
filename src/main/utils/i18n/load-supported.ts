import { app } from "electron";
import { readdirSync, statSync } from "fs";
import { basename, extname, join, resolve } from "path";

/**
 * 加载所有可用的本地化文件信息
 *
 * 优先顺序： `["en-US", "zh-CN", "ja-JP", ...]`
 *
 * 可用命名空间将从上述第一个语言中获取
 *
 * @returns 所有支持的语言和命名空间
 */
export async function loadSupported(): Promise<Global.Types.SupportedLanguages> {
  const priorityLngs = ["en-US", "zh-CN", "ja-JP"];

  const srcPath = resolve(app.getAppPath(), "resources", "locales");

  // Languages
  const directories = readdirSync(srcPath).filter((file) =>
    statSync(join(srcPath, file)).isDirectory(),
  );
  const priority = priorityLngs.filter((dir) => directories.includes(dir));
  const rest = directories.filter((dir) => !priority.includes(dir));
  const languages = [...priority, ...rest];

  // Namespaces
  const files = readdirSync(resolve(srcPath, priorityLngs[0])).filter(
    (file) => extname(file).toLowerCase() === ".json",
  );
  const namespaces = files.map((file) => basename(file, ".json"));

  return { languages, namespaces };
}
