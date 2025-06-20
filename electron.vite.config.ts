import { defineConfig, externalizeDepsPlugin, bytecodePlugin, loadEnv } from "electron-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import { resolve } from "path";
import { UserConfig } from "vite";

const serverOptions: UserConfig = {
  server: {
    proxy: {
      "/api/adoptium": {
        target: "https://api.adoptium.net/v3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adoptium/, ""),
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  // 加载保护的环境变量，构建时会将这些变量的值转换为字节码
  const env = loadEnv(mode, process.cwd(), ["PROTECTED_"]);
  const protectedStrings: string[] = [];
  for (const value of Object.values(env)) {
    protectedStrings.push(value);
  }

  return {
    main: {
      ...serverOptions,
      envPrefix: ["COMM_", "MAIN_", "PROTECTED_"],
      resolve: {
        alias: {
          "@main": resolve("src/main"),
          "@preload": resolve("src/preload"),
          "@shared": resolve("src/shared"),
        },
      },
      plugins: [externalizeDepsPlugin(), bytecodePlugin({ protectedStrings })],
    },
    preload: {
      ...serverOptions,
      envPrefix: ["COMM_", "PRLD_", "PROTECTED_"],
      resolve: {
        alias: {
          "@main": resolve("src/main"),
          "@preload": resolve("src/preload"),
          "@shared": resolve("src/shared"),
        },
      },
      plugins: [externalizeDepsPlugin(), bytecodePlugin({ protectedStrings })],
    },
    renderer: {
      ...serverOptions,
      envPrefix: ["COMM_", "RNDR_"],
      resolve: {
        alias: {
          "@renderer": resolve("src/renderer/src"),
          "@shared": resolve("src/shared"),
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
