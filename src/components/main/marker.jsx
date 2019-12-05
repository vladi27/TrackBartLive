import React, {
  Component,
  PureComponent,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useMemo,
  useReducer,
  useCallback,
  useImperativeHandle
} from "react";
import L from "leaflet";
import * as util from "leaflet-geometryutil";
import { useDispatch, useSelector } from "react-redux";
import { selectTrain, deselectTrain } from "../../actions/station_actions";

import { Marker, Polyline, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import chroma from "chroma-js";
//import { useWorker } from "react-hooks-worker";

//const Worker = require("worker_threads");
const OPTIONS = { units: "kilometers" };

// const createWorker = () =>
//   new Worker("../../webworkers/slice.js", { preserveTypeModule: true });
// console.log(createWorker);
// 30.1 seconds, the .1 is to allow a buffer for the next set of cords to load
// I know it's not exact, but it's close :)
//const STEPS = 120001;

const NewMarker = React.forwardRef((props, ref) => {
  // stationSlic {
  const markerRef = React.useRef();
  const popupRef = React.useRef();
  const minutesRef = React.useRef(null);
  const [selected, setSelected] = useState(false);
  const initialState = [];
  const renderRef = React.useRef();
  const currrentSliceRef = React.useRef();
  const startTime = React.useRef(null);
  //const animated = React.useRef(false);
  const animated = React.useRef(null);
  //const [animated, setAnimated] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const mapRef2 = React.useRef(null);
  const polyLineRef = React.useRef();
  const currentTime = React.useRef();
  const stationRef = React.useRef(null);
  const colorRef = React.useRef(props.color);
  const intervalRef = React.useRef(null);
  // const minutes = props.minutes;
  // const lastTrain = props.lastTrain;
  // const id = props.id;
  const {
    minutes,
    station,
    lastTrain,
    id,
    totalTime,
    destination,
    stationIndex,
    routeStations,
    zoom,
    color
  } = props;
  //const mapRef = props.getMap();
  console.log(mapRef);
  console.log(props);

  let inits = { lat: 0, lng: 0 };
  const dispatch = useDispatch();
  const initRef = React.useRef(inits);

  //const markerRef = React.useRef(inits);

  useLayoutEffect(() => {
    // if (renderRef.current === 1) {
    //   return;
    // }
    if (renderRef.current !== 1) {
      renderRef.current = 1;
      let mref = props.getMap();
      mapRef2.current = mref;
      console.log(mref);
      stationRef.current = station;
      minutesRef.current = props.minutes;
      if (props.minutes === "Leaving") {
        const dest = routeStations[props.stationIndex].location;

        var lat = parseFloat(dest[0]),
          lng = parseFloat(dest[1]),
          point = { lat: lat, lng: lng };
        initRef.current = point;
        markerRef.current.leafletElement.setLatLng(point);
      } else {
        const waypoints = routeStations[props.stationIndex - 1].slice;
        // const dest2 = routeStations[props.stationIndex - 1].location;
        // waypoints.unshift(dest2);
        const polyline = L.polyline(waypoints);
        const dest2 = routeStations[props.stationIndex].location;
        var lat = parseFloat(dest2[0]),
          lng = parseFloat(dest2[1]),
          point = { lat: lat, lng: lng };
        polyline.addLatLng(point);

        const newPolyline = util.extract(
          mref.current.leafletElement,
          polyline,
          0.5,
          1
        );
        polyline.setLatLngs(newPolyline);
        polyLineRef.current = polyline;
        console.log(polyline);
        startTime.current = 0;
        currentTime.current = totalTime * 60 * 1000;
        animated.current = true;
      }
      //markerRef.current.leafletElement.openPopup();

      //setMapRef(mref);
    }
  }, [props.id]);

  // const routeStations = props.routeStations;
  // const waypoints = routeStations[props.stationIndex - 1].slice;

  useLayoutEffect(() => {
    // if (!props.initialPos) {
    //   animated.current = null;
    // }
    if (
      stationRef.current == null ||
      stationRef.current === props.station ||
      minutesRef.current === null
    ) {
      return;
    }
    if (props.minutes === "Leaving") {
      const waypoints4 = props.routeStations[props.stationIndex - 1].slice;
      // const dest2 = routeStations[props.stationIndex - 1].location;
      // waypoints.unshift(dest2);
      const polyline2 = L.polyline(waypoints4);
      const dest2 = routeStations[stationIndex].location;
      var lat = parseFloat(dest2[0]),
        lng = parseFloat(dest2[1]),
        point = { lat: lat, lng: lng };
      polyline2.addLatLng(point);
      const currentPosition3 = markerRef.current.leafletElement.getLatLng();
      const latlngs2 = polyline2.getLatLngs();
      const currentPosition4 = util.closest(
        mapRef2.current.current.leafletElement,
        latlngs2,
        currentPosition3
      );
      const ratio2 = util.locateOnLine(
        mapRef2.current.current.leafletElement,
        polyline2,
        currentPosition4
      );
      const newPolyline3 = util.extract(
        mapRef2.current.current.leafletElement,
        polyline2,
        ratio2,
        1
      );
      console.log(newPolyline3);
      // const han = newPolyline.getLatLngs();
      polyline2.setLatLngs(newPolyline3);

      startTime.current = 0;
      minutesRef.current = minutes;
      currentTime.current = 10000;
      stationRef.current = props.station;
      polyLineRef.current = polyline2;
    } else {
      console.log(props);
      const waypoints = props.routeStations[props.stationIndex - 1].slice;
      // const dest2 = routeStations[props.stationIndex - 1].location;
      // waypoints.unshift(dest2);
      const polyline = L.polyline(waypoints);
      const dest = routeStations[stationIndex].location;
      var lat = parseFloat(dest[0]),
        lng = parseFloat(dest[1]),
        point = { lat: lat, lng: lng };
      polyline.addLatLng(point);

      console.log(polyline);
      let interval = props.interval * props.index;

      if (interval < 3000) {
        interval = 3000;
      }

      const currentPosition2 = markerRef.current.leafletElement.getLatLng();
      const latlngs = polyline.getLatLngs();
      const currentPosition = util.closest(
        mapRef2.current.current.leafletElement,
        latlngs,
        currentPosition2
      );
      // const first = latlngs[0];
      // const last = latlngs[latlngs.length - 1];
      // const bool = util.belongsSegment(first, last);
      const ratio = util.locateOnLine(
        mapRef2.current.current.leafletElement,
        polyline,
        currentPosition
      );
      const newPolyline2 = util.extract(
        mapRef2.current.current.leafletElement,
        polyline,
        ratio,
        1
      );
      polyline.setLatLngs(newPolyline2);
      polyLineRef.current = polyline;
      startTime.current = 0;
      stationRef.current = props.station;
      minutesRef.current = minutes;
      currentTime.current = totalTime * 60 * 1000;
      //mapRef2.current.current.leafletElement.flyTo(currentPosition);
      animated.current = true;
      //return minutes;

      if (mapRef2.current && !props.zoom && selected) {
        console.log(mapRef2);
        if (intervalRef.current !== null) {
          clearTimeout(intervalRef.current);
          intervalRef.current = null;
        }

        intervalRef.current = setTimeout(() => {
          mapRef2.current.current.leafletElement.fitBounds(
            polyline.getBounds()
          );
        }, interval);
      }

      console.log(currentTime);
    }

    // if (
    //   (props.initialPos && props.minutes !== "Leaving") ||
    //   !props.initialPos
    // ) {
    //   currentTime.current = props.totalTime * 60 * 1000;
    //   animated.current = true;
    // }

    //return props.totalTime * 60 * 1000;
  }, [props.station]);

  useLayoutEffect(() => {
    if (props.minutes === minutesRef.current || minutesRef.current == null) {
      return;
    }
    // if (animated.current)

    {
      const routeStations2 = props.routeStations;
      const waypoints2 = routeStations2[props.stationIndex - 1].slice;
      const dest2 = routeStations2[props.stationIndex].location;
      console.log(props.minutes);
      animated.current = null;
      minutesRef.current = minutes;
      const currentPoly = polyLineRef.current;
      console.log(currentPoly);
      //const currentPosition = markerRef.current.leafletElement.getLatLng();

      console.log(
        // currentPosition,
        currentPoly,
        props.station,
        props.minutes,
        waypoints2[0][waypoints2.length - 1]
      );
      let interval = props.interval * props.index + 2000;
      if (interval < 3000) {
        interval = 3000;
      }
      const pos = waypoints2[waypoints2.length - 1];
      const pos2 = [parseFloat(pos[0]), parseFloat(pos[1])];
      const pos3 = L.latLng(pos2[0], pos2[1]);
      // const test = polyLineRef.current.getLatLngs();
      console.log(props.station, props.minutes, currentPoly);
      const currentPosition2 = markerRef.current.leafletElement.getLatLng();
      const latlngs = currentPoly.getLatLngs();
      if (latlngs && latlngs.length > 1) {
        const currentPosition = util.closest(
          mapRef2.current.current.leafletElement,
          latlngs,
          currentPosition2
        );
        const ratio = util.locateOnLine(
          mapRef2.current.current.leafletElement,
          currentPoly,
          currentPosition
        );
        const newPolyline = util.extract(
          mapRef2.current.current.leafletElement,
          currentPoly,
          ratio,
          1
        );
        console.log(newPolyline);
        // const han = newPolyline.getLatLngs();
        currentPoly.setLatLngs(newPolyline);
        startTime.current = 0;
      }
      if (minutes === "Leaving") {
        currentTime.current = 14000;
        if (!props.zoom && selected) {
          if (intervalRef.current !== null) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
          }
          intervalRef.current = setTimeout(() => {
            const poly2 = polyLineRef.current;
            const latlng = poly2.getLatLngs();
            console.log(latlng, "hello");

            if (latlng && latlng.length && latlng.length > 3) {
              return mapRef2.current.current.leafletElement.fitBounds(
                polyLineRef.current.getBounds()
              );
            } else {
              const waypoints3 = routeStations2[props.stationIndex].slice;
              const poly3 = L.polyline(waypoints3);

              return mapRef2.current.current.leafletElement.fitBounds(
                poly3.getBounds()
              );
            }
          }, interval);
        }
      } else if (minutes !== "Leaving") {
        currentTime.current = minutes * 60 * 1000;
      }
      animated.current = true;
    }
  }, [props.minutes]);

  // useLayoutEffect(() => {
  //   const dest = routeStations[stationIndex].location;
  //   var lat = parseFloat(dest[0]),
  //     lng = parseFloat(dest[1]),
  //     point = { lat: lat, lng: lng };
  //   console.log(props.minutes, props.totalTime);
  //   if (
  //     minutesRef.current == null ||
  //     animated.current ||
  //     minutes !== minutesRef.current ||
  //     point === initRef.current ||
  //     polyLineRef.current == null
  //   ) {
  //     return;
  //   }

  //   const routeStations2 = props.routeStations;
  //   const waypoints2 = routeStations2[props.stationIndex - 1].slice;

  //   // if (
  //   //   props.totalTime &&
  //   //   Number(props.minutes) !== props.totalTime &&
  //   //   props.minutes === "Leaving" &&
  //   //   animated
  //   // ) {
  //   // }

  //   // if (
  //   //   totalTime !== props.minutes && animated.current
  //   //   animated.current == null
  //   // ) {
  //   // setAnimated(null);

  //   {
  //     const currentPoly = polyLineRef.current;
  //     console.log(currentPoly);
  //     const currentPosition = markerRef.current.leafletElement.getLatLng();

  //     console.log(
  //       currentPosition,
  //       currentPoly,
  //       props.station,
  //       props.minutes,
  //       waypoints2[0][waypoints2.length - 1]
  //     );
  //     const pos = waypoints2[waypoints2.length - 1];
  //     const pos2 = [parseFloat(pos[0]), parseFloat(pos[1])];
  //     const pos3 = L.latLng(pos2[0], pos2[1]);
  //     // const test = polyLineRef.current.getLatLngs();
  //     console.log(props.station, props.minutes, currentPosition, currentPoly);
  //     const ratio = util.locateOnLine(
  //       mapRef2.current.current.leafletElement,
  //       currentPoly,
  //       currentPosition
  //     );
  //     const newPolyline = util.extract(
  //       mapRef2.current.current.leafletElement,
  //       currentPoly,
  //       ratio,
  //       1
  //     );
  //     console.log(newPolyline);
  //     // const han = newPolyline.getLatLngs();
  //     currentPoly.setLatLngs(newPolyline);
  //     startTime.current = 0;
  //     if (minutes === "Leaving") {
  //       currentTime.current = 20000;
  //     } else if (minutes !== "Leaving") {
  //       currentTime.current = minutes * 60 * 1000;
  //     }
  //     animated.current = true;
  //   }
  // }, [minutes]);

  // const [currentLocation, setCurrentLocation] = useState(null);
  // markerRef.current.leafletElement.setLatLng(locations[0]);
  //const clone = React.useRef(null);
  // clone.current = markerRef.current.leafletElement.options.position;
  let current;
  //let frameId = null;

  const iconTrain = useMemo(() => {
    const color2 = colorRef.current;
    console.log(color2);
    const styles = `background-color: ${color2}`;
    return divIcon({
      className: `custom-div-icon${color2.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -30]
    });
  }, [colorRef.current]);
  //const stationSlice = routeStations[index - 1].slice;
  //const leavingPos = stationSlice[stationSlice.length - 1];
  const STEPS = 60 * 1000;
  // const mapRef = props.getMap();
  // const locations = routeStations[index - 1].geoSlice;
  // const line = lineString(locations); // our array of lat/lngs
  // const distance = lineDistance(line, OPTIONS);
  const initialPos = { lat: 0, lng: 0 };
  // const speed = useMemo(() => {
  //   if (minutes === "Leaving") {
  //     // exit if no cords in array
  //     return;
  //   }
  //   return distance / (Number(minutes) * 60 * 1000);
  // }, [station]);
  //const sub = distance / stationSlice.length;

  // useEffect(() => {
  //   currrentSliceRef.current = props.currentSlice; // Write it to the ref
  // }, [props.currentSlice]);
  let slice = props.currentSlice;

  //const { result } = useWorker(createWorker, slice);
  //console.log(result);
  // const arc = useMemo(() => {
  //   // let startTime = 0;
  //   if (props.minutes === "Leaving") {
  //     // exit if no cords in array
  //     return;
  //   }
  //   let results = [];
  //   //const result = useWorker(createWorker, props.currentSlice);

  //   //let index = props.totalMinutes - Number(minutes);
  //   let distance = lineDistance(props.currentSlice, OPTIONS);

  //   for (let i = 0; i < distance; i += distance / STEPS) {
  //     let segment = along(props.currentSlice, i, OPTIONS);
  //     results.push(segment.geometry.coordinates);
  //   }
  //   let now = performance.now();
  //   startTime.current = now;
  //   //startTime.current = 0;
  //   setAnimated(true);
  //   return results;
  // }, [props.minutes]);
  // console.log(arc, props.minutes, props.station);

  useImperativeHandle(
    ref,
    () => ({
      update(t, zoom) {
        console.log(props.zoom);
        if (props.zoom || polyLineRef.current == null) {
          return;
        }

        // if (animated)
        console.log(props.station, minutes);

        if (startTime.current === 0) {
          startTime.current = t;
        }
        const start = startTime.current;
        const totalTime = currentTime.current;
        //console.log(ref, timeStep, arc, markerRef.current.leafletElement);
        let runtime = t - start;

        const ratio = runtime / totalTime;
        const currentPoly = polyLineRef.current.getLatLngs();
        console.log(currentPoly, ratio, mapRef2.current);

        if (ratio >= 0.97 && lastTrain) {
          props.removeTrain(id);
          animated.current = null;
          return;
        }

        if (
          ratio >= 1 &&
          minutesRef.current === "Leaving" &&
          currentTime.current === 20000
        ) {
          const pos = util.interpolateOnLine(
            mapRef2.current.current.leafletElement,
            currentPoly,
            ratio
          );
          if (pos) {
            const { latLng } = pos;
            console.log(latLng, props.stataton, props.minutes);
            initRef.current = latLng;
            markerRef.current.leafletElement.setLatLng(latLng);

            animated.current = null;
          }

          //setAnimated(null);
        } else if (ratio < 1) {
          const pos = util.interpolateOnLine(
            mapRef2.current.current.leafletElement,
            currentPoly,
            ratio
          );
          console.log(pos, props.station, props.minutes);

          if (pos) {
            const { latLng } = pos;
            console.log(latLng, props.stataton, props.minutes);
            initRef.current = latLng;
            markerRef.current.leafletElement.setLatLng(latLng);
          }
        }

        // let timeStep = Math.round(runtime);
        // if (timeStep < 0) {
        //   timeStep = 0;
        // }
        // console.log(timeStep);

        // if (timeStep < STEPS) {
        //   const newPosition = arc[timeStep];
        //   console.log(newPosition, props.station, timeStep);
        //   const [lon, lag] = newPosition;
        //   //console.log(newPosition, startTime, arc, lon, lag, station);
        //   return markerRef.current.leafletElement.setLatLng([lag, lon]);
        // } else if (timeStep >= STEPS) {
        //   setAnimated(null);
        //   const newPosition2 = arc[arc.length - 1];
        //   const [lon2, lag2] = newPosition2;
        //   markerRef.current.leafletElement.setLatLng([lag2, lon2]);
        // }

        //   cons
        //   const newPosition = arc[timeStep] || arc[arc.length - 1];
        //   console.log(newPosition, props.station, timeStep);
        //   const [lon, lag] = newPosition;
        //   //console.log(newPosition, startTime, arc, lon, lag, station);
        //   markerRef.current.leafletElement.setLatLng([lag, lon]);
        // }
      }
    })
    //[animated.current]
  );

  const handleTrainUpdate = () => {
    if (!selected) {
      let newCol = chroma(color);
      console.log(newCol);
      let newColor2 = newCol.darken(2).hex();
      console.log(newColor2);
      colorRef.current = newColor2;
      dispatch(selectTrain(props.id));
    } else {
      colorRef.current = color;
      dispatch(deselectTrain(props.id));
    }
    setSelected(!selected);
    markerRef.current.leafletElement.openPopup();
  };

  const stopTracking = useMemo(() => {
    if (props.tracking) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
      if (markerRef.current && markerRef.current.leafletElement) {
        markerRef.current.leafletElement.closePopup();
      }
      colorRef.current = color;
      setSelected(false);
    }
  }, [props.tracking]);

  return (
    // <Polyline positions={waypoints} ref={polyLineRef}>
    <Marker
      icon={iconTrain}
      // autoPan={false}
      position={initRef.current}
      key={id}
      onClick={handleTrainUpdate}
      ref={markerRef}
    >
      <Popup
        autoClose={false}
        closeOnClick={false}
        autoPan={false}
        ref={popupRef}
      >
        <span>
          {" "}
          Station: <strong>{props.station}</strong> <br />
          Minutes: <strong>{props.minutes}</strong> <br />
          Destination: <strong>{destination}</strong>
          <br />
          Cars: <strong>{props.cars}</strong>
        </span>
      </Popup>
    </Marker>
    // </Polyline>
  );
});

export default NewMarker;

// position = {
//         !markerRef.current
//   ? leavingPos
//   : markerRef.current.leafletElement._latlng
//       }
