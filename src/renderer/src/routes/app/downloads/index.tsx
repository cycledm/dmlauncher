import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import Downloads from "@renderer/pages/Downloads";

export const Route = createFileRoute("/app/downloads/")({
  component: IndexComponent,
});

function IndexComponent(): React.JSX.Element {
  return <Downloads />;
}
