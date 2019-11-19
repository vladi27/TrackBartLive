import merge from "lodash/merge";
import { RECEIVE_WAYPOINTS } from "../actions/station_actions";

const wayPointsreducer = (state = {}, action) => {
  Object.freeze(state);
  // let newState = Object.assign({}, state)
  switch (action.type) {
    case RECEIVE_WAYPOINTS:
      let received = action.waypoints;
      let all_waypoints = {};

      return merge({}, state, received);
    default:
      return state;
  }
};

export default wayPointsreducer;
