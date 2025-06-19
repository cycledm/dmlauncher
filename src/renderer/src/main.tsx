import "@renderer/styles/main.css";
import React from "react";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { DefaultError } from "@renderer/components/common";
import { DefaultPending } from "@renderer/components/common/DefaultPending";
import { routeTree } from "@renderer/routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const history = createHashHistory();
const router = createRouter({
  routeTree,
  history,
  defaultPendingComponent: DefaultPending,
  defaultErrorComponent: DefaultError,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
