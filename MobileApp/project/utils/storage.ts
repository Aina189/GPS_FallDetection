import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData, LocationHistory } from '@/types/location';
import axios from 'axios';

const STORAGE_KEY = '@gps_location_history';

export const saveLocationToHistory = async (location: LocationData): Promise<void> => {
  try {
    // const existingHistory = await getLocationHistory();
    // const newHistory: LocationHistory = {
    //   locations: [location, ...existingHistory.locations].slice(0, 100), // Keep last 100 locations
    // };
    
    // await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    const response = await axios.post('http://192.168.0.118:8080/api/dataplace',location);
    if (response.status === 201) {
      console.log('Location saved successfully:', response.data);
    }
    else {
      console.error('Failed to save location:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving location to history:', error);
    throw error;
  }
};

export const getLocationHistory = async (): Promise<LocationHistory> => {
  try {
    // const historyString = await AsyncStorage.getItem(STORAGE_KEY);
    const response = await axios.get('http://192.168.0.118:8080/api/allPlace');
    // const historyString = JSON.stringify(response.data);
    // console.log('Location history retrieved:', historyString);
    // if (historyString) {
    //   return JSON.parse(historyString);
    // }
    return { locations: response.data || [] };
  } catch (error) {
    console.error('Error getting location history:', error);
    return { locations: [] };
  }
};

export const clearLocationHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing location history:', error);
    throw error;
  }
};