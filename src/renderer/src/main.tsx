import "@renderer/styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultErrorComponent, Spinner } from "./components";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const history = createHashHistory();
const router = createRouter({
  routeTree,
  history,
  defaultPendingComponent: () => <Spinner className="size-full" size="4rem" center pulse />,
  defaultErrorComponent: DefaultErrorComponent,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
