import "@renderer/styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashHistory, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components";

const history = createHashHistory();
const router = createRouter({
  routeTree,
  history,
  defaultPendingComponent: () => <Spinner className="size-full" size="4rem" center pulse />,
  defaultErrorComponent: ({ error }) => <div>{error.message}</div>,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0
});

const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
