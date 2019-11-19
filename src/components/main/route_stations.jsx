import Station from "./stations";
import React, { Component, PureComponent } from "react";
import uniq from "lodash/uniq";
const RouteColors2 = {
  "#ffff33": 1,
  "#ff9933": 3,
  "#339933": 5,
  "#ff0000": 7
};
const ROUTES4 = {
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
const RouteStations = React.memo(({ currentRoutes, routes }) => {
  const colors = currentRoutes.map(ele => {
    return ROUTES4[ele.value].hexcolor;
  });
  console.log(colors);

  const uniques = uniq(colors);
  console.log(uniques);

  const routes2 = uniques.map(ele => routes[RouteColors2[ele]]);
  console.log(routes2);

  return routes2.map(route => {
    let hexcolor = route.hexcolor;
    return route.stations.map(ele2 => {
      console.log(ele2);
      let station = ele2.location;
      console.log(station);
      let abbr = ele2.stationName;
      return (
        <Station
          station={station}
          hexcolor={hexcolor}
          key={abbr}
          name={abbr}
        ></Station>
      );
    });
  });
});

export default RouteStations;
