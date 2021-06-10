import { Map, TileLayer, CircleMarker, Polyline, Popup } from "react-leaflet";
import React, { Component, PureComponent } from "react";

const Station = ({ station, hexcolor, name }) => {
  return (
    <CircleMarker key={`marker-${hexcolor}`} center={station} radius={6}>
      <Popup>{name}</Popup>
    </CircleMarker>
  );
};

export default Station;
