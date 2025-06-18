// https://github.com/paulmillr/chokidar
import chokidar from "chokidar";
import { parentPort } from "worker_threads";

const port = parentPort;
if (!port) throw new Error("IllegalState");

port.on("message", ({ dir }) => {
  const watcher = chokidar.watch(dir, {
    persistent: true,
    ignoreInitial: true,
  });
  console.log("File Tracker:", "Tracking file changes in", dir);
  watcher.on("all", (event, path) => {
    const listening: (typeof event)[] = ["change", "add", "addDir", "unlink", "unlinkDir"];
    if (listening.includes(event)) {
      port.postMessage({ event, path });
      console.log("File Tracker:", `<${event}>`, path);
    }
  });
});
