import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {
  updateTrains,
  createTrains,
  addTrains,
  buildWayPoints,
  fetchStation,
  receiveStation,
} from "../actions/station_actions";
import * as APIUtil from "../util/station_api_util";
import createDebounce from "redux-debounced";

import rootReducer from "../reducers/root_reducer";

const persistenceActionTypes = [
  "ADD_TRAINS",
  "RECEIVE_ROUTE_STATIONS",
  "UPDATE_TRAINS",
  "UPDATE_CURRENT_ETAS",
  "RECEIVE_CURRENT_ETAS",
  "RECEIVE_STATIONS",
];

const persistenceMiddleware = (store) => (dispatch) => (action) => {
  const result = dispatch(action);

  if (persistenceActionTypes.includes(action.type)) {
    if (action.type === "RECEIVE_CURRENT_ETAS") {
      let newState = store.getState();
      handleUpdate(action, store, newState);
    }

    if (action.type === "UPDATE_TRAINS") {
      let newState = store.getState();
      handleTrains(action, store, newState);
    }
  }
  return result;
};

const handleUpdate = (action, store, newState) => {
  const allEtas = newState.etas;
  const allTrains = newState.trains;

  if (allTrains.length > 0) {
    store.dispatch(updateTrains(allEtas));
  }
};

const handleTrains = (action, store, newState) => {
  const allEtas3 = newState.etas;
  store.dispatch(addTrains(allEtas3));
};

const configureStore = (preloadedState = {}) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, persistenceMiddleware, createDebounce(), logger)
  );

export default configureStore;
