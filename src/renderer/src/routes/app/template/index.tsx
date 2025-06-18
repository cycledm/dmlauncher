import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Template from "@renderer/pages/Template";

export const Route = createFileRoute("/app/template/")({
  component: IndexComponent
});

function IndexComponent(): React.JSX.Element {
  return <Template />;
}
