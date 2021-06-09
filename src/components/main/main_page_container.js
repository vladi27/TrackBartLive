import React, { Component, PureComponent } from "react";

import { connect } from "react-redux";
import {
  //fetchRouteInfo,
  receiveWayPoints,
  fetchRoutes,
  getCurrentEtas,
  refetchCurrentEtas,
  fetchRouteStations,
  fetchRouteSchedules,
  createTrains,
  updateTrains,
  addTrains,
  removeTrains,
  fetchStations,
  fetchStation,
  removeTrain,
  removeTracking,
  removeAllTrains,
} from "../../actions/station_actions";
import getCombinedState from "../../selectors/loading_selectors";
import debounceRender from "react-debounce-render";

import MainPage from "./main_page";

const mapStateToProps = (state) => {
  return {
    // trains: createInitialPosition(state),
    trains: state.trains,
    waypoints: state.waypoints,
    etas: state.etas,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRoutes: () => dispatch(fetchRoutes()),
    fetchStations: () => dispatch(fetchStations()),
    fetchStation: (abbr) => dispatch(fetchStation(abbr)),
    getCurrentEtas: (routes, route) => dispatch(getCurrentEtas(routes, route)),

    removeTrains: (routeNum) => dispatch(removeTrains(routeNum)),
    removeTrain: (id) => dispatch(removeTrain(id)),
    removeTracking: () => dispatch(removeTracking()),

    removeAllTrains: () => dispatch(removeAllTrains()),
    receiveWayPoints: (data) => dispatch(receiveWayPoints(data)),
    createTrains: (route, etas, stations) =>
      dispatch(createTrains(route, etas, stations)),
    updateTrains: (routeNum, etas, stations) =>
      dispatch(updateTrains(routeNum, etas, stations)),
    addTrains: (route) => dispatch(addTrains(route)),
  };
};

const DebouncedMain = debounceRender(MainPage);

export default connect(mapStateToProps, mapDispatchToProps)(DebouncedMain);
