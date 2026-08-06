"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { store, hydrateClientOnly } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  /* Run localStorage hydration in an effect so SSR and the first
   * client render produce identical markup. */
  React.useEffect(() => {
    hydrateClientOnly();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
