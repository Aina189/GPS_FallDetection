export interface LocationData {
  latitude: number;
  longitude: number;
  time: string;
  name?: string;
  alertType?:string; 
}

export interface LocationHistory {
  locations: LocationData[];
}

export interface RouteData {
  distance?: string;
  duration?: string;
  steps?: string[];
}