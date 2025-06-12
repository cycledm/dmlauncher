import "@renderer/styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "@renderer/App";
import routes from "@renderer/routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
