import React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/settings/")({
  component: IndexComponent
});

function IndexComponent(): React.JSX.Element {
  return <></>;
}
