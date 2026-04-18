"use client";

import { PropsWithChildren, useMemo } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";

export function StoreProvider({ children }: PropsWithChildren) {
  const persistedStore = useMemo(() => persistor, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        {children}
      </PersistGate>
    </Provider>
  );
}
