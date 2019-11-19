import axios from "axios";
const stationsSouthBound = [
  "ANTC",
  "PCTR",
  "PITT",
  "NCON",
  "CONC",
  "PHIL",
  "WCRK",
  "LAFY",
  "ORIN",
  "ROCK",
  "MCAR",
  "19TH",
  "12TH",
  "WOAK",
  "EMBR",
  "MONT",
  "POWL",
  "CIVC",
  "16TH",
  "24TH",
  "GLEN",
  "BALB",
  "DALY",
  "COLM",
  "SSAN",
  "SBRN",
  "SFIA",
  "MLBR"
];

export const fetchCurrentEtas = () => {
  return axios.get(
    "http://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&key=MW9S-E7SL-26DU-VV8V&json=y"
  );
};

export const getStations = () => {
  return axios.get(
    "https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y"
  );
};
export const getStation = abbr => {
  console.log(abbr);
  return axios.get(
    `http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${abbr}&key=MW9S-E7SL-26DU-VV8V&json=y`
  );
};
export const getRoutes = () => {
  return axios.get(
    "http://api.bart.gov/api/route.aspx?cmd=routes&key=MW9S-E7SL-26DU-VV8V&date=now&json=y"
  );
};

export const getSchedules = id => {
  return axios.get(
    `http://api.bart.gov/api/sched.aspx?cmd=routesched&route=${id}&key=MW9S-E7SL-26DU-VV8V&date=now&json=y`
  );
};
export const getStationDepartures = abbr => {
  return axios.get(
    `https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${abbr}&key=MW9S-E7SL-26DU-VV8V&json=y`
  );
};

export const getRouteStations = id => {
  return axios.get(
    `http://api.bart.gov/api/route.aspx?cmd=routeinfo&route=${id}&key=MW9S-E7SL-26DU-VV8V&json=y`
  );
};
