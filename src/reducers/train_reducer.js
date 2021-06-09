import merge from "lodash/merge";
import {
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
import allRoutes from "../waypoints/new_routes.json";
import findIndex from "lodash/findIndex";
import allStations from "../waypoints/new_stations.json";
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
    destination: "Berryessa/North San Jose",
    abbreviation: ["BERY"],
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
    case CREATE_TRAINS: {
      const route = action.route;
      const currentEtas = action.etas;
      const curr = [...state];
      const newTrains = [];
      const routeDestination = ROUTES[route.number].abbreviation;
      const routeDirection = ROUTES[route.number].direction;
      const routeHexcolor = route.hexcolor.toLowerCase();
      const routeStations = route.stations;
      const allStat = allStations;

      routeStations.map((station, idx) => {
        let stationName = station.stationName;
        let stationETAs = currentEtas[stationName];
        let prevStation = routeStations[idx - 1];
        if (stationETAs) {
          stationETAs.etd.map((departure) => {
            let dest = departure.abbreviation;

            if (routeDestination.includes(dest)) {
              let estimates = departure.estimate;

              let currentEstimate = find(estimates, function (o) {
                return o.hexcolor === routeHexcolor;
              });

              if (currentEstimate) {
                let minutes = currentEstimate.minutes;
                let hexcolor = currentEstimate.hexcolor;
                let direction = currentEstimate.direction;
                let cars = currentEstimate.length;

                if (minutes === "Leaving" && idx !== routeStations.length - 1) {
                  let id = uuidv4();
                  let train = {
                    dest,
                    hexcolor,
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
                  let prevName = prevStation.stationName;
                  let prevETAs = currentEtas[prevName];

                  if (prevETAs && prevETAs.etd) {
                    let prevDepartures = prevETAs.etd;
                    let prevEstimates = find(prevDepartures, function (o) {
                      return o.abbreviation === dest;
                    });
                    if (prevEstimates) {
                      let prevTimes = prevEstimates.estimate;
                      // let nextInfo = allStat[prevName];
                      // let num = route.number;
                      // let placeholder = "ROUTE" + " " + num;
                      // let dir2 = routeDirection;
                      // let prevCurrentTime = null;
                      let prevCurrentTime = find(prevTimes, function (o) {
                        return (
                          o.hexcolor === routeHexcolor &&
                          o.direction === routeDirection
                        );
                      });

                      // let northRoutes = nextInfo.north_routes.route;
                      // let southRoutes = nextInfo.south_routes.route;
                      // if (!northRoutes && !southRoutes) {
                      //   prevCurrentTime = find(prevTimes, function (o) {
                      //     return o.hexcolor === routeHexcolor;
                      //   });
                      // } else if (northRoutes && !southRoutes) {
                      //   dir2 = "North";
                      //   prevCurrentTime = find(prevTimes, function (o) {
                      //     return (
                      //       o.hexcolor === routeHexcolor && o.direction === dir2
                      //     );
                      //   });
                      // } else if (!northRoutes && southRoutes) {
                      //   dir2 = "South";
                      //   prevCurrentTime = find(prevTimes, function (o) {
                      //     return (
                      //       o.hexcolor === routeHexcolor && o.direction === dir2
                      //     );
                      //   });
                      // } else if (northRoutes && southRoutes) {
                      //   console.log(northRoutes, southRoutes);
                      //   // if (northRoutes.includes(placeholder)) {
                      //   //   dir2 = "North";
                      //   // } else if (southRoutes.includes(placeholder)) {
                      //   //   dir2 = "South";
                      //   // }
                      //   dir2 = routeDirection;
                      //   prevCurrentTime = find(prevTimes, function (o) {
                      //     return (
                      //       o.hexcolor === routeHexcolor && o.direction === dir2
                      //     );
                      //   });
                      // }

                      let prevMinutes = null;
                      if (prevCurrentTime) {
                        {
                          prevMinutes = prevCurrentTime.minutes;
                        }

                        let diff;
                        if (prevMinutes) {
                          diff = Number(minutes) - Number(prevMinutes);
                        }
                        if (diff <= 0 || !prevMinutes) {
                          let id = uuidv4();
                          let lastTrain = false;

                          if (idx === routeStations.length - 1) {
                            lastTrain = true;
                          }

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
                            id: id,
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

      let sortedTrains = newTrains.sort((a, b) =>
        a.stationIdx > b.stationIdx ? 1 : -1
      );

      let finalTrains = [];
      sortedTrains.map((ele, idx) => {
        if (idx === 0) {
          ele["firstTrain"] = true;
        } else {
          ele["firstTrain"] = false;
        }
        finalTrains.push(ele);
      });

      const newState = [...curr, ...finalTrains];
      return newState;
    }
    case REMOVE_TRAINS: {
      const routeNum = action.routeNum;
      const curTrains = [...state];

      const updTrains = curTrains.filter((ele) => {
        return ele.route !== routeNum;
      });

      return updTrains;
    }
    case REMOVE_TRAIN: {
      const routeNum = action.routeNum;
      const id = action.id;
      const curTrains = [...state];
      const index = findIndex(curTrains, function (o) {
        return id === o.id;
      });

      curTrains.splice(index, 1);

      return curTrains;
    }
    case REMOVE_ALL_TRAINS:
      return [];
    case SELECT_TRAIN: {
      const id = action.id;
      const curTrains = [...state];
      const train = find(curTrains, function (o) {
        return id === o.id;
      });

      train["selected"] = true;
      return curTrains;
    }
    case DESELECT_TRAIN: {
      const id = action.id;
      const curTrains = [...state];
      const train = find(curTrains, function (o) {
        return id === o.id;
      });

      train["selected"] = false;
      return curTrains;
    }

    case REMOVE_TRACKING: {
      const trains = [...state];
      const unselectedTrains = trains.map((tra) => {
        if (tra["selected"]) {
          tra["selected"] = false;
        }
        return tra;
      });
      return unselectedTrains;
    }

    case ADD_TRAINS:
      const currentTrains = [...state];
      const curFirstTrains = currentTrains.filter((train) => train.firstTrain);
      const currentRoutes12 = [];

      currentTrains.map((train) => {
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
          let trains2 = currentTrains.filter((train) => train.route === route);
          let trains24 = trains2.sort((a, b) =>
            a.stationIdx > b.stationIdx ? 1 : -1
          );
          let first = trains24[0];
          curFirstTrains.push(first);
          let id = first.id;
          let train90 = find(currentTrains, function (o) {
            return o.id === id;
          });
          train90["firstTrain"] = true;
        });
      }
      const currentEtas2 = action.etas;
      const newTrain5 = [];
      const currentRoutes = allRoutes;
      console.log(curFirstTrains);

      curFirstTrains.map((train, idx) => {
        let num = train.route;
        let stations = currentRoutes[num].stations;
        let trainID = train.id;
        let trainHexcolor = train.hexcolor;
        let stationIndex = train.stationIdx;
        //let minutes = train.minutes;
        let routeDestination2 = ROUTES[num].abbreviation;
        let routeDir = ROUTES[num].direction;
        let stationSlice = stations.slice(0, stationIndex);

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
                    let duplicate = find(currentTrains, function (o) {
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

                      let index = findIndex(currentTrains, function (o) {
                        return o.id === trainID;
                      });
                      currentTrains[index].firstTrain = false;
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
                    let prevETAs = currentEtas2[prevName];

                    if (prevETAs && prevETAs.etd) {
                      let prevDepartures = prevETAs.etd;
                      let prevEstimates = find(prevDepartures, function (o) {
                        return o.abbreviation === dest;
                      });

                      if (prevEstimates) {
                        let prevTimes = prevEstimates.estimate;
                        // let nextInfo = stationsData[prevName];

                        // let placeholder = "ROUTE" + " " + num;
                        // console.log(placeholder, nextInfo);
                        // let dir2;
                        // let prevCurrentTime = null;
                        let prevCurrentTime = find(prevTimes, function (o) {
                          return (
                            o.hexcolor === trainHexcolor &&
                            o.direction === routeDir
                          );
                        });

                        // let northRoutes = nextInfo.north_routes.route;
                        // let southRoutes = nextInfo.south_routes.route;
                        // if (!northRoutes && !southRoutes) {
                        //   prevCurrentTime = find(prevTimes, function (o) {
                        //     return o.hexcolor === trainHexcolor;
                        //   });
                        // } else if (northRoutes && !southRoutes) {
                        //   dir2 = "North";
                        //   prevCurrentTime = find(prevTimes, function (o) {
                        //     return (
                        //       o.hexcolor === trainHexcolor &&
                        //       o.direction === dir2
                        //     );
                        //   });
                        // } else if (!northRoutes && southRoutes) {
                        //   dir2 = "South";
                        //   prevCurrentTime = find(prevTimes, function (o) {
                        //     return (
                        //       o.hexcolor === trainHexcolor &&
                        //       o.direction === dir2
                        //     );
                        //   });
                        // } else if (northRoutes && southRoutes) {
                        //   dir2 = routeDir;
                        //   // console.log(northRoutes, southRoutes);
                        //   // if (northRoutes.includes(placeholder)) {
                        //   //   dir2 = "North";
                        //   // } else if (southRoutes.includes(placeholder)) {
                        //   //   dir2 = "South";
                        //   // }
                        //   // prevCurrentTime = find(prevTimes, function (o) {
                        //   //   return (
                        //   //     o.hexcolor === trainHexcolor &&
                        //   //     o.direction === dir2
                        //   //   );
                        //   // });
                        // }
                        // console.log(prevTimes, station);

                        if (prevCurrentTime) {
                          let prevMinutes = prevCurrentTime.minutes;

                          console.log(prevMinutes, station, minutes);
                          let diff = Number(minutes) - Number(prevMinutes);
                          if (diff <= 0) {
                            let id = uuidv4();
                            let id2 = `${num + stationName2}`;
                            let duplicate = find(currentTrains, function (o) {
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
                                currentTrains,
                                function (o) {
                                  return o.id === trainID;
                                }
                              );
                              currentTrains[index].firstTrain = false;
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

      const newT6 = [...newTrain5, ...currentTrains];

      const newTrainArray = newT6.map((train) => {
        let id2 = train.route + train.stationName;
        train["id2"] = id2;
        return train;
      });

      const uniques = uniqBy(newTrainArray, "id2");

      return uniques;

    case UPDATE_TRAINS: {
      const etas = action.etas;
      let allTrains = [...state];
      const updatedTrains = [];
      const selectedIDs = [];
      let secs = 30000;

      allTrains.map((train, idx) => {
        let routeNum = train.route;
        let stations = allRoutes[routeNum].stations;
        let stationLength = stations.length - 1;
        let lastMinutes = train.minutes;
        let routeDir = allRoutes[routeNum].direction;
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
          // let nextInfo = allStations[nextStationName];
          // let placeholder = "ROUTE" + " " + routeNum;
          // console.log(placeholder, nextInfo);
          // let dir2 = routeDir;

          // let northRoutes = nextInfo.north_routes.route;
          // let southRoutes = nextInfo.south_routes.route;
          // console.log(northRoutes, southRoutes);

          // if (northRoutes && southRoutes) {
          //   // if (northRoutes.includes(placeholder)) {
          //   //   dir2 = "North";
          //   // } else if (southRoutes.includes(placeholder)) {
          //   //   dir2 = "South";
          //   // }
          //   dir2 = routeDir;
          // } else if (northRoutes && !southRoutes) {
          //   dir2 = "North";
          // } else if (!northRoutes && southRoutes) {
          //   dir2 = "South";
          // }

          // console.log(nextDepartures, train, dir2);
          let mins;
          //let totalMins;

          let nextEst = find(nextDepartures.estimate, function (o) {
            return o.hexcolor === hexcolor && o.direction === routeDir;
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
            // let nextInfo = allStations[nextStationName];
            // let placeholder = "ROUTE" + " " + routeNum;
            // console.log(placeholder, nextInfo);
            // let dir2;

            // let northRoutes = nextInfo.north_routes.route;
            // let southRoutes = nextInfo.south_routes.route;
            // console.log(northRoutes, southRoutes);

            // if (northRoutes && southRoutes) {
            //   if (northRoutes.includes(placeholder)) {
            //     dir2 = "North";
            //   } else if (southRoutes.includes(placeholder)) {
            //     dir2 = "South";
            //   }
            // } else if (northRoutes && !southRoutes) {
            //   dir2 = "North";
            // } else if (!northRoutes && southRoutes) {
            //   dir2 = "South";
            // }

            // console.log(nextDepartures, train, dir2);
            let mins;
            //let totalMins;

            let nextEst = find(nextDepartures.estimate, function (o) {
              return o.hexcolor === hexcolor && o.direction === routeDir;
            });
            if (!nextEst) {
              nextEst = find(nextDepartures.estimate, function (o) {
                return o.hexcolor === hexcolor;
              });
            }

            mins = nextEst.minutes;
            let direc = nextEst.direction;

            if (train.selected) {
              selectedIDs.push(train.id);
            }

            let lastTrain = false;
            if (train.stationIdx + 1 === stationLength) {
              lastTrain = true;
            }

            let id4 = `${routeNum + nextStationName + mins}`;
            const allTrainsDuplicate = allTrains.slice().map((train) => {
              let id3 = `${train.route + train.stationName + train.minutes}`;
              train["id3"] = id3;
              return train;
            });

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
                lastTrain,
                pos: stations[train.stationIdx + 1].location,
                initialPosition: false,
              };

              let updatedTrain = Object.assign({}, train, newObj);
              return updatedTrains.push(updatedTrain);
            }
          }
          if (currentDepartures) {
            let currentEst = find(currentDepartures.estimate, function (o) {
              return o.hexcolor === hexcolor && o.direction === trainDirection;
            });
            if (!currentEst && lastMinutes === "Leaving") {
              let nextDepartures = find(nextStationEstimates, function (o) {
                return o.abbreviation === trainDestination;
              });
              // let nextInfo = allStations[nextStationName];
              // let placeholder = "ROUTE" + " " + routeNum;
              // console.log(placeholder, nextInfo);
              // let dir2;

              // let northRoutes = nextInfo.north_routes.route;
              // let southRoutes = nextInfo.south_routes.route;
              // console.log(northRoutes, southRoutes);

              // if (northRoutes && southRoutes) {
              //   if (northRoutes.includes(placeholder)) {
              //     dir2 = "North";
              //   } else if (southRoutes.includes(placeholder)) {
              //     dir2 = "South";
              //   }
              // } else if (northRoutes && !southRoutes) {
              //   dir2 = "North";
              // } else if (!northRoutes && southRoutes) {
              //   dir2 = "South";
              // }

              // console.log(nextDepartures, train, dir2);
              // let mins;
              //let totalMins;

              let nextEst = find(nextDepartures.estimate, function (o) {
                return o.hexcolor === hexcolor && o.direction === routeDir;
              });
              if (!nextEst) {
                nextEst = find(nextDepartures.estimate, function (o) {
                  return o.hexcolor === hexcolor;
                });
              }

              mins = nextEst.minutes;
              let direc = nextEst.direction;

              if (train.selected) {
                selectedIDs.push(train.id);
              }

              let lastTrain = false;
              if (train.stationIdx + 1 === stationLength) {
                lastTrain = true;
              }

              let id4 = `${routeNum + nextStationName + mins}`;
              const allTrainsDuplicate = allTrains.slice().map((train) => {
                let id3 = `${train.route + train.stationName + train.minutes}`;
                train["id3"] = id3;
                return train;
              });

              let duplicate = find(allTrainsDuplicate, function (o) {
                return o.id3 === id4;
              });

              if (!duplicate) {
                let newObj = {
                  stationName: nextStationName,

                  stationIdx: train.stationIdx + 1,
                  minutes: mins,
                  totalMinutes: Number(mins),
                  direction: direc,
                  lastTrain,
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

                // let nextInfo = allStations[nextStationName];
                // let placeholder = "ROUTE" + " " + routeNum;
                // console.log(placeholder, nextInfo);
                // let dir2;

                // let northRoutes = nextInfo.north_routes.route;
                // let southRoutes = nextInfo.south_routes.route;
                // console.log(northRoutes, southRoutes);

                // if (northRoutes && southRoutes) {
                //   if (northRoutes.includes(placeholder)) {
                //     dir2 = "North";
                //   } else if (southRoutes.includes(placeholder)) {
                //     dir2 = "South";
                //   }
                // } else if (northRoutes && !southRoutes) {
                //   dir2 = "North";
                // } else if (!northRoutes && southRoutes) {
                //   dir2 = "South";
                // }

                // console.log(nextDepartures, train, dir2);
                let mins;
                //let totalMins;

                let nextEst = find(nextDepartures.estimate, function (o) {
                  return o.hexcolor === hexcolor && o.direction === routeDir;
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

                let id4 = `${routeNum + nextStationName + mins}`;
                const allTrainsDuplicate = allTrains.slice().map((train) => {
                  let id3 = `${
                    train.route + train.stationName + train.minutes
                  }`;
                  train["id3"] = id3;
                  return train;
                });

                let duplicate = find(allTrainsDuplicate, function (o) {
                  return o.id3 === id4;
                });

                if (!duplicate) {
                  let newObj = {
                    stationName: nextStationName,
                    stationIdx: train.stationIdx + 1,
                    minutes: mins,
                    totalMinutes: Number(mins),
                    direction: direc,
                    lastTrain,
                    pos: stations[train.stationIdx + 1].location,
                    initialPosition: false,
                  };

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

                return updatedTrains.push(updatedTrain);
              } else if (Number(currentMinutes) < Number(lastMinutes)) {
                let updObj = {
                  minutes: currentMinutes,
                  initialPosition: false,
                };
                let updatedTrain = Object.assign({}, train, updObj);
                return updatedTrains.push(updatedTrain);
              } else {
                let updatedTrain = Object.assign({}, train, {
                  initialPosition: false,
                });
                return updatedTrains.push(updatedTrain);
              }
            }
          }
        }
      });

      const interval = Math.round(secs / selectedIDs.length);
      const newTrains = updatedTrains.map((train) => {
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
      const cleanTrains = newTrains.map((train) => {
        let id4 = train.route + train.stationName + train.minutes;
        train["id4"] = id4;
        return train;
      });

      const uniques = uniqBy(cleanTrains, "id4");
      return uniques;
    }

    default:
      return state;
  }
};

export default trainsReducer;
