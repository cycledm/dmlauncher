import React from "react";
import { createHashRouter, RouteObject, RouterProvider } from "react-router";
import BaseLayout from "./BaseLayout";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";
import Java from "@renderer/pages/Java";

const mainRoutes: RouteObject[] = [
  { id: "home", path: "/", Component: Home },
  { id: "java", path: "/java", Component: Java },
  { id: "template", path: "/template", Component: Template }
];

const root = createHashRouter([
  {
    path: "/",
    element: <BaseLayout routes={mainRoutes} />,
    children: mainRoutes
  }
]);

export default function Router(): React.JSX.Element {
  return <RouterProvider router={root} />;
}
