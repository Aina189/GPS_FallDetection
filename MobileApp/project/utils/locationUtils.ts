import { Platform } from 'react-native';

export const formatCoordinate = (coordinate: number, type: 'latitude' | 'longitude'): string => {
  const absCoordinate = Math.abs(coordinate);
  const degrees = Math.floor(absCoordinate);
  const minutes = Math.floor((absCoordinate - degrees) * 60);
  const seconds = ((absCoordinate - degrees - minutes / 60) * 3600).toFixed(2);
  
  let direction = '';
  if (type === 'latitude') {
    direction = coordinate >= 0 ? 'N' : 'S';
  } else {
    direction = coordinate >= 0 ? 'E' : 'W';
  }
  
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

export const validateCoordinates = (lat: string, lng: string): { isValid: boolean; error?: string } => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return { isValid: false, error: 'Veuillez entrer des nombres valides pour la latitude et longitude' };
  }
  
  if (latNum < -90 || latNum > 90) {
    return { isValid: false, error: 'La latitude doit être entre -90 et 90' };
  }
  
  if (lngNum < -180 || lngNum > 180) {
    return { isValid: false, error: 'La longitude doit être entre -180 et 180' };
  }
  
  return { isValid: true };
};

export const generateGoogleMapsUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

export const generateDirectionsUrl = (fromLat: number, fromLng: number, toLat: number, toLng: number): string => {
  return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
};

export const generateAppleMapsUrl = (latitude: number, longitude: number): string => {
  return `http://maps.apple.com/?q=${latitude},${longitude}`;
};

export const generateWazeUrl = (latitude: number, longitude: number): string => {
  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
};

export const parseCoordinatesFromText = (text: string): { latitude?: number; longitude?: number } => {
  // Remove common prefixes and clean the text
  const cleanText = text.replace(/[^\d\-.,\s]/g, ' ').trim();
  
  // Try to match various coordinate formats
  const patterns = [
    // Decimal degrees: 40.7128, -74.0060
    /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/,
    // With N/S/E/W: 40.7128N, 74.0060W
    /(-?\d+\.?\d*)[NS][,\s]+(-?\d+\.?\d*)[EW]/i,
    // Degrees minutes seconds: 40°42'46"N 74°00'22"W
    /(\d+)°(\d+)'([\d.]+)"[NS][,\s]+(\d+)°(\d+)'([\d.]+)"[EW]/i,
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  }

  return {};
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};