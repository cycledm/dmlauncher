import React from "react";
import { HashRouter, Route, Routes } from "react-router";
import BaseLayout from "./BaseLayout";
import { RouteInfo } from "@renderer/interfaces/";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";
import Java from "@renderer/pages/Java";

const mainRoutes: RouteInfo[] = [
  { key: "home", path: "/", element: <Home /> },
  { key: "java", path: "/java", element: <Java /> },
  { key: "template", path: "/template", element: <Template /> }
];

export default function Router(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route element={<BaseLayout routes={mainRoutes} />}>
          {mainRoutes.map(({ key, path, element }) => (
            <Route key={key} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  );
}
