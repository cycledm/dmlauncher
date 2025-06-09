/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

/**
 * Vite Environment Variables
 *
 * - `PROTECTED_*` - Protected(Encrypted) Environment Variables
 * - `COMM_*`    - All Processes
 * - `MAIN_*`    - Main Process
 * - `PRLD_*`    - Preload Process
 * - `RNDR_*`    - Renderer Process
 */
interface ImportMetaEnv {
  readonly PROTECTED_AZURE_CLIENT_ID: string;
  readonly PROTECTED_AZURE_SECRET_ID: string;

  readonly COMM_APP_TITLE: string;

  readonly MAIN_DEFAULT_WIDTH: number;
  readonly MAIN_DEFAULT_HEIGHT: number;
  readonly MAIN_APP_PROTOCOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
