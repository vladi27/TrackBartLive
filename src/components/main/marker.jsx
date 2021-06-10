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
  useImperativeHandle,
} from "react";
import L from "leaflet";
import * as util from "leaflet-geometryutil";
import { useDispatch, useSelector } from "react-redux";
import { selectTrain, deselectTrain } from "../../actions/station_actions";
import { Marker, Polyline, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import chroma from "chroma-js";

const OPTIONS = { units: "kilometers" };

const NewMarker = React.forwardRef((props, ref) => {
  const markerRef = React.useRef();
  const popupRef = React.useRef();
  const minutesRef = React.useRef(null);
  const [selected, setSelected] = useState(false);
  const initialState = [];
  const renderRef = React.useRef();
  const currrentSliceRef = React.useRef();
  const startTime = React.useRef(null);

  const animated = React.useRef(null);

  const [mapRef, setMapRef] = useState(null);
  const mapRef2 = React.useRef(null);
  const polyLineRef = React.useRef();
  const currentTime = React.useRef();
  const stationRef = React.useRef(null);
  const colorRef = React.useRef(props.color);
  const intervalRef = React.useRef(null);

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
    color,
  } = props;

  let inits = { lat: 0, lng: 0 };
  const dispatch = useDispatch();
  const initRef = React.useRef(inits);

  useLayoutEffect(() => {
    if (renderRef.current !== 1) {
      renderRef.current = 1;
      let mref = props.getMap();
      mapRef2.current = mref;
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
        const station = routeStations[props.stationIndex - 1];
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
        startTime.current = 0;
        currentTime.current = totalTime * 60 * 1000;
        animated.current = true;
      }
    }
  }, [props.id]);

  useLayoutEffect(() => {
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
      polyline2.setLatLngs(newPolyline3);

      startTime.current = 0;
      minutesRef.current = minutes;
      currentTime.current = 10000;
      stationRef.current = props.station;
      polyLineRef.current = polyline2;
    } else {
      const station = routeStations[props.stationIndex - 1];
      const waypoints = props.routeStations[props.stationIndex - 1].slice;
      const polyline = L.polyline(waypoints);
      const dest = routeStations[stationIndex].location;
      var lat = parseFloat(dest[0]),
        lng = parseFloat(dest[1]),
        point = { lat: lat, lng: lng };
      polyline.addLatLng(point);

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
    }
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

      animated.current = null;
      minutesRef.current = minutes;
      const currentPoly = polyLineRef.current;

      let interval = props.interval * props.index + 2000;
      if (interval < 3000) {
        interval = 3000;
      }
      const pos = waypoints2[waypoints2.length - 1];
      const pos2 = [parseFloat(pos[0]), parseFloat(pos[1])];
      const pos3 = L.latLng(pos2[0], pos2[1]);

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

  const iconTrain = useMemo(() => {
    const color2 = colorRef.current;
    const styles = `background-color: ${color2}`;
    return divIcon({
      className: `custom-div-icon${color2.slice(1)}`,
      html: `<div style="${styles}"></div><i class="fas fa-subway"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -30],
    });
  }, [colorRef.current]);

  useImperativeHandle(ref, () => ({
    update(t, zoom) {
      if (props.zoom || polyLineRef.current == null) {
        return;
      }

      if (startTime.current === 0) {
        startTime.current = t;
      }
      const start = startTime.current;
      const totalTime = currentTime.current;
      let runtime = t - start;

      const ratio = runtime / totalTime;
      const currentPoly = polyLineRef.current.getLatLngs();

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

        if (pos) {
          const { latLng } = pos;
          initRef.current = latLng;
          markerRef.current.leafletElement.setLatLng(latLng);
        }
      }
    },
  }));

  const handleTrainUpdate = () => {
    if (!selected) {
      let newCol = chroma(color);
      let newColor2 = newCol.darken(2).hex();
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
