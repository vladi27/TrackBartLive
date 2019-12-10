# TrackBartLive

[TrackBartLive](https://vladi27.github.io/TrackBartLive/#/)
is a single-page application that is designed to track BART trains in real-time.

## Background and Overview

BART is the fifth-busiest heavy rail rapid transit system in the United States that provides service to 411,000 weekday passengers on average, and estimates to serve 118 million annual passengers in 2019. BART serves 48 stations along six routes on 112 miles of rapid transit lines.

BART provides their passengers with the information about trains' estimated departure times (ETD) and destinations for every station it serves. However, passengers do not have any information about how many trains are on the route at a particular point of time and what their locations are. This app aims to solve this data and give passengers more transparency about BART trains.

## Demo

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/41927284/69707170-1885d780-10ae-11ea-9ddb-9eca9b9718f3.gif)

## Technologies

- React
- Redux
- React Leaflet
- Leaflet
- Axios
- Leaflet Geometry Util
- Webpack
- React Select
- CSS3
- Node FS

## Technical Challenges

This app leverages Axios HTTP requests to asynchronously call BART API every fifteen seconds and fetch the most recent ETDs for every station that BART serves.

As BART API does not provide any data about train locations, this app uses Redux thunk middleware and Redux reducers to calculate the number of trains on a route at the particular point of time based on the stations' current estimates and estimates for the stations that precede them along the route.

```javascript

case CREATE_TRAINS:
      routeStations.map((station, idx) => {
        let stationName = station.stationName;
        let order = station.order;
        let stationETAs = currentEtas[stationName];
        let prevStation = routeStations[idx - 1];
        if (stationETAs) {
          stationETAs.etd.map(departure => {
            let dest = departure.abbreviation;
            if (routeDestination.includes(dest)) {
              let estimates = departure.estimate;
              let currentEstimate = find(estimates, function(o) {
                return o.hexcolor === routeHexcolor;
              });
              if (currentEstimate) {
                let minutes = currentEstimate.minutes;
                let hexcolor = currentEstimate.hexcolor;
                let direction = currentEstimate.direction;
                if (minutes === "Leaving" && idx !== routeStations.length - 1) {
                  let id = uuidv4();
                  let train = {
                    dest,
                    hexcolor,
                    direction: direction,
                    minutes,
                    stationName,
                    route: route.number,
                    lastTrain: false,
                    stationIdx: idx,
                    id,
                    initCoords: station.location,
                    pos: station.location,
                    initialPosition: true
                  };
                  return newTrains.push(train);

             //...
```

The trains are being passed as props to the React functional component where this app utilizes useLayoutEffect hook to synchronously update DOM elements before they re-render as well as requestAnimationFrame function to control train speeds and limit CPU usage for train animations.

```javascript
useLayoutEffect(() => {
  let frameId = null;

  const animate = timestamp => {
    refs.current.map(child => {
      if (child && !zoomRef.current) {
      }
    });

    setTimeout(() => {
      window.requestAnimationFrame(animate);
    }, 1000 / 10);
  };

  frameId = window.requestAnimationFrame(t => {
    animate(t);
  });

  return () => {
    window.cancelAnimationFrame(frameId);
  };
}, []);
```

Train components use React refs to directly access DOM elements and Leaflet Geometry Util to dynamically interpolate time delta ratio and train current polyline, and set the updated longtitude and latitude for each animation frame.

```javascript
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

    if (ratio >= 0.95 && lastTrain && minutes === "1") {
      props.removeTrain(id);
      animated.current = null;
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
  }
}));
```

## Features

- Users can select a single or multiple BART lines they want to track.
- The app dynamically adds new trains for the selected routes and removes trains that reach their destinations so users see the accurate number of trains on the map without having to refresh the page.
- Users can click on any train on the map to start tracking it and every time the train arrives at the station or leaves it, the map would dynamically change its view.

## Future plans

- Implement notification system
