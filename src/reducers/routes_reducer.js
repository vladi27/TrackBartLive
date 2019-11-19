import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS,
  CREATE_TRAINS,
  UPDATE_TRAINS,
  ADD_TRAINS,
  BUILD_WAY_POINTS
} from "../actions/station_actions";
import indexOf from "lodash/indexOf";
import cloneDeep from "lodash/cloneDeep";
import findIndex from "lodash/findIndex";
import * as geolib from "geolib";
import jsonObject from "../waypoints/all_shapes.json";
//import geoJsonObject from "../waypoints/geo_format";
import stations2 from "../waypoints/all_stations";

const ROUTE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const uuidv4 = require("uuid/v4");

export const ROUTES = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: ["MLBR", "SFIA"],
    direction: "South",
    color: "Yellow"
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: ["ANTC"],
    destination: "Antioch",
    direction: "North",
    color: "Yellow"
  },

  3: {
    hexcolor: "#ff9933",
    abbreviation: ["RICH"],
    destination: "Richmond",
    direction: "North",
    color: "Orange"
  },

  4: {
    hexcolor: "#ff9933",
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],
    direction: "South",
    color: "Orange"
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY"]
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: ["Warm Springs"],
    abbreviation: "WARM",

    direction: "North"
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY", "MLBR"]
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: ["RICH"]
  }
};

const allStationsObj = stations2[0];

const routesReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ROUTES:
      const routes = action.routes;

      const newRoutes = {};
      const allKeys = Object.keys(routes);

      allKeys.forEach((ele, idx) => {
        let obj = routes[ele];
        let num = obj.number;
        obj["waypoints"] = jsonObject[Number(num) - 1];
        // let newObj = {};
        // newObj["key"] = "routes";
        // newObj["title"] = obj.name;
        // newObj["id"] = idx;
        // newObj["selected"] = false;
        // newObj["number"] = obj.number;

        newRoutes[num] = Object.assign({}, obj);
      });

      return merge({}, state, newRoutes);

    case RECEIVE_ROUTE_STATIONS:
      const num = action.stations.number;
      const route = state[num];
      const allStations = action.stations.config.station;

      const abc2 = allStations.map((station, idx) => {
        let obj = {};
        let station2Lat = allStationsObj[station].gtfs_latitude;
        let station2Long = allStationsObj[station].gtfs_longitude;
        let arr = [station2Lat, station2Long];
        obj["stationName"] = station;
        obj["trains"] = [];
        obj["location"] = arr;
        obj["stationOrder"] = idx;
        return obj;
      });

      let abc3;

      if (num === "2") {
        abc3 = abc2.slice(0, -3);
      } else if (num === "1") {
        abc3 = abc2.slice(2, -2);
      } else {
        abc3 = abc2.slice(0, -1);
      }

      route["stations"] = abc3;

      const updateRoute = { [route.number]: route };

      return merge({}, state, updateRoute);

    case BUILD_WAY_POINTS:
      const route2 = state[action.routeNum];
      const waypoints = jsonObject[Number(action.routeNum) - 1];
      //const geoWaypoints = geoJsonObject[Number(action.routeNum) - 1];
      const stations2 = route2.stations;

      console.log(stations2);

      console.log(waypoints);

      const routeLength = stations2.length - 1;

      const newStations2 = stations2.map((station, idx) => {
        if (idx !== routeLength) {
          let nextStation = stations2[idx + 1];
          let stationLocation = [station.location[0], station.location[1]];
          let nextStationLocation = [
            nextStation.location[0],
            nextStation.location[1]
          ];
          console.log(stationLocation, nextStationLocation);
          let stationCoord = geolib.findNearest(
            stationLocation,
            waypoints.waypoints
          );

          let coordIndex = indexOf(waypoints.waypoints, stationCoord);
          let coord = waypoints.waypoints[coordIndex];
          //let geoCoord = geoWaypoints.waypoints[coordIndex];

          let nextStationCoord = geolib.findNearest(
            nextStationLocation,
            waypoints.waypoints
          );

          let nextCoordIndex = indexOf(waypoints.waypoints, nextStationCoord);
          // let geoNextCoordIndex = indexOf(
          //   geoWaypoints.waypoints,
          //   nextStationCoord
          // );

          console.log(coordIndex, nextCoordIndex);

          let nextCoord = waypoints.waypoints[nextCoordIndex];

          let slice = waypoints.waypoints.slice(coordIndex, nextCoordIndex);
          //   let geoSlice = geoWaypoints.waypoints.slice(
          //     coordIndex,
          //     nextCoordIndex
          //   );
          //   let meterDistance = geolib.getPathLength(geoSlice);

          console.log(slice);

          let obj = {
            slice
            //meterDistance
            //geoSlice
          };

          let newStation = Object.assign({}, station, obj);

          return newStation;
        } else {
          return station;
        }
      });

      route2["stations"] = newStations2;

      const updateRoute2 = { [route2.number]: route2 };

      return merge({}, state, updateRoute2);

    default:
      return state;
  }
};

export default routesReducer;
