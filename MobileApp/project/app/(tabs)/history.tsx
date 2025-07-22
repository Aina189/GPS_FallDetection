import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  RefreshControl 
} from 'react-native';
import { History, Trash2, MapPin, Clock } from 'lucide-react-native';
import { LocationData } from '@/types/location';
import { getLocationHistory, clearLocationHistory } from '@/utils/storage';
import LocationCard from '@/components/LocationCard';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export default function HistoryTab() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const history = await getLocationHistory();
      setLocations(history.locations);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          time: new Date().toISOString(),
          name: 'Ma position actuelle',
        };
        
        setCurrentLocation(locationData);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      getCurrentLocation();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
    getCurrentLocation();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Êtes-vous sûr de vouloir effacer tout l\'historique des emplacements ? Cette action ne peut pas être annulée.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Effacer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearLocationHistory();
              setLocations([]);
              Alert.alert('Succès', 'Historique des emplacements effacé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'effacer l\'historique');
            }
          }
        }
      ]
    );
  };

  const renderLocationItem = ({ item }: { item: LocationData }) => (
    <LocationCard 
      location={item} 
      currentLocation={currentLocation}
      showDirections={true}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Clock size={48} color="#94A3B8" />
      </View>
      <Text style={styles.emptyStateTitle}>Aucun historique</Text>
      <Text style={styles.emptyStateText}>
        Vos emplacements recherchés apparaîtront ici pour un accès rapide
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <History size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Historique</Text>
            <Text style={styles.headerSubtitle}>
              {locations.length} emplacement{locations.length !== 1 ? 's' : ''} sauvegardé{locations.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        {locations.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Trash2 size={18} color="#EF4444" />
            {/* <Text style={styles.clearButtonText}>Effacer</Text> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={locations}
        renderItem={renderLocationItem}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});