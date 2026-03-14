"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { PersistConfig } from "redux-persist";
import rootReducer from "./reducers";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

interface NoopStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, _value) {
      return Promise.resolve();
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
  timeout: 6000,
  whitelist: ["user", "image", "post"],     // persist ONLY tiny slices (adjust based on your app)
  blacklist: ["posts", "bulkCategories", "categories", "comments", "fxRates", "secondUser"], // VERY IMPORTANT
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",],
      },
      ignoredPaths: ["err"],
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
