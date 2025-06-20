import "@renderer/styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { DefaultError } from "@renderer/components/common";
import { DefaultPending } from "@renderer/components/common/DefaultPending";
import { routeTree } from "@renderer/route-tree.gen";

const history = createHashHistory();
const router = createRouter({
  routeTree,
  history,
  defaultViewTransition: true,
  defaultPendingComponent: DefaultPending,
  defaultErrorComponent: DefaultError,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
