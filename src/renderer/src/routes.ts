import React from "react";
import { RouteObject } from "react-router";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";
import Java from "@renderer/pages/Java";
import Downloads from "@renderer/pages/Downloads";

const routes: RouteObject[] = [
  { id: "home", path: "/", Component: Home },
  { id: "java", path: "/java", Component: Java },
  { id: "downloads", path: "/downloads", Component: Downloads },
  { id: "template", path: "/template", Component: Template },
  { id: "settings", path: "/settings", Component: React.Fragment }
];

export default routes;
