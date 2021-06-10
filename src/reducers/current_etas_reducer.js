import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS,
  RECEIVE_STATION_ETA,
  UPDATE_CURRENT_ETAS,
} from "../actions/station_actions";
import merge from "lodash/merge";
import findIndex from "lodash/findIndex";
import cloneDeep from "lodash/cloneDeep";

const recentEtasReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      const allEtas = action.etas.slice();
      const results = {};
      allEtas.forEach((ele) => {
        results[ele.abbr] = ele;
      });
      return results;

    default:
      return state;
  }
};

export default recentEtasReducer;
