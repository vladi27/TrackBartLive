import { Map, TileLayer, CircleMarker, Polyline, Popup } from "react-leaflet";
import React, { Component, PureComponent } from "react";

const Station = ({ station, hexcolor, name }) => {
  return (
    <CircleMarker key={`marker-${hexcolor}`} center={station} radius={6}>
      <Popup>{name}</Popup>
    </CircleMarker>
  );
};
//   extends PureComponent {
//   constructor(props) {
//     super(props);
//     console.log(this.props);

//     // this.state = { stations: this.props.selectedRoute.stations || [] };
//     this.state = { routes: [] };
//   }

//   componentDidMount() {
//     const station = this.props.station;
//     const name = station.abbr;
//     // const hexcolor = this.props.hexcolor;
//     // this.setState(prev => {
//     //   if (prev.routes.indexOf(hexcolor) > -1) {
//     //     return;
//     //   } else {
//     //     return { routes: prev.routes.concat([hexcolor]) };
//     //   }
//     // });
//   }

//   // componentWillUnmount() {
//   //   clearInterval(this.interval);
//   // }

//   render() {
//     console.log(this.state);
//     const station = this.props.station;

//     let station2Lat = parseFloat(station.gtfs_latitude);
//     let station2Long = parseFloat(station.gtfs_longitude);
//     let arr = [station2Lat, station2Long];
//     return (
//       <CircleMarker
//         key={`marker-${station.abbr}`}
//         center={arr}
//         radius={10}
//       ></CircleMarker>
//     );
//   }
// }

export default Station;
