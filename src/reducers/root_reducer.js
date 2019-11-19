import { combineReducers } from "redux";

import trains from "./train_reducer";
import etas from "./current_etas_reducer";

const RootReducer = combineReducers({
  trains,
  //schedules,

  etas
});

export default RootReducer;
