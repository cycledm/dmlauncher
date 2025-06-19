import React from "react";
import { Spinner } from "./Spinner";

export function DefaultPending(): React.JSX.Element {
  return <Spinner className="size-full" size="4rem" center pulse />;
}
