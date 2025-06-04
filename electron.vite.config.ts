import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    envPrefix: ["COMM_", "MAIN_"],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload")
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    envPrefix: ["COMM_", "PRLD_"],
    resolve: {
      alias: {
        "@main": resolve("src/main"),
        "@preload": resolve("src/preload")
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    envPrefix: ["COMM_", "RNDR_"],
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
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
          }
        }
      }
    },
    plugins: [
      react({
        babel: {
          plugins: [jotaiDebugLabel, jotaiReactRefresh]
        }
      }),
      tailwindcss()
    ]
  }
});
