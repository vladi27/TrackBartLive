import { combineReducers } from "redux";

import trains from "./train_reducer";
import waypoints from "./waypoints_reducer";
import etas from "./current_etas_reducer";

const RootReducer = combineReducers({
  trains,
  waypoints,
  //schedules,

  etas,
});

export default RootReducer;
