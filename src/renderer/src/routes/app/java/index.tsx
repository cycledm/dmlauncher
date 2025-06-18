import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Java from "@renderer/pages/Java";

export const Route = createFileRoute("/app/java/")({
  component: IndexComponent
});

function IndexComponent(): React.JSX.Element {
  return <Java />;
}
