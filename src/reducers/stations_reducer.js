import {
  RECEIVE_STATIONS,
  RECEIVE_STATION,
  RECEIVE_CURRENT_ETAS,
  RECEIVE_STATION_ETA,
} from "../actions/station_actions";
import merge from "lodash/merge";

const StationsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_STATIONS:
      let newObj = {};
      action.stations.forEach((ele) => {
        newObj[ele.abbr] = ele;
      });

      return merge({}, state, newObj);
    case RECEIVE_STATION:
      let current = merge({}, state);

      let stnAbbr = action.station.abbr;
      current[stnAbbr] = action.station;

      return merge({}, current);

    case RECEIVE_STATION_ETA:
      const currentStation = state[action.abbr];
      currentStation["etd"] = action.eta;
      const newStation = { [action.abbr]: currentStation };
      return merge({}, state, newStation);

    default:
      return state;
  }
};

export default StationsReducer;
