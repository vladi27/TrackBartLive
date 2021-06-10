import React, { Component, PureComponent } from "react";
import { Map, TileLayer, CircleMarker, Polyline } from "react-leaflet";
import routes2 from "../../waypoints/new_routes.json";
import oldRoutes from "../../waypoints/routes.json";
import stations2 from "../../waypoints/new_stations.json";
import allWayPoints from "../../waypoints/new_all_waypoints.json";
import find from "lodash/find";
import uniq from "lodash/uniq";
import { createFilter } from "react-windowed-select";
import Control from "react-leaflet-control";
import { css } from "@emotion/core";
import { MoonLoader } from "react-spinners";
import Polylines from "./Polylines";
import WelcomeModal from "./modal";
import SelectorContainer from "./selector_container";
import RouteStations from "./route_stations";
import Trains from "./trains";
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
    destination: ["Warm Springs"],
    abbreviation: ["WARM"],
    direction: "South",
    color: "Orange",
  },

  5: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Daly City",
    direction: "North",
    abbreviation: ["DALY"],
  },

  6: {
    color: "Green",
    hexcolor: "#339933",
    destination: "Warm Springs",
    abbreviation: ["WARM"],

    direction: "South",
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

const RouteColors = {
  Yellow: 1,
  Orange: 3,
  Green: 5,
  Red: 7,
};
const RouteColors2 = {
  "#ffff33": 1,
  "#ff9933": 3,
  "#339933": 5,
  "#ff0000": 7,
};

const options = [
  {
    value: "8",
    label: "Millbrae/Daly City - Richmond",
  },
  {
    value: "7",
    label: "Richmond - Daly City/Millbrae",
  },
  {
    value: "6",
    label: "Daly City - Berryessa/North San Jose",
  },
  {
    value: "5",
    label: "Berryessa/North San Jose - Daly City",
  },
  {
    value: "4",
    label: "Richmond - Berryessa/North San Jose",
  },
  {
    value: "3",
    label: "Berryessa/North San Jose - Richmond",
  },
  {
    value: "2",
    label: "Millbrae/SFIA - Antioch",
  },
  {
    value: "1",
    label: "Antioch - SFIA/Millbrae",
  },
];

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSelections: [],
      etas: {},
      trains: {},
      refs: [],
      hexcolors: [],
      update: 0,
      trains: [],
      zoom: 11,
      stopTracking: false,
      height: 0,
    };
    this.timer = 0;
    this.interval = null;
    this.handleRefs = this.handleRefs.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.mapRef = React.createRef();
    this.bounds = null;
    this.zoom = null;
    this.trainsRef = React.createRef();
  }

  componentDidMount() {
    this.props.getCurrentEtas();

    setTimeout(() => {
      this.handleTimer();
    }, 15000);
  }

  componentWillUnmount() {
    this.stopTimer();
    clearInterval(this.interval);
  }

  tick() {
    this.timer += 1;
  }

  handleRefs(refs) {
    this.setState((prev) => {
      let currentRefs = prev.refs;

      let newRefs = [...currentRefs, refs];
      return { refs: newRefs };
    });
  }

  shouldComponentUpdate(nextState, nextProps) {
    const current = this.props.trains;
    const next = nextProps.trains;
    return (
      !isEqual(current, next) ||
      this.state.currentSelections !== nextState.currentSelections ||
      this.state.stopTracking !== nextState.stopTracking
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stopTracking) {
      setTimeout(() => {
        this.setState({ stopTracking: false });
      }, 100);
    }
  }

  handleTimer() {
    const routes = this.props.routes;

    this.interval = setInterval(() => {
      {
        this.props.getCurrentEtas();
      }
    }, 15000);
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.timer = 0;
  }

  handleUpdate() {
    this.handleTimer();
    setTimeout(() => {
      this.setState({ update: 1 });
    }, 400);
  }

  getMap() {
    let panes = this.mapRef.current.leafletElement.getPanes();
    return this.mapRef;
  }

  handleSelect(value) {
    const routes = routes2;
    const etas = this.props.etas;
    const stations = stations2;

    this.setState((prev) => {
      if (!prev.currentSelections || prev.currentSelections.length === 0) {
        let num = value[0].value;
        let route = routes[num];
        let color = route.hexcolor;
        this.props.createTrains(route, etas, stations);
        return { currentSelections: value, hexcolors: [color] };
      } else if (value && value.length > prev.currentSelections.length) {
        let difference = value
          .slice()
          .filter((x) => !prev.currentSelections.includes(x));
        let num = difference[0].value;
        let color = ROUTES4[num].hexcolor;
        let newColor = [...prev.hexcolors, color];
        let route = routes[num];
        this.props.createTrains(route, etas, stations);
        return { currentSelections: value, hexcolors: newColor };
      } else if (
        value &&
        value.length < prev.currentSelections.length &&
        value.length >= 1
      ) {
        let difference = this.state.currentSelections
          .slice()
          .filter((x) => !value.includes(x));
        let num = difference[0].value;
        let hexcolors = prev.hexcolors;
        let colorToRemove = ROUTES4[num].hexcolor;
        let index = hexcolors.indexOf(colorToRemove);
        hexcolors.splice(index, 1);
        this.props.removeTrains(num);
        return { currentSelections: value, hexcolors };
      } else if (
        (prev.currentSelections.length > 0 && !value) ||
        (prev.currentSelections.length > 0 && value.length === 0)
      ) {
        this.props.removeAllTrains();
        {
          return { currentSelections: value, seconds: 0, hexcolors: [] };
        }
      }
    });
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
  handleTracking() {
    this.props.removeTracking();

    this.setState({ zoom: 11, stopTracking: true });
  }

  render() {
    const currentSelections = this.state.currentSelections;
    const position = [37.844443, -122.252341];
    const trains = this.props.trains;
    const etas = this.props.etas;
    const selected = find(trains, ["selected", true]);
    const routes = routes2;
    const hexcolors = this.state.hexcolors || [];
    const update = String(this.state.update);
    let topMargin = "60px";

    if (currentSelections && currentSelections.length >= 6) {
      topMargin = "90px";
    }

    if (Object.values(etas).length === 0) {
      return (
        <div>
          <WelcomeModal></WelcomeModal>
          <MoonLoader
            css={override}
            sizeUnit={"px"}
            size={150}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </div>
      );
    } else {
      return (
        <div id="all">
          <WelcomeModal></WelcomeModal>

          <SelectorContainer
            handleSelect={this.handleSelect}
            values={this.state.currentSelections}
            customFilter={this.customFilter}
            options={options}
          ></SelectorContainer>

          <Map
            //watch={true}
            //enableHighAccuracy={true}
            center={position}
            // wheelDebounceTime={10}
            //zoomAnimationThreshold={1}
            zoom={this.state.zoom}
            closePopupOnClick={false}
            onzoomstart={this.handleZoomStart.bind(this)}
            onzoomend={this.handleZoomEnd.bind(this)}
            markerZoomAnimation={true}
            maxZoom={16}
            //minZoom={11}
            style={{ width: "100%", height: "100%", marginTop: topMargin }}
            //maxBounds={bounds}

            preferCanvas={true}
            ref={this.mapRef}
          >
            {currentSelections && currentSelections.length ? (
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
                    tracking={this.state.stopTracking}
                    removeTrain={this.props.removeTrain}
                    getMap={this.getMap.bind(this)}
                    routes={routes}
                    //zoom={this.state.zoom}
                    //zoom={this.zoom}
                  />
                </React.Fragment>
                {selected ? (
                  <Control position="topright">
                    <button
                      className="button2"
                      onClick={this.handleTracking.bind(this)}
                    >
                      Stop Train Tracking
                    </button>
                  </Control>
                ) : null}
              </React.Fragment>
            ) : null}

            <TileLayer url="https://mt1.google.com/vt/lyrs=m@121,transit|vm:1&hl=en&opts=r&x={x}&y={y}&z={z}" />
          </Map>
        </div>
      );
    }
  }
}

export default MainPage;
