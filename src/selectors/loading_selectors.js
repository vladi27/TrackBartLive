import { createSelector } from "reselect";
import forEach from "lodash/forEach";
import every from "lodash/every";
export const ROUTES = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: ["MLBR", "SFIA"],
    direction: "South",
    color: "Yellow",
    stationLength: 24
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: ["ANTC"],
    destination: "Antioch",
    direction: "North",
    color: "Yellow",
    stationLength: 25
  },

  3: {
    hexcolor: "#ff9933",
    abbreviation: ["RICH"],
    destination: "Richmond",
    direction: "North",
    color: "Orange",
    stationLength: 18
  },

  4: {
    hexcolor: "#ff9933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],
    direction: "South",
    color: "Orange",
    stationLength: 18
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY"],
    stationLength: 19
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],

    direction: "North",
    stationLength: 19
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY", "MLBR"],
    stationLength: 22
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: ["RICH"],
    stationLength: 22
  }
};

const getRoutes = state => state.routes;

const getRoutesState = createSelector([getRoutes], routes => {
  if (!routes) {
    return false;
  } else {
    const routeLength = Object.keys(routes);
    if (routeLength.length >= 8) {
      return true;
    } else {
      return false;
    }
  }
});

const getRouteStations = createSelector(
  [getRoutesState, getRoutes],
  (routesState, routes) => {
    console.log(routesState);
    if (!routesState) {
      return false;
    } else {
      const routesArray = Object.values(routes).slice(0, 8);

      const abc = routesArray.map(ele => {
        let routeNum = Number(ele.number);
        {
          // let routeStations = ele.stations;
          let stationsLength2 = ROUTES[routeNum].stationLength;
          if (ele.stations) {
            console.log(ele.stations.length, stationsLength2, routeNum);
            //console.log(stationsLength2);
            return ele.stations.length === stationsLength2;
          }
        }
        return false;
      });

      console.log(abc);
      if (abc.includes(false)) {
        return false;
      } else {
        return true;
      }
    }
  }
);

const getStationsWaypoints = createSelector(
  [getRoutes, getRouteStations, getRoutesState],
  (routes, stations, routesState) => {
    if (!routesState || !stations) {
      return false;
    } else if (routesState && stations) {
      const routesArray = Object.values(routes).slice(0, 8);

      const abc = routesArray.map(ele => {
        let routeNum = Number(ele.number);

        let routeStations = ele.stations;

        routeStations.map((ele, idx) => {
          if (idx !== routeStations.length - 1) {
            if (ele.slice && ele.slice.length > 0) {
              return true;
            }
          }
        });
      });

      console.log(abc);
      if (abc.includes(false)) {
        return false;
      } else {
        return true;
      }
    }
  }
);

const getCombinedState = createSelector(
  [getRoutesState, getRouteStations, getStationsWaypoints],
  (routes3, stations, waypoints) => {
    console.log(stations);
    if (!routes3 || !stations || !waypoints) {
      return false;
    } else {
      return true;
    }
  }
);

export default getCombinedState;
