import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { MapPin, Search, Target, Plus, Crosshair } from 'lucide-react-native';
import * as Location from 'expo-location';
import { LocationData } from '@/types/location';
import { saveLocationToHistory } from '@/utils/storage';
import { validateCoordinates } from '@/utils/locationUtils';
import QuickPasteButton from '@/components/QuickPasteButton';
import LocationCard from '@/components/LocationCard';
import React = require('react');

export default function LocationFinder() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [status, setStatus] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [searchedLocation, setSearchedLocation] = useState<LocationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          "L'autorisation de localisation est requise pour obtenir votre position actuelle"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        time: new Date().toISOString(),
        name: 'Ma position actuelle',
      };

      setCurrentLocation(locationData);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Erreur', "Impossible d'obtenir la position actuelle");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!latitude.trim() || !longitude.trim()) {
      setError('Veuillez entrer la latitude et la longitude');
      return;
    }

    const validation = validateCoordinates(latitude, longitude);
    if (!validation.isValid) {
      setError(validation.error || 'Coordonnées invalides');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const locationData: LocationData = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        time: new Date().toISOString(),
        //name: locationName.trim() || 'Emplacement recherché',
        alertType:status
      };

      setSearchedLocation(locationData);
      console.log('Searched Location:', locationData);
      await saveLocationToHistory(locationData);
    } catch (error) {
      setError("Erreur lors de la recherche de l'emplacement");
    } finally {
      setIsLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (currentLocation) {
      setLatitude(currentLocation.latitude.toString());
      setLongitude(currentLocation.longitude.toString());
      setLocationName('Ma position actuelle');
      setError('');
    }
  };

  const handleQuickPaste = (lat: number, lng: number , stat:string) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setError('');
    setStatus(stat);
  };

  const clearForm = () => {
    setLatitude('');
    setLongitude('');
    setLocationName('');
    setError('');
    setSearchedLocation(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Crosshair size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Fall detection app GPS</Text>
            <Text style={styles.headerSubtitle}>
              Entrez des coordonnées pour trouver un emplacement et voir
              l'itinéraire
            </Text>
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputCardTitle}>Rechercher un emplacement</Text>
            <QuickPasteButton onCoordinatesParsed={handleQuickPaste}/>
            {/* <View style={styles.coordinateInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="Ex: 48.8566"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="Ex: 2.3522"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View> */}

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleSearch}
                disabled={isLoading}
              >
                <Search size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Recherche...' : 'Localiser'}
                </Text>
              </TouchableOpacity>

              {currentLocation && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={useCurrentLocation}
                >
                  <Target size={20} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>Ma position</Text>
                </TouchableOpacity>
              )}
            </View>

            {(latitude || longitude) && (
              <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
                <Text style={styles.clearButtonText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>

          {searchedLocation && (
            <View style={styles.resultSection}>
              <View style={styles.sectionHeader}>
                <MapPin size={24} color="#10B981" />
                <Text style={styles.sectionTitle}>Emplacement trouvé</Text>
              </View>

              <LocationCard
                location={searchedLocation}
                currentLocation={currentLocation}
                showDirections={true}
              />
            </View>
          )}

          {currentLocation && (
            <View style={styles.currentLocationSection}>
              <View style={styles.sectionHeader}>
                <Target size={24} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Ma position actuelle</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <Text style={styles.refreshButtonText}>
                    {isGettingLocation ? 'Actualisation...' : 'Actualiser'}
                  </Text>
                </TouchableOpacity>
              </View>

              <LocationCard location={currentLocation} showDirections={false} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  inputCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
    fontWeight: '500',
  },
  coordinateInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  clearButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  resultSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  currentLocationSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
