import { RouteObject } from "react-router";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";
import Java from "@renderer/pages/Java";

const routes: RouteObject[] = [
  { id: "home", path: "/", Component: Home },
  { id: "java", path: "/java", Component: Java },
  { id: "template", path: "/template", Component: Template }
];

export default routes;
