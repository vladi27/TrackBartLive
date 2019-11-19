import React, { Component, PureComponent } from "react";
//import "leaflet/dist/leaflet.css";
//import "leaflet/dist/leaflet.css";

import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import L from "leaflet";
// import { DropdownMultiple, Dropdown } from "reactjs-dropdown-component";
import Select from "react-select";
import jsonObject from "../../waypoints/all_shapes.json";
import routes2 from "../../waypoints/routes.json";
import stations2 from "../../waypoints/stations.json";
import allWayPoints from "../../waypoints/all_waypoints.json";
import { throws } from "assert";
import WindowedSelect from "react-windowed-select";

import uniq from "lodash/uniq";
import Station from "./stations";
import { components, createFilter } from "react-windowed-select";
import findIndex from "lodash/findIndex";
import Loader from "react-loader-spinner";

import { css } from "@emotion/core";
import { MoonLoader } from "react-spinners";
import NewMarker from "./marker";
import Polylines from "./Polylines";
import SelectorContainer from "./selector_container";
import RouteStations from "./route_stations";
import { convertSpeed } from "geolib";
import Trains from "./trains";
// const data = require("json!./../../src/waypoints/all_shapes");
const isEqual = require("react-fast-compare");

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
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
    direction: "North",
    abbreviation: ["DALY"]
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Warm Springs",
    abbreviation: ["WARM"],

    direction: "South"
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

const RouteColors = {
  Yellow: 1,
  Orange: 3,
  Green: 5,
  Red: 7
};
const RouteColors2 = {
  "#ffff33": 1,
  "#ff9933": 3,
  "#339933": 5,
  "#ff0000": 7
};
console.log(RouteColors2[ROUTES4[8].hexcolor]);

const options = [
  // {
  //   value: "20",
  //   label: "Oakland Int'l Airport - Coliseum"
  // },
  // {
  //   value: "19",
  //   label: "Coliseum - Oakland Int'l Airport"
  // },
  // {
  //   value: "14",
  //   label: "SFO - Millbrae"
  // },
  // {
  //   value: "13",
  //   label: "Millbrae - SFO"
  // },
  // {
  //   value: "12",
  //   label: "Daly City - Dublin/Pleasanton"
  // },
  // {
  //   value: "11",
  //   label: "Dublin/Pleasanton - Daly City"
  // },
  // {
  //   value: "10",
  //   label: "MacArthur - Dublin/Pleasanton"
  // },
  // {
  //   value: "9",
  //   label: "Dublin/Pleasanton - MacArthur"
  // },
  {
    value: "8",
    label: "Millbrae/Daly City - Richmond"
  },
  {
    value: "7",
    label: "Richmond - Daly City/Millbrae"
  },
  {
    value: "6",
    label: "Daly City - Warm Springs/South Fremont"
  },
  {
    value: "5",
    label: "Warm Springs/South Fremont - Daly City"
  },
  {
    value: "4",
    label: "Richmond - Warm Springs/South Fremont"
  },
  {
    value: "3",
    label: "Warm Springs/South Fremont - Richmond"
  },
  {
    value: "2",
    label: "Millbrae/SFIA - Antioch"
  },
  {
    value: "1",
    label: "Antioch - SFIA/Millbrae"
  }
];

class MainPage extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   routes: this.props.routes
    //   // stations: [{longitude: "-43.7833", latitude: "-5.3823"}],
    //   // space_station: {longitude: "-43.7833", latitude: "-5.3823"},
    //   // map : this.mymap,
    //   // marker: this.circleMarker
    // };

    this.state = {
      currentSelections: [],
      etas: {},
      trains: {},
      refs: [],
      hexcolors: [],
      update: 0,
      trains: [],
      zoom: 11
    };
    this.timer = 0;
    //this.renderStops = this.renderStops.bind(this);
    // this.drawPolyline = this.drawPolyline.bind(this);
    this.interval = null;
    this.handleRefs = this.handleRefs.bind(this);
    //this.getMap = this.getMap.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.mapRef = React.createRef();
    this.bounds = null;
    this.zoom = null;
    this.trainsRef = React.createRef();

    //this.customFilter = this.customFilter.bind(this);
  }

  componentDidMount() {
    const routeIds = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const routes = this.props.routes;

    // this.props.receiveWayPoints(jsonObject);
    // this.props.fetchSpaceStation();
    // then(response =>
    //   this.setState({ space_station: response.space_station })
    // );
    // this.props
    //   .fetchRoutes()

    //   .then(() => {
    //     routeIds.map(ele => {
    //       this.props.fetchRouteStations(ele);
    //       // this.props.fetchRouteSchedules(ele);
    //     });
    //   });

    // console.count();
    // routeIds.map(id => this.props.fetchRouteStations(id));
    this.props.getCurrentEtas();
    // this.props.fetchStations();
    //   .then(response => this.setState({ etas: this.props.etas }));

    // this.props.fetchRouteSchedules(1);

    //this.props.receiveWayPoints(jsonObject);
    setTimeout(() => {
      this.handleTimer();
    }, 15000);
    // setTimeout(() => {
    //   this.props.getCurrentEtas("create");
    //   //.then(result => {
    //   //   console.log(result);
    //   //   routeIds.map(id => {
    //   //     let route = this.props.routes[id];
    //   //     let etas = this.props.etas;
    //   //     console.log(route);
    //   //     console.log(etas);
    //   //     this.props.createTrains(route, etas);
    //   //   });
    //   // });
    // }, 3000);

    // this.setState({
    //   seconds: 0,
    //   fetchData: false,
    //   currentSelections: [],
    //   trains: this.props.trains
    // });

    // this.mapRef.current.leafletElement.locate({
    //   watch: true,
    //   setView: true,
    //   maxZoom: 13,
    //   enableHighAccuracy: true
    // });

    // this.interval2 = setInterval(() => {
    //   let current = this.state.currentSelections;

    //   // if (current && current.length > 0) {
    //   //   current.map(ele => {
    //   //     console.log(ele);
    //   //     let route = ele.value;
    //   //     let routes = "update";
    //   //     console.log(route);
    //   //     this.props.getCurrentEtas(routes, route).then(value => {
    //   //       current.map(ele => {
    //   //         return this.props.updateTrains(
    //   //           ele.value,
    //   //           value,
    //   //           this.props.routes[ele.value].stations
    //   //         );
    //   //       });
    //   //     });
    //   //   });
    //   this.props.getCurrentEtas();

    //   // } else {
    //   //   routeIds.map(id => {
    //   //     let index = findIndex(current, function(o) {
    //   //       return o.value == id;
    //   //     });
    //   //     if (index === -1) {
    //   //       this.props.getCurrentEtas("create", id);
    //   //     }
    //   //   });
    //   //   this.props.getCurrentEtas("create");
    //   // }
    // }, 20000);

    // this.interval2 = setInterval(() => {
    //   this.props.getCurrentEtas("update");
    // }, 20000);
    // this.interval3 = setInterval(() => {
    //   if (!current || current.length === 0) {
    //     this.props.getCurrentEtas("create");
    //   }
    // }, 60000);
    // this.interval = setInterval(() => {
    //   let current = this.state.currentSelections;

    //   if (!current || current.length === 0) {
    //     this.props.getCurrentEtas("create");
    //   }
    // }, 60000);

    //   .then(response => this.setState({ stations: response.stations }));
    // this.props
    //   .fetchRouteInfo()
    //   .then(response => this.setState({ route_info: response.route_info }));
    // this.props.fetchInitialStationDataSouth();
    // this.props.fetchInitialStationDataNorth();
  }

  // componentDidMount() {
  //   // this.interval = setInterval(() => this.props.fetchSpaceStation(), 10000);
  //   // this.props.receiveWayPoints(jsonObject);
  // }

  // componentDidUpdate(prevState) {
  //   // if (this.state.etas !== this.props.etas) {
  //   //   this.setState({ etas: this.props.etas });
  //   // }

  //   if (this.state.refs !== prevState.refs && this.state.refs.length > 0) {
  //     this.animate(this.update);
  //   }
  // }

  componentWillUnmount() {
    this.stopTimer();
    clearInterval(this.interval);
  }

  tick() {
    this.timer += 1;
    // this.setState(prevState => ({
    //   seconds: prevState.seconds + 1
    // }));
  }

  handleRefs(refs) {
    this.setState(prev => {
      let currentRefs = prev.refs;

      let newRefs = [...currentRefs, refs];
      return { refs: newRefs };
    });
  }

  // renderStops() {
  //   const currentRoutes = this.state.currentSelections;
  //   const routes = this.props.routes;
  //   const allStations = this.props.allStations;

  //   const colors = currentRoutes.map(ele => {
  //     return ROUTES4[ele.value].color;
  //   });
  //   console.log(colors);

  //   const uniques = uniq(colors);
  //   console.log(uniques);

  //   const routes2 = uniques.map(ele => routes[RouteColors[ele]]);
  //   console.log(routes2);

  //   return routes2.map(route => {
  //     let hexcolor = route.hexcolor;
  //     return route.stations.map(ele2 => {
  //       console.log(ele2);
  //       let station = allStations[ele2.stationName];
  //       console.log(station);
  //       let abbr = station.abbr;
  //       return (
  //         <Station station={station} hexcolor={hexcolor} key={abbr}></Station>
  //       );
  //     });
  //   });
  // }

  shouldComponentUpdate(nextState, nextProps) {
    return (
      // !isEqual(this.props.trains, nextProps.trains) ||
      this.props.loading !== nextProps.loading
    );
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.trains !== this.state.trains) {
  //     this.setState({ trains: this.props.trains });
  //   }
  // }

  handleTimer() {
    const routes = this.props.routes;
    // this.props.getCurrentEtas().then(value => {
    //   this.setState({ etas: value });
    // });
    this.interval = setInterval(() => {
      console.count();
      //this.tick();
      {
        this.props.getCurrentEtas();
        // this.props.getCurrentEtas().then(value => {
        //   this.setState(prev => {
        //     if (prev.etas !== value) {
        //       let currentSelections = prev.currentSelections;
        //       if (currentSelections.length > 0) {
        //         currentSelections.forEach((el, i) => {
        //           setTimeout(() => {
        //             let stations = routes[currentSelections[i].value].stations;
        //             // each loop, call passed in function
        //             // delegate(array[i]);
        //             this.props.updateTrains(
        //               currentSelections[i].value,
        //               value,
        //               stations
        //             );
        //             // stagger the timeout for each loop by the index
        //           }, i * 300);
        //         });
        //       }
        //       return { etas: value, update: (prev.update += 1) };
        //     }
        //   });
        // });
      }
    }, 15000);
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.timer = 0;
  }

  // update(t) {
  //   console.log(this.state);
  //   let refs = this.state.refs;
  //   console.log(refs);
  //   refs.map(component => {
  //     const dur =
  //       component.current.time.lastUpdate + component.current.time.duration;
  //     const min = component.current.props.minutes;
  //     var MsecPerFrame = 10,
  //       MsecPerAnim = 2000;
  //     console.log(dur, min, component);
  //     if (!this.time) {
  //       this.time = t;
  //     }
  //     var progress = t - this.time;
  //     if (progress < MsecPerAnim) {
  //       requestAnimationFrame(this.Step);
  //     } else if (min !== "Leaving" && t > dur) {
  //       component.current.touched(t);
  //       this.resolve();
  //     }
  //   });

  //   this.animate(this.update);
  // }

  // animate(AnimStep) {
  //   // const rafID = new Promise(resolve => requestAnimationFrame(resolve));
  //   // const timestamp = await rafID;
  //   // console.log(timestamp);
  //   // this.update(timestamp);
  //   let o = {};

  //   return new Promise(function(resolve, reject) {
  //     // Remember some local variables
  //     o.Step = AnimStep.bind(o); // Bind "this" in o.Step() to "o"
  //     o.resolve = resolve;
  //     o.time = 0;
  //     o.id = requestAnimationFrame(o.Step);
  //   });
  // }

  handleUpdate() {
    this.handleTimer();
    setTimeout(() => {
      this.setState({ update: 1 });
    }, 400);
  }

  getMap() {
    let panes = this.mapRef.current.leafletElement.getPanes();
    console.log(panes);
    return this.mapRef;
  }

  handleSelect(value) {
    let difference = [];

    const routes = routes2;
    const etas = this.props.etas;
    const stations = stations2;

    // difference = this.state.currentSelections
    //   .slice()
    //   .filter(x => !value.includes(x)); // calculates diff
    // console.log("Removed: ", difference);

    console.log(value);

    this.setState(prev => {
      console.log(prev);
      if (!prev.currentSelections || prev.currentSelections.length === 0) {
        let num = value[0].value;
        let route = routes[num];
        let color = route.hexcolor;
        this.props.createTrains(route, etas, stations);
        return { currentSelections: value, hexcolors: [color] };

        // this.handleTimer();
        // let num = value[0].value;
        // let route = routes[num];
        // this.props.createTrains(route, etas);
        // return { currentSelections: value };
      } else if (value && value.length > prev.currentSelections.length) {
        let difference = value
          .slice()
          .filter(x => !prev.currentSelections.includes(x));
        console.log(difference);
        let num = difference[0].value;
        let color = ROUTES4[num].hexcolor;
        let newColor = [...prev.hexcolors, color];

        let route = routes[num];
        this.props.createTrains(route, etas, stations);
        return { currentSelections: value, hexcolors: newColor };
      } else if (value && value.length < prev.currentSelections.length) {
        let difference = this.state.currentSelections
          .slice()
          .filter(x => !value.includes(x));
        // let colorToRemove = console.log(difference);
        let num = difference[0].value;
        let hexcolors = prev.hexcolors;
        let colorToRemove = ROUTES4[num].hexcolor;
        let index = hexcolors.indexOf(colorToRemove);
        hexcolors.splice(index, 1);
        //  let route = routes[num];
        this.props.removeTrains(num);
        return { currentSelections: value, hexcolors };
      } else if (prev.currentSelections.length === 1 && !value) {
        let num = prev.currentSelections[0].value;
        this.props.removeTrains(num);
        {
          //this.stopTimer();
          return { currentSelections: value, seconds: 0, hexcolors: [] };
        }
      }

      console.count();
      //return { currentSelections: value };
    });

    console.log(this.state);
    // if (!this.state.currentSelections) {
    //   return this.setState({ fetchData: false });
    // }
  }

  handleZoomStart() {
    if (this.trainsRef.current) {
      this.trainsRef.current.updateZoom(true);
    }
    this.zoom = true;
  }
  handleZoomEnd(e) {
    if (this.trainsRef.current) {
      this.trainsRef.current.updateZoom(false);
    }
    this.zoom = null;
    this.setState({ zoom: e.target._zoom });
  }
  // handleChange(value) {
  //   let difference = [];

  //   const routes = this.props.routes;
  //   const etas = this.state.etas;

  //   // difference = this.state.currentSelections
  //   //   .slice()
  //   //   .filter(x => !value.includes(x)); // calculates diff
  //   // console.log("Removed: ", difference);

  //   console.log(value);

  //   this.setState(prev => {
  //     console.log(prev);
  //     if (!prev.currentSelections || prev.currentSelections.length === 0) {
  //       this.props.getCurrentEtas().then(etas2 => {
  //         let num = value[0].value;
  //         let route = routes[num];
  //         let color = route.hexcolor;
  //         console.log(color);
  //         // let newColor = prev.hexcolors.concat([color]);
  //         // console.log(newColor);
  //         this.props.createTrains(route, etas2);
  //       });
  //       this.handleTimer();
  //       let num = value[0].value;
  //       let route = routes[num];
  //       let color = route.hexcolor;
  //       return { currentSelections: value, hexcolors: [color] };

  //       // this.handleTimer();
  //       // let num = value[0].value;
  //       // let route = routes[num];
  //       // this.props.createTrains(route, etas);
  //       // return { currentSelections: value };
  //     } else if (value && value.length > prev.currentSelections.length) {
  //       let difference = value
  //         .slice()
  //         .filter(x => !prev.currentSelections.includes(x));
  //       console.log(difference);
  //       let num = difference[0].value;
  //       let color = ROUTES4[num].hexcolor;
  //       let newColor = [...prev.hexcolors, color];

  //       let route = routes[num];
  //       this.props.createTrains(route, etas);
  //       return { currentSelections: value, hexcolors: newColor };
  //     } else if (value && value.length < prev.currentSelections.length) {
  //       let difference = this.state.currentSelections
  //         .slice()
  //         .filter(x => !value.includes(x));
  //       // let colorToRemove = console.log(difference);
  //       let num = difference[0].value;
  //       let hexcolors = prev.hexcolors;
  //       let colorToRemove = ROUTES4[num].hexcolor;
  //       let index = hexcolors.indexOf(colorToRemove);
  //       hexcolors.splice(index, 1);
  //       //  let route = routes[num];
  //       this.props.removeTrains(num);
  //       return { currentSelections: value, hexcolors };
  //     } else if (prev.currentSelections.length === 1 && !value) {
  //       let num = prev.currentSelections[0].value;
  //       this.props.removeTrains(num);
  //       {
  //         this.stopTimer();
  //         return { currentSelections: value, seconds: 0, hexcolors: [] };
  //       }
  //     }

  //     console.count();
  //     //return { currentSelections: value };
  //   });

  //   console.log(this.state);
  //   // if (!this.state.currentSelections) {
  //   //   return this.setState({ fetchData: false });
  //   // }
  // }

  // customFilter() {
  //   createFilter({ ignoreAccents: false });
  // }

  // checkState() {
  //   this.setInterval(() => {
  //   this.state.routes.map(route => (
  //       if (route.selected === true) {

  //       }
  //     ))
  //   }, 500);
  // }
  // shouldComponentUpdate(nextState) {
  //   if (this.state.currentSelections && nextState.currentSelections) {
  //     return (
  //       nextState.currentSelections.length ===
  //       this.state.currentSelections.length
  //     );
  //   }
  // }

  render() {
    const allRoutes = routes;
    const customFilter = createFilter({ ignoreAccents: false });

    const currentSelections = this.state.currentSelections;
    // const options = this.props.allRoutes.map(ele => ele.title);

    const position = [37.844443, -122.252341];
    const { loading } = this.props;
    //let trains;

    // if (this.props.trains) {
    //   trains = this.props.trains;
    // }

    const trains = this.props.trains || [];
    const routes = routes2;
    const hexcolors = this.state.hexcolors || [];
    const uniques = uniq(hexcolors);
    const update = String(this.state.update);
    const bounds = this.bounds;
    console.log(bounds);

    // console.log(jsonObject);

    console.log(this.state);
    console.log(trains);
    console.log(uniques, hexcolors);
    console.log(this.zoom);
    // console.count();
    // console.log(this.props.routes);

    // console.log(allStations);
    // console.log(this.state);

    // const waypoints = jsonObject;

    // console.log(waypoints);

    // console.log(this.props);
    // const customMarker = L.icon({ iconUrl: require('../../assets/images/iss.png')})
    // if (!loading) {
    //   return (
    //     <MoonLoader
    //       css={override}
    //       sizeUnit={"px"}
    //       size={150}
    //       color={"#123abc"}
    //       loading={this.state.loading}
    //     />
    //   );
    // } else
    {
      //this.mapRef.current.leafletElement.setMaxBounds
      return (
        <div id="all">
          {/* <div className="react-select__menu">
            <WindowedSelect
              options={options}
              isMulti
              values={this.state.currentSelections}
              styles={{ marginBottom: "200px" }}
              placeholder={"hello"}
              handleDropdown={this.handleDropdown}
              className="basic-multi-select"
              classNamePrefix="select"
              filterOption={customFilter}
              onChange={this.handleChange.bind(this)}
            /> */}
          <SelectorContainer
            handleSelect={this.handleSelect}
            values={this.state.currentSelections}
            customFilter={this.customFilter}
            options={options}
          ></SelectorContainer>
          {/* <div className="test">
            <DropdownMultiple
              titleHelper="Routes"
              title="Select routes"
              list={this.state.routes}
              toggleItem={this.toggleSelected}
              onClick={e => this.handleChange}
              // toggleItem={this.handleChange}
            />
          </div> */}

          <Map
            //watch={true}
            //enableHighAccuracy={true}
            center={position}
            // wheelDebounceTime={10}
            // animate={true}
            zoom={this.state.zoom}
            closePopupOnClick={false}
            onzoomstart={this.handleZoomStart.bind(this)}
            onzoomend={this.handleZoomEnd.bind(this)}
            markerZoomAnimation={false}
            //maxZoom={13}
            minZoom={11}
            //maxBounds={bounds}

            preferCanvas={true}
            ref={this.mapRef}
          >
            {currentSelections && trains.length > 0 ? (
              <React.Fragment>
                <React.Fragment>
                  <RouteStations
                    currentRoutes={currentSelections}
                    routes={routes}
                  />
                  <Polylines
                    currentRoutes={currentSelections}
                    routes={routes}
                    waypoints={allWayPoints}
                  />
                  <Trains
                    trains={trains}
                    update={update}
                    ref={this.trainsRef}
                    removeTrain={this.props.removeTrain}
                    getMap={this.getMap.bind(this)}
                    routes={routes}
                    //zoom={this.zoom}
                  />
                </React.Fragment>
                {/* {trains.map((train, idx) => {
                    console.log(train);
                    let minutes = train.minutes;
                    let color = train.color;
                    let id = train.id;
                    let stations = routes[Number(train.route)].stations;

                    return (
                      <NewMarker
                        //   markers={slice}
                        // seconds={this.props.seconds}
                        color={train.hexcolor}
                        station={train.stationName}
                        minutes={minutes}
                        id={id}
                        // waypoints={train.waypoints}
                        // stationSlice={train.stationSlice}
                        //   ratio={train.ratio}
                        key={id}
                        routeStations={stations}
                        index={train.stationIdx}
                        routeNumber={train.route}
                        train={train}
                        //  interval={train.interval}
                        // initialCoordinates={train.initialCoordinates}
                        // initialPosition={train.initialPosition}
                        // ref={this.ref}
                        //references={this.references}
                        //getOrCreateRef={this.getOrCreateRef}
                        // initialSlice={train.initialSlice}
                        // removeTrain={this.props.removeTrain}
                        //lastLocation={this.state[id]}
                        //handleChange={this.handleChange}
                        // lastLocation={lastLocation}
                        // nextStationId={nextStationId}
                      ></NewMarker>
                    );
                  })} */}
              </React.Fragment>
            ) : null}
            {/* {currentSelections ? (
              <div>
                {this.renderStops()}
                {this.drawPolyline()}
              </div>
            ) : null} */}
            <TileLayer url="https://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}" />
            />
          </Map>
        </div>
      );
    }
  }
}

export default MainPage;
