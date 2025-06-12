import { RouteObject } from "react-router";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";
import Java from "@renderer/pages/Java";
import React from "react";

const routes: RouteObject[] = [
  { id: "home", path: "/", Component: Home },
  { id: "java", path: "/java", Component: Java },
  { id: "downloads", path: "/downloads", Component: React.Fragment },
  { id: "settings", path: "/settings", Component: React.Fragment },
  { id: "template", path: "/template", Component: Template }
];

export default routes;
