import merge from "lodash/merge";
import {
  RECEIVE_ROUTES,
  RECEIVE_ROUTE_STATIONS,
  routes,
  RECEIVE_CURRENT_ETAS,
  CREATE_TRAINS,
  UPDATE_TRAINS,
  ADD_TRAINS,
  REMOVE_TRAINS,
  REMOVE_TRAIN,
  SELECT_TRAIN,
  DESELECT_TRAIN,
  REMOVE_TRACKING,
  REMOVE_ALL_TRAINS,
} from "../actions/station_actions";
import routes2 from "../waypoints/new_routes.json";

import findIndex from "lodash/findIndex";

import stationsData from "../waypoints/new_stations.json";

import find from "lodash/find";

import uniqBy from "lodash/uniqBy";
import uniqWith from "lodash/uniqWith";

const uuidv4 = require("uuid/v4");
const OPTIONS = { units: "kilometers" };

export const ROUTES = {
  1: {
    hexcolor: "#ffff33",
    destination: "Millbrae",
    abbreviation: ["MLBR", "SFIA"],
    direction: "South",
    color: "Yellow",
  },

  2: {
    hexcolor: "#ffff33",
    abbreviation: ["ANTC"],
    destination: "Antioch",
    direction: "North",
    color: "Yellow",
  },

  3: {
    hexcolor: "#ff9933",
    abbreviation: ["RICH"],
    destination: "Richmond",
    direction: "North",
    color: "Orange",
  },

  4: {
    hexcolor: "#ff9933",
    destination: ["Berryessa/North San Jose"],
    abbreviation: ["BERY"],
    direction: "South",
    color: "Orange",
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY"],
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: ["Berryessa/North San Jose"],
    abbreviation: "BERY",

    direction: "North",
  },

  7: {
    color: "Red",
    hexcolor: "#ff0000",

    destination: "Daly City",
    direction: "South",
    abbreviation: ["DALY", "MLBR"],
  },

  8: {
    color: "Red",
    hexcolor: "#ff0000",

    direction: "North",

    destination: "Richmond",
    abbreviation: ["RICH"],
  },
};
const trainsReducer = (state = [], action) => {
  //Object.freeze(state);
  switch (action.type) {
    case CREATE_TRAINS:
      const route = action.route;
      const currentEtas = action.etas;
      const curr = [...state];

      const newTrains = [];

      const routeDestination = ROUTES[route.number].abbreviation;
      const routeDirection = ROUTES[route.number].direction;
      const routeHexcolor = route.hexcolor.toLowerCase();
      let routeStations = route.stations;
      let currentTrains = [];
      const allStat = stationsData;

      let sub = action.sub;

      console.log(routeStations);
      console.log(currentEtas);
      console.log(route);
      console.log(routeHexcolor);

      routeStations.map((station, idx) => {
        let stationName = station.stationName;
        let order = station.order;
        let stationETAs = currentEtas[stationName];
        let prevStation = routeStations[idx - 1];
        if (stationETAs) {
          stationETAs.etd.map((departure) => {
            let dest = departure.abbreviation;
            console.log(dest);
            if (routeDestination.includes(dest)) {
              let estimates = departure.estimate;
              console.log(estimates);
              let currentEstimate = find(estimates, function (o) {
                return o.hexcolor === routeHexcolor;
              });

              console.log(currentEstimate, station);
              if (currentEstimate) {
                let minutes = currentEstimate.minutes;
                let hexcolor = currentEstimate.hexcolor;
                let direction = currentEstimate.direction;
                let cars = currentEstimate.length;
                //let platfrom = currentEstimate.plarf;
                if (minutes === "Leaving" && idx !== routeStations.length - 1) {
                  let id = uuidv4();
                  let train = {
                    dest,
                    hexcolor,
                    //platform: platform,
                    direction: direction,
                    minutes,
                    cars,
                    stationName,
                    route: route.number,
                    lastTrain: false,
                    stationIdx: idx,
                    id,
                    initCoords: station.location,
                    pos: station.location,
                    initialPosition: true,
                  };
                  return newTrains.push(train);
                } else if (minutes !== "Leaving" && prevStation) {
                  // let count = 0;
                  // estimates.forEach(ele => {
                  //   if (
                  //     ele.hexcolor === routeHexcolor &&
                  //     ele.direction === routeDirection
                  //   ) {
                  //     count++;
                  //   }
                  // });
                  let prevName = prevStation.stationName;
                  console.log(prevName);
                  let prevETAs = currentEtas[prevName];

                  if (prevETAs && prevETAs.etd) {
                    let prevDepartures = prevETAs.etd;
                    let prevEstimates = find(prevDepartures, function (o) {
                      return o.abbreviation === dest;
                    });
                    console.log(prevEstimates, station);
                    if (prevEstimates) {
                      let prevTimes = prevEstimates.estimate;
                      let nextInfo = allStat[prevName];
                      let num = route.number;
                      let placeholder = "ROUTE" + " " + num;
                      console.log(placeholder, nextInfo);
                      let dir2;
                      let prevCurrentTime = null;

                      let northRoutes = nextInfo.north_routes.route;
                      let southRoutes = nextInfo.south_routes.route;
                      if (!northRoutes && !southRoutes) {
                        prevCurrentTime = find(prevTimes, function (o) {
                          return o.hexcolor === routeHexcolor;
                        });
                      } else if (northRoutes && !southRoutes) {
                        dir2 = "North";
                        prevCurrentTime = find(prevTimes, function (o) {
                          return (
                            o.hexcolor === routeHexcolor && o.direction === dir2
                          );
                        });
                      } else if (!northRoutes && southRoutes) {
                        dir2 = "South";
                        prevCurrentTime = find(prevTimes, function (o) {
                          return (
                            o.hexcolor === routeHexcolor && o.direction === dir2
                          );
                        });
                      } else if (northRoutes && southRoutes) {
                        console.log(northRoutes, southRoutes);
                        if (northRoutes.includes(placeholder)) {
                          dir2 = "North";
                        } else if (southRoutes.includes(placeholder)) {
                          dir2 = "South";
                        }
                        prevCurrentTime = find(prevTimes, function (o) {
                          return (
                            o.hexcolor === routeHexcolor && o.direction === dir2
                          );
                        });
                      }
                      console.log(prevTimes, station);
                      let prevMinutes = null;
                      if (prevCurrentTime) {
                        {
                          prevMinutes = prevCurrentTime.minutes;
                        }

                        console.log(prevMinutes, station, minutes);
                        let diff;
                        if (prevMinutes) {
                          diff = Number(minutes) - Number(prevMinutes);
                        }
                        if (diff <= 0 || !prevMinutes) {
                          let id2 = uuidv4();
                          let lastTrain = false;
                          //let dir3 = prevCurrentTime.direction;

                          if (idx === routeStations.length - 1) {
                            lastTrain = true;
                          }
                          console.log(prevStation);
                          let train = {
                            dest,
                            hexcolor,
                            direction,
                            minutes,
                            cars,
                            // segments,
                            totalMinutes: Number(minutes),
                            stationName,
                            route: route.number,
                            lastTrain,
                            initCoords: prevStation.location,
                            // waypoints: results,
                            stationIdx: idx,
                            initialPosition: true,
                            id: id2,
                            pos: station.location,
                          };
                          return newTrains.push(train);
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });

      let trains2 = newTrains.sort((a, b) =>
        a.stationIdx > b.stationIdx ? 1 : -1
      );

      let trains3 = [];
      trains2.map((ele, idx) => {
        if (idx === 0) {
          ele["firstTrain"] = true;
        } else {
          ele["firstTrain"] = false;
        }
        trains3.push(ele);
      });

      // const routeTrains = Object.assign({}, { [route.number]: trains3 });
      console.log(curr, trains3);
      const newState = [...curr, ...trains3];
      console.log(newState);

      return newState;

    case REMOVE_TRAINS:
      const routeNum4 = action.routeNum;
      const allUpdatedTrains = [];
      const curTrains = [...state];

      const updTrains = curTrains.filter((ele) => {
        return ele.route !== routeNum4;
      });
      // curTrains = Object.assign({}, allUpdatedTrains);

      // const newTrainsforRoute = { [routeNum4]: curTrains };

      return updTrains;
    case REMOVE_TRAIN:
      const routeNum5 = action.routeNum;
      const id = action.id;
      const curTrains2 = [...state];
      const index = findIndex(curTrains2, function (o) {
        return id === o.id;
      });

      curTrains2.splice(index, 1);

      return curTrains2;
    case REMOVE_ALL_TRAINS:
      return [];
    case SELECT_TRAIN:
      const id2 = action.id;
      const curTrains3 = [...state];
      const train4 = find(curTrains3, function (o) {
        return id2 === o.id;
      });

      train4["selected"] = true;

      return curTrains3;
    case DESELECT_TRAIN:
      const id3 = action.id;
      const curTrains4 = [...state];
      const train5 = find(curTrains4, function (o) {
        return id3 === o.id;
      });

      train5["selected"] = false;

      return curTrains4;

    case REMOVE_TRACKING:
      const trs2 = [...state];
      const trs3 = trs2.map((tra) => {
        if (tra["selected"]) {
          tra["selected"] = false;
        }
        return tra;
      });
      return trs3;
    // curTrains = Object.assign({}, allUpdatedTrains);

    // const newTrainsforRoute = { [routeNum4]: curTrains };

    case ADD_TRAINS:
      const currentTrains5 = [...state];
      const curFirstTrains = currentTrains5.filter((train) => train.firstTrain);
      const currentRoutes12 = [];

      currentTrains5.map((train) => {
        let num = train.route;
        if (!currentRoutes12.includes(num)) {
          currentRoutes12.push(num);
        }
      });

      if (currentRoutes12.length !== curFirstTrains.length) {
        const firstRoutes = curFirstTrains.map((train) => train.route);
        let routes = currentRoutes12.filter(
          (route) => !firstRoutes.includes(route)
        );
        const trains55 = routes.map((route) => {
          let trains2 = currentTrains5.filter((train) => train.route === route);
          let trains24 = trains2.sort((a, b) =>
            a.stationIdx > b.stationIdx ? 1 : -1
          );
          let first = trains24[0];
          curFirstTrains.push(first);
          let id = first.id;
          let train90 = find(currentTrains5, function (o) {
            return o.id === id;
          });
          train90["firstTrain"] = true;
        });
      }
      const currentEtas2 = action.etas;
      const newTrain5 = [];
      const currentRoutes = routes2;
      console.log(curFirstTrains);

      curFirstTrains.map((train, idx) => {
        let num = train.route;
        let stations = currentRoutes[num].stations;
        let trainDest = train.destination;

        let trainID = train.id;
        let trainHexcolor = train.hexcolor;
        let trainDir = train.direction;
        let mins2 = train.minutes;
        let stationIndex = train.stationIdx;
        //let minutes = train.minutes;
        let routeDestination2 = ROUTES[num].abbreviation;
        let routeDir = ROUTES[num].direction;
        let stationSlice = stations.slice(0, stationIndex);

        console.log(stationSlice);
        if (stationSlice.length > 0) {
          return stationSlice.map((station, idx4) => {
            let stationName2 = station.stationName;
            let prevStation = stationSlice[idx4 - 1];
            let currents = currentEtas2[stationName2];
            let departures = [];
            if (currents) {
              departures = currents.etd;
            }
            //let previousStation = currentStationsSlice[idx4 - 1];
            console.log(departures);
            return departures.map((departure) => {
              console.log(departure);
              let dest = departure.abbreviation;

              if (routeDestination2.includes(dest)) {
                let estimates = departure.estimate;

                let currentEstimate = find(estimates, function (o) {
                  return o.hexcolor === trainHexcolor;
                });

                console.log(currentEstimate, station);
                if (currentEstimate) {
                  let minutes = currentEstimate.minutes;
                  let hexcolor = currentEstimate.hexcolor;
                  let direction = currentEstimate.direction;
                  let cars = currentEstimate.length;
                  if (minutes === "Leaving") {
                    let id = uuidv4();
                    let id2 = `${num + stationName2}`;
                    let id3 = `${num + stationName2 + "Leaving"}`;
                    let duplicate = find(currentTrains5, function (o) {
                      return (
                        o.route === num &&
                        o.stationName === stationName2 &&
                        o.minutes === minutes
                      );
                    });
                    if (!duplicate) {
                      let newTrain = {
                        dest,
                        hexcolor,
                        direction: direction,
                        minutes,
                        cars,
                        stationName: stationName2,
                        route: num,
                        lastTrain: false,
                        stationIdx: idx4,
                        id,
                        id2,
                        firstTrain: true,
                        initCoords: station.location,
                        pos: station.location,
                        initialPosition: true,
                      };

                      let index = findIndex(currentTrains5, function (o) {
                        return o.id === trainID;
                      });
                      currentTrains5[index].firstTrain = false;
                      //  train["firstTrain"] = false;

                      return newTrain5.push(newTrain);
                    }
                  } else if (minutes !== "Leaving" && prevStation) {
                    // let count = 0;
                    // estimates.forEach(ele => {
                    //   if (
                    //     ele.hexcolor === routeHexcolor &&
                    //     ele.direction === routeDirection
                    //   ) {
                    //     count++;
                    //   }
                    // });
                    let prevName = prevStation.stationName;
                    console.log(prevName);
                    let prevETAs = currentEtas2[prevName];

                    if (prevETAs && prevETAs.etd) {
                      let prevDepartures = prevETAs.etd;
                      let prevEstimates = find(prevDepartures, function (o) {
                        return o.abbreviation === dest;
                      });
                      console.log(prevEstimates, station);
                      if (prevEstimates) {
                        let prevTimes = prevEstimates.estimate;
                        let nextInfo = stationsData[prevName];

                        let placeholder = "ROUTE" + " " + num;
                        console.log(placeholder, nextInfo);
                        let dir2;
                        let prevCurrentTime = null;

                        let northRoutes = nextInfo.north_routes.route;
                        let southRoutes = nextInfo.south_routes.route;
                        if (!northRoutes && !southRoutes) {
                          prevCurrentTime = find(prevTimes, function (o) {
                            return o.hexcolor === trainHexcolor;
                          });
                        } else if (northRoutes && !southRoutes) {
                          dir2 = "North";
                          prevCurrentTime = find(prevTimes, function (o) {
                            return (
                              o.hexcolor === trainHexcolor &&
                              o.direction === dir2
                            );
                          });
                        } else if (!northRoutes && southRoutes) {
                          dir2 = "South";
                          prevCurrentTime = find(prevTimes, function (o) {
                            return (
                              o.hexcolor === trainHexcolor &&
                              o.direction === dir2
                            );
                          });
                        } else if (northRoutes && southRoutes) {
                          console.log(northRoutes, southRoutes);
                          if (northRoutes.includes(placeholder)) {
                            dir2 = "North";
                          } else if (southRoutes.includes(placeholder)) {
                            dir2 = "South";
                          }
                          prevCurrentTime = find(prevTimes, function (o) {
                            return (
                              o.hexcolor === trainHexcolor &&
                              o.direction === dir2
                            );
                          });
                        }
                        console.log(prevTimes, station);

                        if (prevCurrentTime) {
                          let prevMinutes = prevCurrentTime.minutes;

                          console.log(prevMinutes, station, minutes);
                          let diff = Number(minutes) - Number(prevMinutes);
                          if (diff <= 0) {
                            let id = uuidv4();
                            let id2 = `${num + stationName2}`;
                            let duplicate = find(currentTrains5, function (o) {
                              return (
                                o.route === num &&
                                o.stationName === stationName2 &&
                                o.minutes === minutes
                              );
                            });
                            if (!duplicate) {
                              let newTrain = {
                                dest,
                                hexcolor,
                                direction,
                                minutes,
                                cars,
                                // segments,
                                totalMinutes: Number(minutes),
                                stationName: stationName2,
                                route: num,
                                firstTrain: true,
                                lastTrain: false,
                                initCoords: prevStation.location,
                                // waypoints: results,
                                stationIdx: idx4,
                                initialPosition: true,
                                id,
                                id2,
                                pos: station.location,
                              };
                              let index = findIndex(
                                currentTrains5,
                                function (o) {
                                  return o.id === trainID;
                                }
                              );
                              currentTrains5[index].firstTrain = false;
                              //  train["firstTrain"] = false;

                              return newTrain5.push(newTrain);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
          });
        }
      });
      console.log(newTrain5);

      const newT6 = [...newTrain5, ...currentTrains5];

      const df = newT6.map((train) => {
        let id2 = train.route + train.stationName;
        train["id2"] = id2;
        return train;
      });

      const uniques = uniqBy(df, "id2");
      console.log(uniques, currentTrains5);

      // const uniques = uniqWith(
      //   newT6,
      //   (trainA, trainB) =>
      //     (trainA.route === trainB.route &&
      //       trainA.stationName !== trainB.stationName) ||
      //     trainA.route !== trainB.route
      // );
      return uniques;

    case UPDATE_TRAINS:
      const etas = action.etas;

      let allTrains = [...state];

      let routes = routes2;
      const allStations = stationsData;
      // if (action.routeNum === "2") {
      //   stations = action.stations.slice(0, -3);
      // } else if (action.routeNum === "1") {
      //   stations = action.stations.slice(2, -2);
      // } else {
      //   stations = action.stations.slice(0, -1);
      // }

      const updatedTrains = [];
      const selectedIDs = [];
      let secs = 30000;

      allTrains.map((train, idx) => {
        console.log(train);
        let routeNum = train.route;
        let stations = routes[routeNum].stations;
        let stationLength = stations.length - 1;
        let lastMinutes = train.minutes;
        let trainDestination = train.dest;
        let trainDirection = train.direction;
        let hexcolor = train.hexcolor;
        let lastStation = train.stationName;
        let nextStationName;
        let nextStationEstimates;

        if (stations[train.stationIdx + 1]) {
          nextStationName = stations[train.stationIdx + 1].stationName;
          let nextEtas = etas[nextStationName];
          if (nextEtas) {
            nextStationEstimates = nextEtas.etd;
          }
        }
        let lastEtas = etas[lastStation];
        if (!lastEtas && lastMinutes === "Leaving") {
          let nextDepartures = find(nextStationEstimates, function (o) {
            return o.abbreviation === trainDestination;
          });
          let nextInfo = allStations[nextStationName];
          let placeholder = "ROUTE" + " " + routeNum;
          console.log(placeholder, nextInfo);
          let dir2;

          let northRoutes = nextInfo.north_routes.route;
          let southRoutes = nextInfo.south_routes.route;
          console.log(northRoutes, southRoutes);

          if (northRoutes && southRoutes) {
            if (northRoutes.includes(placeholder)) {
              dir2 = "North";
            } else if (southRoutes.includes(placeholder)) {
              dir2 = "South";
            }
          } else if (northRoutes && !southRoutes) {
            dir2 = "North";
          } else if (!northRoutes && southRoutes) {
            dir2 = "South";
          }

          console.log(nextDepartures, train, dir2);
          let mins;
          //let totalMins;

          let nextEst = find(nextDepartures.estimate, function (o) {
            return o.hexcolor === hexcolor && o.direction === dir2;
          });
          if (!nextEst) {
            nextEst = find(nextDepartures.estimate, function (o) {
              return o.hexcolor === hexcolor;
            });
          }
          console.log(nextEst);
          mins = nextEst.minutes;
          let direc = nextEst.direction;

          if (train.selected) {
            selectedIDs.push(train.id);
          }

          let lastTrain = false;
          if (train.stationIdx + 1 === stationLength) {
            lastTrain = true;
          }

          let id2 = `${routeNum + nextStationName}`;
          let id4 = `${routeNum + nextStationName + mins}`;
          const allTrainsDuplicate = allTrains.slice().map((train) => {
            let id3 = `${train.route + train.stationName + train.minutes}`;
            train["id3"] = id3;
            return train;
          });

          console.log(allTrainsDuplicate);

          let duplicate = find(allTrainsDuplicate, function (o) {
            return o.id3 === id4;
          });

          console.log(duplicate);

          if (!duplicate) {
            let newObj = {
              stationName: nextStationName,

              stationIdx: train.stationIdx + 1,
              minutes: mins,
              //id2,
              // segments,
              totalMinutes: Number(mins),
              direction: direc,
              //departures: nextStationEstimates[index3].estimate[0],
              lastTrain,
              //waypoints: results,
              pos: stations[train.stationIdx + 1].location,
              initialPosition: false,
            };
            console.log(newObj);

            let updatedTrain = Object.assign({}, train, newObj);
            return updatedTrains.push(updatedTrain);
          }
        } else if (lastEtas) {
          let currentStationEstimates = lastEtas.etd;
          let currentDepartures = find(currentStationEstimates, function (o) {
            return o.abbreviation === trainDestination;
          });
          console.log(currentDepartures);
          console.log(lastMinutes);

          if (!currentDepartures && lastMinutes === "Leaving") {
            let nextDepartures = find(nextStationEstimates, function (o) {
              return o.abbreviation === trainDestination;
            });
            let nextInfo = allStations[nextStationName];
            let placeholder = "ROUTE" + " " + routeNum;
            console.log(placeholder, nextInfo);
            let dir2;

            let northRoutes = nextInfo.north_routes.route;
            let southRoutes = nextInfo.south_routes.route;
            console.log(northRoutes, southRoutes);

            if (northRoutes && southRoutes) {
              if (northRoutes.includes(placeholder)) {
                dir2 = "North";
              } else if (southRoutes.includes(placeholder)) {
                dir2 = "South";
              }
            } else if (northRoutes && !southRoutes) {
              dir2 = "North";
            } else if (!northRoutes && southRoutes) {
              dir2 = "South";
            }

            console.log(nextDepartures, train, dir2);
            let mins;
            //let totalMins;

            let nextEst = find(nextDepartures.estimate, function (o) {
              return o.hexcolor === hexcolor && o.direction === dir2;
            });
            if (!nextEst) {
              nextEst = find(nextDepartures.estimate, function (o) {
                return o.hexcolor === hexcolor;
              });
            }
            console.log(nextEst);
            mins = nextEst.minutes;
            let direc = nextEst.direction;

            if (train.selected) {
              selectedIDs.push(train.id);
            }

            let lastTrain = false;
            if (train.stationIdx + 1 === stationLength) {
              lastTrain = true;
            }

            let id2 = `${routeNum + nextStationName}`;
            let id4 = `${routeNum + nextStationName + mins}`;
            const allTrainsDuplicate = allTrains.slice().map((train) => {
              let id3 = `${train.route + train.stationName + train.minutes}`;
              train["id3"] = id3;
              return train;
            });

            console.log(allTrainsDuplicate);

            let duplicate = find(allTrainsDuplicate, function (o) {
              return o.id3 === id4;
            });

            console.log(duplicate);

            if (!duplicate) {
              let newObj = {
                stationName: nextStationName,

                stationIdx: train.stationIdx + 1,
                minutes: mins,
                //id2,
                // segments,
                totalMinutes: Number(mins),
                direction: direc,
                //departures: nextStationEstimates[index3].estimate[0],
                lastTrain,
                //waypoints: results,
                pos: stations[train.stationIdx + 1].location,
                initialPosition: false,
              };
              console.log(newObj);

              let updatedTrain = Object.assign({}, train, newObj);
              return updatedTrains.push(updatedTrain);
            }
          }
          if (currentDepartures) {
            let currentEst = find(currentDepartures.estimate, function (o) {
              return o.hexcolor === hexcolor && o.direction === trainDirection;
            });
            console.log(currentEst, train);
            if (!currentEst && lastMinutes === "Leaving") {
              let nextDepartures = find(nextStationEstimates, function (o) {
                return o.abbreviation === trainDestination;
              });
              let nextInfo = allStations[nextStationName];
              let placeholder = "ROUTE" + " " + routeNum;
              console.log(placeholder, nextInfo);
              let dir2;

              let northRoutes = nextInfo.north_routes.route;
              let southRoutes = nextInfo.south_routes.route;
              console.log(northRoutes, southRoutes);

              if (northRoutes && southRoutes) {
                if (northRoutes.includes(placeholder)) {
                  dir2 = "North";
                } else if (southRoutes.includes(placeholder)) {
                  dir2 = "South";
                }
              } else if (northRoutes && !southRoutes) {
                dir2 = "North";
              } else if (!northRoutes && southRoutes) {
                dir2 = "South";
              }

              console.log(nextDepartures, train, dir2);
              let mins;
              //let totalMins;

              let nextEst = find(nextDepartures.estimate, function (o) {
                return o.hexcolor === hexcolor && o.direction === dir2;
              });
              if (!nextEst) {
                nextEst = find(nextDepartures.estimate, function (o) {
                  return o.hexcolor === hexcolor;
                });
              }
              console.log(nextEst);
              mins = nextEst.minutes;
              let direc = nextEst.direction;

              if (train.selected) {
                selectedIDs.push(train.id);
              }

              let lastTrain = false;
              if (train.stationIdx + 1 === stationLength) {
                lastTrain = true;
              }

              let id2 = `${routeNum + nextStationName}`;
              let id4 = `${routeNum + nextStationName + mins}`;
              const allTrainsDuplicate = allTrains.slice().map((train) => {
                let id3 = `${train.route + train.stationName + train.minutes}`;
                train["id3"] = id3;
                return train;
              });

              console.log(allTrainsDuplicate);

              let duplicate = find(allTrainsDuplicate, function (o) {
                return o.id3 === id4;
              });

              console.log(duplicate);

              if (!duplicate) {
                let newObj = {
                  stationName: nextStationName,

                  stationIdx: train.stationIdx + 1,
                  minutes: mins,
                  //id2,
                  // segments,
                  totalMinutes: Number(mins),
                  direction: direc,
                  //departures: nextStationEstimates[index3].estimate[0],
                  lastTrain,
                  //waypoints: results,
                  pos: stations[train.stationIdx + 1].location,
                  initialPosition: false,
                };
                console.log(newObj);

                let updatedTrain = Object.assign({}, train, newObj);
                return updatedTrains.push(updatedTrain);
              }
            }
            if (currentEst) {
              console.log(currentEst, train);
              let currentMinutes = currentEst.minutes;
              let currentDirection = currentEst.direction;
              let currentHexcolor = currentEst.hexcolor;
              if (lastMinutes === "Leaving" && currentMinutes !== "Leaving") {
                let nextDepartures = find(nextStationEstimates, function (o) {
                  return o.abbreviation === trainDestination;
                });

                let nextInfo = allStations[nextStationName];
                let placeholder = "ROUTE" + " " + routeNum;
                console.log(placeholder, nextInfo);
                let dir2;

                let northRoutes = nextInfo.north_routes.route;
                let southRoutes = nextInfo.south_routes.route;
                console.log(northRoutes, southRoutes);

                if (northRoutes && southRoutes) {
                  if (northRoutes.includes(placeholder)) {
                    dir2 = "North";
                  } else if (southRoutes.includes(placeholder)) {
                    dir2 = "South";
                  }
                } else if (northRoutes && !southRoutes) {
                  dir2 = "North";
                } else if (!northRoutes && southRoutes) {
                  dir2 = "South";
                }

                console.log(nextDepartures, train, dir2);
                let mins;
                //let totalMins;

                let nextEst = find(nextDepartures.estimate, function (o) {
                  return o.hexcolor === hexcolor && o.direction === dir2;
                });
                if (!nextEst) {
                  nextEst = find(nextDepartures.estimate, function (o) {
                    return o.hexcolor === hexcolor;
                  });
                }
                console.log(nextEst);
                mins = nextEst.minutes;
                let direc = nextEst.direction;

                if (train.selected) {
                  selectedIDs.push(train.id);
                }

                let lastTrain = false;
                if (train.stationIdx + 1 === stationLength) {
                  lastTrain = true;
                }

                let id2 = `${routeNum + nextStationName}`;
                let id4 = `${routeNum + nextStationName + mins}`;
                const allTrainsDuplicate = allTrains.slice().map((train) => {
                  let id3 = `${
                    train.route + train.stationName + train.minutes
                  }`;
                  train["id3"] = id3;
                  return train;
                });

                console.log(allTrainsDuplicate);

                let duplicate = find(allTrainsDuplicate, function (o) {
                  return o.id3 === id4;
                });

                console.log(duplicate);

                if (!duplicate) {
                  let newObj = {
                    stationName: nextStationName,

                    stationIdx: train.stationIdx + 1,
                    minutes: mins,
                    //id2,
                    // segments,
                    totalMinutes: Number(mins),
                    direction: direc,
                    //departures: nextStationEstimates[index3].estimate[0],
                    lastTrain,
                    //waypoints: results,
                    pos: stations[train.stationIdx + 1].location,
                    initialPosition: false,
                  };
                  console.log(newObj);

                  let updatedTrain = Object.assign({}, train, newObj);
                  return updatedTrains.push(updatedTrain);
                }
              } else if (
                currentMinutes === "Leaving" &&
                lastMinutes !== "Leaving" &&
                !train.lastTrain
              ) {
                if (train.selected) {
                  selectedIDs.push(train.id);
                }

                let updObj = {
                  minutes: currentMinutes,
                  initialPosition: false,
                  //departures: currentStationEstimates[index].estimate[0]
                };

                let updatedTrain = Object.assign({}, train, updObj);
                console.log(updatedTrain);
                return updatedTrains.push(updatedTrain);
              } else if (Number(currentMinutes) < Number(lastMinutes)) {
                let updObj = {
                  minutes: currentMinutes,
                  initialPosition: false,
                  //departures: currentStationEstimates[index].estimate[0]
                };
                let updatedTrain = Object.assign({}, train, updObj);
                console.log(updatedTrain);
                return updatedTrains.push(updatedTrain);
              } else {
                let updatedTrain = Object.assign({}, train, {
                  initialPosition: false,
                });
                console.log(updatedTrain);
                return updatedTrains.push(updatedTrain);
              }
            }
          }
        }
      });

      // let sorted = updatedTrains.sort((a, b) =>
      //   a.stationIdx > b.stationIdx ? 1 : -1
      // );
      // let updatedSorted = [];
      // console.log(allTrains, updatedTrains);

      // sorted.map((ele, idx) => {
      //   if (idx === 0) {
      //     ele["firstTrain"] = true;
      //   } else {
      //     ele["firstTrain"] = false;
      //   }
      //   updatedSorted.push(ele);
      // });
      //console.log(allTrains, updatedSorted);
      // let abc = uniqBy(updatedSorted, "stationName");
      //console.log(abc);
      // const newObj = Object.assign({}, { [action.routeNum]: abc });

      console.log(updatedTrains);
      //const uniques2 = uniqBy(updatedTrains, "id2");
      const interval = Math.round(secs / selectedIDs.length);
      const newTrains2 = updatedTrains.map((train) => {
        let id = train.id;

        if (selectedIDs.includes(id)) {
          let idx = selectedIDs.indexOf(id);
          train["interval"] = interval;
          train["index"] = idx;
          return train;
        } else {
          return train;
        }
      });
      const df2 = newTrains2.map((train) => {
        let id4 = train.route + train.stationName + train.minutes;
        train["id4"] = id4;
        return train;
      });

      const uniques2 = uniqBy(df2, "id4");

      return uniques2;

    default:
      return state;
  }
};

export default trainsReducer;
