import React, {
  Component,
  PureComponent,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  useImperativeHandle,
} from "react";
import NewMarker from "./marker";

const Trains = React.forwardRef(function Trains(props, ref) {
  const STEPS = 60 * 1000;
  const refs = useRef([]);
  const zoomRef = useRef(false);

  const [zoom, setZoom] = useState(null);
  const [trains2, setTrains2] = useState([]);
  const trainRef = useRef([]);
  const trains = props.trains;

  const str = JSON.stringify(props.trains);

  useLayoutEffect(() => {
    let frameId = null;
    const animate = (timestamp) => {
      refs.current.map((child) => {
        if (child && !zoomRef.current) {
          child.update(timestamp);
        }
      });

      setTimeout(() => {
        window.requestAnimationFrame(animate);
      }, 1000 / 10);
    };

    frameId = window.requestAnimationFrame((t) => {
      animate(t);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    updateZoom(arg) {
      const bool = zoomRef.current;
      zoomRef.current = arg;
    },
  }));

  return (
    <>
      {props.trains.map((train, index) => {
        let num = train.route;
        let routeStations = props.routes[num].stations;
        return (
          <NewMarker
            key={train.id}
            color={train.hexcolor}
            routeStations={routeStations}
            stationIndex={train.stationIdx}
            station={train.stationName}
            zoom2={props.zoom}
            tracking={props.tracking}
            minutes={train.minutes}
            lastTrain={train.lastTrain}
            destination={train.dest}
            cars={train.cars}
            index={train.index}
            removeTrain={props.removeTrain}
            id={train.id}
            totalTime={train.totalMinutes}
            initialPos={train.initialPosition}
            initCoords={train.initCoords}
            currentSlice={train.currentSlice}
            ref={(ins) => (refs.current[index] = ins)}
            getMap={props.getMap}
            zoom={zoomRef.current}
            interval={train.interval}
          />
        );
      })}
    </>
  );
});

export default Trains;
