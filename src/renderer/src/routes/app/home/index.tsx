import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Home from "@renderer/pages/Home";

export const Route = createFileRoute("/app/home/")({
  component: IndexComponent
});

function IndexComponent(): React.JSX.Element {
  return <Home />;
}
