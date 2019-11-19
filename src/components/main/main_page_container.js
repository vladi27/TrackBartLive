import React, { Component, PureComponent } from "react";

import { connect } from "react-redux";
import {
  fetchRouteInfo,
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
  removeTrain
} from "../../actions/station_actions";
import getCombinedState from "../../selectors/loading_selectors";
import debounceRender from "react-debounce-render";

import MainPage from "./main_page";

const mapStateToProps = state => {
  return {
    routes: state.routes,
    // trains: createInitialPosition(state),
    trains: state.trains,
    waypoints: state.waypoints,
    stations: state.stations,
    etas: state.etas,
    loading: getCombinedState(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRoutes: () => dispatch(fetchRoutes()),
    fetchStations: () => dispatch(fetchStations()),
    getCurrentEtas: (routes, route) => dispatch(getCurrentEtas(routes, route)),
    refetchCurrentEtas: (routes, route) =>
      dispatch(refetchCurrentEtas(routes, route)),

    fetchRouteStations: id => dispatch(fetchRouteStations(id)),
    fetchRouteSchedules: id => dispatch(fetchRouteSchedules(id)),
    removeTrains: routeNum => dispatch(removeTrains(routeNum)),
    removeTrain: id => dispatch(removeTrain(id)),
    receiveWayPoints: data => dispatch(receiveWayPoints(data)),

    createTrains: (route, etas, stations) =>
      dispatch(createTrains(route, etas, stations)),
    updateTrains: (routeNum, etas, stations) =>
      dispatch(updateTrains(routeNum, etas, stations)),
    addTrains: route => dispatch(addTrains(route))
  };
};

const DebouncedMain = debounceRender(MainPage);

export default connect(mapStateToProps, mapDispatchToProps)(DebouncedMain);
