import React from "react"
import { persistStore } from "redux-persist";
import store from "./store";
import { Provider } from "react-redux";

const ReduxProvider = ({children}: {children: React.ReactNode}) => {
    persistStore(store);
  return (
    <Provider store={store}>{children}</Provider>
  )
}

export default ReduxProvider