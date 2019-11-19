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
  useImperativeHandle
} from "react";

import L from "leaflet";
import NewMarker from "./marker";

const Trains = React.forwardRef(function Trains(props, ref) {
  //console.log(update);

  const STEPS = 60 * 1000;
  const refs = useRef([]);
  const zoomRef = useRef(false);
  const [zoom, setZoom] = useState(null);
  const [trains2, setTrains2] = useState([]);
  //const trains = props.trains;

  // useEffect(() => {
  //   // if (!refs) {
  //   //   return;
  //   // }
  //   setTrains2(props.trains);
  // }, [props.trains2]);

  console.log(trains);
  let startTime = 0;
  //let frameId = null;
  const trains = props.trains;
  const str = JSON.stringify(props.trains);
  useLayoutEffect(() => {
    // if (!refs) {
    //   return;
    // }
    let frameId = null;

    // if (zoomRef.current) {
    //   window.cancelAnimationFrame(frameId);
    // }
    //window.cancelAnimationFrame(frameId);
    const animate = timestamp => {
      // const runtime = timestamp - startTime;
      // const timeStep = Math.round(runtime);
      refs.current.map(child => {
        if (child && !zoomRef.current) {
          console.log(child, zoom);
          child.update(timestamp);
          // let status = child.checkAnim();
          // console.log(status);
          // if (status) {

          // }
        }
      });

      setTimeout(() => {
        window.requestAnimationFrame(animate);
      }, 1000 / 10);
    };

    // console.log(zoom);
    // //window.cancelAnimationFrame(frameId);
    // console.log(zoom);
    // console.log(refs);
    if (!zoomRef.current) {
      // console.log(timeStep);
      //cancelAnimationFrame(frameId);
      // frameId = L.Util.requestAnimFrame(t => {
      //   console.log(zoom);
      //   //startTime = t;
      //   animate(t);
      // });
      frameId = window.requestAnimationFrame(t => {
        console.log(zoom);
        //startTime = t;
        animate(t);
      });
    }

    return () => {
      console.log(zoom);
      window.cancelAnimationFrame(frameId);

      //frameId = null;
    };
  }, []);

  // useLayoutEffect(() => {
  //   // if (!refs) {
  //   //   return;
  //   // }
  //   console.log(props.zoom);

  //   console.log(refs);
  //   if (frameId != null && props.zoom) {
  //     L.Util.cancelAnimFrame(frameId);
  //     frameId = null;
  //     // console.log(timeStep);
  //   } else if (frameId == null && props.zoom == null) {
  //     //cancelAnimationFrame(frameId);
  //     frameId = L.Util.requestAnimFrame(t => {
  //       //startTime = t;
  //       animate(t);
  //     });
  //   }

  //   // return () => {
  //   //   L.Util.cancelAnimFrame(frameId);
  //   //   frameId = null;
  //   // };
  // }, [props.zoom]);

  useImperativeHandle(ref, () => ({
    updateZoom(arg) {
      const bool = zoomRef.current;
      console.log(bool);
      // console.log(bool);
      zoomRef.current = arg;
      //setZoom(!bool);
    }
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
            minutes={train.minutes}
            lastTrain={train.lastTrain}
            destination={train.dest}
            index={index}
            removeTrain={props.removeTrain}
            id={train.id}
            totalTime={train.totalMinutes}
            initialPos={train.initialPosition}
            initCoords={train.initCoords}
            currentSlice={train.currentSlice}
            ref={ins => (refs.current[index] = ins)}
            getMap={props.getMap}
            zoom={zoomRef.current}
          />
        );
      })}
    </>
  );
  // <NewMarker
  //   key={trains.id}
  //   color={train.hexcolor}
  //   station={train.stationName}
  //   minutes={train.minutes}
  //   id={train.id}
  //   currentSlice={train.currentSlice}
  // />
});

export default Trains;
