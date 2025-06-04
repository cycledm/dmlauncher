/// <reference types="vite/client" />

/**
 * Vite Environment Variables
 *
 * - `COMM_*`    - Common
 *
 * - `MAIN_*`    - Main
 *
 * - `PRLD_*`    - Preload
 *
 * - `RNDR_*`    - Renderer
 */
interface ImportMetaEnv {
  readonly COMM_APP_TITLE: string;

  readonly MAIN_DEFAULT_WIDTH: number;
  readonly MAIN_DEFAULT_HEIGHT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
