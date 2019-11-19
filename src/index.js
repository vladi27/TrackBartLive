import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";

document.addEventListener("DOMContentLoaded", () => {
  let store;
  const preloadedState = {
    stations: {},
    session: { isAuthenticated: true },
    space_station: {},
    routes: {},
    etas: {},
    trains: []
  };
  store = configureStore();
  window.getState = store.getState;

  window.store = store;

  const root = document.getElementById("root");

  ReactDOM.render(<Root store={store} />, root);
});
