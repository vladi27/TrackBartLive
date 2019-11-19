import React, { Component, PureComponent } from "react";
import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
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
const Polylines = React.memo(({ currentRoutes, routes, waypoints }) => {
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
    console.log(hexcolor);
    let waypoints3 = [waypoints[Number(route.number) - 1]];
    return waypoints3.map(ele => {
      console.log(ele);
      return <Polyline positions={ele.waypoints} key={hexcolor} />;
    });
  });
});

export default Polylines;
