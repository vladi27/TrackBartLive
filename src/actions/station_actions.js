import {
  getStations,
  getRouteInfo,
  getInitialStationDataSouth,
  getInitialStationDataNorth,
  getRoutes,
  getSchedules,
  getRouteStations,
  fetchCurrentEtas,
  getStationDepartures,
  getStation

  // getRouteInfo
} from "../util/station_api_util";

import recentEtasReducer from "../reducers/current_etas_reducer";
//import jsonObj from "../waypoints/all_shapes";
export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export const RECEIVE_STATION = "RECEIVE_STATION";
export const RECEIVE_INITIAL_SB_INFO = "RECEIVE_INITIAL_SB_INFO";
export const RECEIVE_INITIAL_NB_INFO = "RECEIVE_INITIAL_NB_INFO";
export const RECEIVE_ROUTE_INFO = "RECEIVE_ROUTE_INFO";
export const RECEIVE_WAYPOINTS = "RECEIVE_WAYPOINTS";
export const RECEIVE_ROUTES = "RECEIVE_ROUTES";
export const RECEIVE_ROUTE_STATIONS = "RECEIVE_ROUTE_STATIONS";
export const RECEIVE_CURRENT_ETAS = "RECEIVE_CURRENT_ETAS";
export const UPDATE_CURRENT_ETAS = "UPDATE_CURRENT_ETAS";
export const RECEIVE_ROUTE_SCHEDULES = "RECEIVE_ROUTE_SCHEDULES";
export const RECEIVE_STATION_ETA = "RECEIVE_STATION_ETA";
export const CREATE_TRAINS = "CREATE_TRAINS";
export const UPDATE_TRAINS = "UPDATE_TRAINS";
export const ADD_TRAINS = "ADD_TRAINS";
export const REMOVE_TRAINS = "REMOVE_TRAINS";
export const REMOVE_TRAIN = "REMOVE_TRAIN";
export const SELECT_TRAIN = "SELECT_TRAIN";
export const DESELECT_TRAIN = "DESELECT_TRAIN";
export const BUILD_WAY_POINTS = "BUILD_WAY_POINTS";
export const REMOVE_TRACKING = "REMOVE_TRACKING";
export const REMOVE_ALL_TRAINS = "REMOVE_ALL_TRAINS";

export const routes = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: "MLBR",
    direction: "South",
    color: "Yellow"
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: "ANTC",
    destination: "Antioch",
    direction: "North",
    color: "Yellow"
  },

  3: {
    hexcolor: "#ffff33",
    abbreviation: "RICH",
    destination: " Richmond",
    direction: "North",
    color: "Orange"
  },

  4: {
    hexcolor: "#ffff33",
    destination: "Warm Springs",
    abbreviation: "WARM",
    direction: "South",
    color: "Orange"
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "DALY",
    direction: "South",
    abbreviation: "DALY"
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Warm Springs",
    abbreviation: "WARM",
    abbreviation: "DALY",
    direction: "North"
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "South",

    destination: "Millbrae",
    abbreviation: "MLBR"
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: "RCH"
  }
};

const receiveRoutes = routes => {
  return {
    type: RECEIVE_ROUTES,
    routes: routes.data.root.routes.route
  };
};
const receiveStations = stations => {
  return {
    type: RECEIVE_STATIONS,
    stations: stations.data.root.stations.station
  };
};
export const receiveStation = station => {
  console.log(station);
  return {
    type: RECEIVE_STATION,
    station: station.data.root.stations.station
  };
};
const receiveCurrentEtas = (etas, routes, route) => {
  return {
    type: RECEIVE_CURRENT_ETAS,
    etas: etas.data.root.station,
    routes,
    route
  };
};
const updateCurrentEtas = (etas, routes, route) => {
  return {
    type: UPDATE_CURRENT_ETAS,
    etas: etas.data.root.station,
    routes,
    route
  };
};
//  const receiveStationEta = (eta, abbr) => {
//   return {
//     type: RECEIVE_STATION_ETA,
//     eta: eta.data.root.station,
//     abbr
//   };
// };

const receiveRouteInfo = info => ({
  type: RECEIVE_ROUTE_INFO,
  info
});

const receiveRouteStations = stations => ({
  type: RECEIVE_ROUTE_STATIONS,
  stations: stations.data.root.routes.route
});
const receiveRouteSchedules = (schedules, id) => ({
  type: RECEIVE_ROUTE_SCHEDULES,
  schedules: schedules.data.root.route,
  id
});

export const addTrains = etas => ({
  type: ADD_TRAINS,
  meta: {
    debounce: {
      time: 300
    }
  },

  etas
});
export const removeTrains = routeNum => ({
  type: REMOVE_TRAINS,

  routeNum
});
export const removeAllTrains = () => ({
  type: REMOVE_ALL_TRAINS
});
export const removeTrain = id => ({
  type: REMOVE_TRAIN,

  id
});

export const selectTrain = id => ({
  type: SELECT_TRAIN,
  id
});
export const deselectTrain = id => ({
  type: DESELECT_TRAIN,
  id
});
export const buildWayPoints = routeNum => ({
  type: BUILD_WAY_POINTS,

  routeNum
});

export const updateTrains = etas => ({
  type: UPDATE_TRAINS,

  meta: {
    debounce: {
      time: 400
    }
  },
  etas
});

export const createTrains = (route, etas) => ({
  type: CREATE_TRAINS,
  route,
  etas
});
export const removeTracking = () => ({
  type: REMOVE_TRACKING
});

export const receiveWayPoints = jsonObj => ({
  type: RECEIVE_WAYPOINTS,
  waypoints: jsonObj
});

// export const getCurrentEtas = (routes, route) => dispatch =>
//   fetchCurrentEtas()
//     .then(etas => dispatch(receiveCurrentEtas(etas, routes, route)))
//     .catch(err => console.log(err));

// export const createTrains = (route, etas, sub) => (dispatch, getState) =>
//   Promise.resolve().then(() => {
//     dispatch({ type: CREATE_TRAINS, route, etas, sub });
//     const allTrains = getState().trains;
//     return allTrains;
//   });

// export const someThenableThunk = someData => (dispatch, getState) => Promise.resolve().then(() => {
//   const { someReducer } = getState();
//   return dispatch({
//     type: actionTypes.SOME_ACTION_TYPE,
//     someData,
//   });
// });

// function getCurrentEtas(routes, route) {
//   return (dispatch) => {
//     dispatch({ type: POST_LOADING });
//     // Returning promise.
//     return fetchCurrentEtas() // async http operation
//       .then(response => {
//         dispatch({ type: POST_SUCCESS, payload: response })
//         // Returning response, to be able to handle it after dispatching async action.
//         return response;
//       })
//       .catch(errorMessage => {
//         dispatch({ type: POST_ERROR, payload: errorMessage })
//         // Throwing an error, to be able handle errors later, in component.
//         throw new Error(errorMessage)
//       });
//   }
// }

export const fetchRouteStations = id => dispatch =>
  getRouteStations(id)
    .then(stations => dispatch(receiveRouteStations(stations)))
    .catch(err => console.log(err));

export const getCurrentEtas = (routes, route) => (dispatch, getState) =>
  fetchCurrentEtas()
    .then(etas => dispatch(receiveCurrentEtas(etas)))
    .catch(err => console.log(err));

export const refetchCurrentEtas = (routes, route) => (dispatch, getState) =>
  fetchCurrentEtas()
    .then(etas => dispatch(updateCurrentEtas(etas)))
    .catch(err => console.log(err));

// export const getCurrentEtas = (routes, route) => (dispatch, getState) =>
//   fetchCurrentEtas().then(etas2 =>
//     Promise.resolve().then(() => {
//       dispatch({
//         type: RECEIVE_CURRENT_ETAS,
//         etas: etas2.data.root.station,
//         routes,
//         route
//       });
//       const etas3 = getState().etas;
//       console.log(etas3);
//       return etas3;
//     })
//   );

export const fetchRouteSchedules = id => dispatch =>
  getSchedules(id)
    .then(schedules => dispatch(receiveRouteSchedules(schedules, id)))
    .catch(err => console.log(err));

export const fetchRoutes = () => dispatch =>
  getRoutes()
    .then(routes => dispatch(receiveRoutes(routes)))
    .catch(err => console.log(err));
export const fetchStations = () => dispatch =>
  getStations()
    .then(stations => dispatch(receiveStations(stations)))
    .catch(err => console.log(err));
export const fetchStation = abbr => dispatch => {
  console.log(abbr);
  return getStation(abbr)
    .then(station => dispatch(receiveStation(station)))
    .catch(err => console.log(err));
};

export const fetchRouteInfo = () => dispatch =>
  getRouteInfo()
    .then(info => dispatch(receiveRouteInfo(info)))
    .catch(err => console.log(err));
