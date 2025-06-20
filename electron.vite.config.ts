import { defineConfig, externalizeDepsPlugin, bytecodePlugin, loadEnv } from "electron-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { resolve } from "path";
import { UserConfig } from "vite";

export default defineConfig(({ mode }) => {
  // 加载保护的环境变量，构建时会将这些变量的值转换为字节码
  const env = loadEnv(mode, process.cwd(), ["PROTECTED_"]);
  const protectedStrings: string[] = [];
  for (const value of Object.values(env)) {
    protectedStrings.push(value);
  }

  // 主进程和预加载脚本的共用配置
  const electronCommonOptions: UserConfig = {
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload"),
        "@global": resolve("src/global"),
      },
    },
    plugins: [externalizeDepsPlugin(), bytecodePlugin({ protectedStrings })],
  };

  return {
    main: {
      ...electronCommonOptions,
      envPrefix: ["COMM_", "MAIN_", "PROTECTED_"],
    },
    preload: {
      ...electronCommonOptions,
      envPrefix: ["COMM_", "PRLD_", "PROTECTED_"],
    },
    renderer: {
      envPrefix: ["COMM_", "RNDR_"],
      resolve: {
        alias: {
          "@renderer": resolve("src/renderer/src"),
          "@global": resolve("src/global"),
        },
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              const fileNames = assetInfo.originalFileNames;
              // 单独处理字体文件
              if (fileNames && fileNames.some((n) => n.includes("node_modules/@fontsource"))) {
                return "fonts/[name]-[hash][extname]";
              }
              return "assets/[name]-[hash][extname]";
            },
          },
        },
      },
      plugins: [
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
        }),
        react({
          babel: {
            plugins: [jotaiDebugLabel, jotaiReactRefresh],
          },
        }),
        tailwindcss(),
      ],
    },
  };
});
