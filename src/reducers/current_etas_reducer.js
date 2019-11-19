import {
  RECEIVE_STATIONS,
  RECEIVE_CURRENT_ETAS,
  RECEIVE_STATION_ETA,
  UPDATE_CURRENT_ETAS
} from "../actions/station_actions";
import merge from "lodash/merge";
import findIndex from "lodash/findIndex";
import cloneDeep from "lodash/cloneDeep";

const recentEtasReducer = (state = {}, action) => {
  // Object.freeze(state);
  // let newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_ETAS:
      console.log(action.etas);
      const allEtas = action.etas.slice();
      const results = {};
      allEtas.forEach(ele => {
        results[ele.abbr] = ele;
        // let newEle = JSON.parse(JSON.stringify(ele));

        // ele.etd.forEach((ele2, idx) => {
        //   let obj = {
        //     hexcolor: ele2.estimate[0].hexcolor,
        //     direction: ele2.estimate[0].direction
        //   };
        //   console.log(ele2, ele);
        //   let ele3 = Object.assign({}, ele2, obj);
        //   newEle["etd"][idx] = ele3;
        //   console.log(newEle);
        //   let ele5 = Object.assign({}, newEle);
        //   results[ele.abbr] = ele5;
        // });
      });
      return merge({}, state, results);

    case UPDATE_CURRENT_ETAS:
      const receivedETAS = action.etas.slice();
      const oldETAS = cloneDeep(state);
      console.log(oldETAS);

      receivedETAS.map(eta => {
        let station = eta.abbr;
        console.log(station);
        let currentStation = oldETAS[station];
        console.log(currentStation);
        if (!currentStation) {
          let newEle = JSON.parse(JSON.stringify(eta));
          eta.etd.forEach((ele2, idx) => {
            let obj = {
              hexcolor: ele2.estimate[0].hexcolor,
              direction: ele2.estimate[0].direction
            };
            console.log(ele2, eta);
            let ele3 = Object.assign({}, ele2, obj);
            newEle["etd"][idx] = ele3;
            console.log(newEle);
            let ele5 = Object.assign({}, newEle);
            return (oldETAS[station] = ele5);
          });
        } else {
          let currentDepartures = currentStation.etd;

          eta.etd.map((ele, idx) => {
            let dest = ele.abbreviation;
            let index = findIndex(currentDepartures, function(o) {
              return dest === o.abbreviation;
            });
            console.log(index, dest, currentDepartures);
            if (index > -1) {
              return (currentDepartures[index].estimate = ele.estimate);
            }
          });
        }
      });

      return merge({}, state, oldETAS);
    // case RECEIVE_STATION_ETA:
    //   const currentStation = state[action.abbr];

    //   currentStation.etd = action.eta[0].etd;
    //   const newStation = { [action.abbr]: currentStation };
    //   return merge({}, state, newStation);

    // return merge({}, state, action.etas);
    default:
      return state;
  }
};

export default recentEtasReducer;
