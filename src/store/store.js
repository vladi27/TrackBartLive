import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {
  updateTrains,
  createTrains,
  addTrains,
  buildWayPoints,
  fetchStation,
  receiveStation
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
  "RECEIVE_STATIONS"
];

const persistenceMiddleware = store => dispatch => action => {
  //const oldState = store.getState();

  const result = dispatch(action);

  if (persistenceActionTypes.includes(action.type)) {
    if (action.type === "RECEIVE_ROUTE_STATIONS") {
      let newState = store.getState();
      handleWaypoints(action, store, newState);
    }
    if (action.type === "RECEIVE_STATIONS") {
      console.log("sta");
      let newState = store.getState();
      handleStations(action, store, newState);
    }

    if (action.type === "RECEIVE_CURRENT_ETAS") {
      //   console.count();
      //   let newState = store.getState();
      //   handleNewTrains(action, store, newState);
      // }'
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

const handleWaypoints = (action, store, newState) => {
  console.log(action);
  const routeNum2 = store.getState().routes[action.stations.number];
  const num3 = routeNum2.number;
  store.dispatch(buildWayPoints(num3));
};
const handleStations = (action, store, newState) => {
  console.log(action);
  const stations = store.getState().stations;
  const arr = Object.keys(stations);
  console.log(arr);
  arr.forEach(ele => {
    console.log(ele);
    APIUtil.getStation(ele).then(res => store.dispatch(receiveStation(res)));
  });
};
// const handleNewTrains = (action, store, newState) => {
//   console.log(action);
//   const routeNum3 = store.getState().routes[action.routeNum];
//   const trains = store.getState().trains[action.routeNum];
//   const etas = store.getState().etas;

//   setTimeout(() => {
//     store.dispatch(addTrains(routeNum3, trains, etas));
//   }, 20000);
// };

const handleUpdate = (action, store, newState) => {
  // const routeTrains = store.getState().trains[action.route.number];
  const routes = store.getState().routes;
  const stations = store.getState().stations;
  const allEtas2 = store.getState().etas;
  const allTrains2 = store.getState().trains;
  console.log(allTrains2);
  //let num = action.route.number;
  //console.log(num);
  if (allTrains2.length > 0) {
    store.dispatch(updateTrains(routes, allEtas2, stations));
  }
};

const handleTrains = (action, store, newState) => {
  const routes3 = store.getState().routes;
  const allEtas3 = store.getState().etas;

  store.dispatch(addTrains(routes3, allEtas3));

  // } else if (action.routes === "update") {
  //   let stations = allRoutes[action.route].stations;
  //   store.dispatch(updateTrains(action.route, allEtas, stations));
  // }
};

const configureStore = (preloadedState = {}) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, logger, persistenceMiddleware, createDebounce())
  );

export default configureStore;
