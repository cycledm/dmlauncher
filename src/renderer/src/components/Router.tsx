import React from "react";
import { HashRouter, Route, Routes } from "react-router";
import BaseLayout from "./BaseLayout";
import RouteInfo from "@renderer/interfaces/route-info";
import Template from "@renderer/pages/Template";
import Home from "@renderer/pages/Home";

const mainRoutes: RouteInfo[] = [
  { key: "home", path: "/", element: <Home /> },
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
