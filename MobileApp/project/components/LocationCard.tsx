
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { Copy, CircleCheck as CheckCircle, ExternalLink, MapPin, Navigation, Car, Smartphone } from 'lucide-react-native';
import { LocationData } from '@/types/location';
import { formatCoordinate, generateGoogleMapsUrl, generateDirectionsUrl, generateAppleMapsUrl, generateWazeUrl } from '@/utils/locationUtils';
import * as Clipboard from 'expo-clipboard';
import React = require('react');

interface LocationCardProps {
  location: LocationData;
  currentLocation?: LocationData | null;
  showDirections?: boolean;
}

export default function LocationCard({ location, currentLocation, showDirections = true }: LocationCardProps) {
  const [copiedField, setCopiedField] = React.useState<string>('');

  const handleCopy = async (text: string, type: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de copier dans le presse-papiers');
    }
  };

  const openInMaps = async () => {
    const url = generateGoogleMapsUrl(location.latitude, location.longitude);
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de cartes');
    }
  };

  const showDirectionsOptions = () => {
    if (!currentLocation) {
      Alert.alert('Position actuelle requise', 'Votre position actuelle est nécessaire pour afficher l\'itinéraire');
      return;
    }

    const options = [
      {
        title: 'Google Maps',
        url: generateDirectionsUrl(currentLocation.latitude, currentLocation.longitude, location.latitude, location.longitude),
        icon: '🗺️'
      },
      {
        title: 'Apple Plans',
        url: generateAppleMapsUrl(location.latitude, location.longitude),
        icon: '🍎'
      },
      {
        title: 'Waze',
        url: generateWazeUrl(location.latitude, location.longitude),
        icon: '🚗'
      }
    ];

    Alert.alert(
      'Choisir l\'application',
      'Sélectionnez l\'application pour afficher l\'itinéraire',
      [
        ...options.map(option => ({
          text: `${option.icon} ${option.title}`,
          onPress: () => Linking.openURL(option.url).catch(() => 
            Alert.alert('Erreur', `Impossible d'ouvrir ${option.title}`)
          )
        })),
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MapPin size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>{location.alertType}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {showDirections && currentLocation && (
            <TouchableOpacity style={styles.actionButton} onPress={showDirectionsOptions}>
              <Navigation size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={openInMaps}>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.coordinateContainer}>
        <View style={styles.coordinateRow}>
          <Text style={styles.coordinateLabel}>Latitude:</Text>
          <TouchableOpacity 
            style={styles.coordinateValue}
            onPress={() => handleCopy(location.latitude.toString(), 'latitude')}
          >
            <View style={styles.coordinateInfo}>
              <Text style={styles.coordinateText}>{location.latitude.toFixed(6)}</Text>
              <Text style={styles.coordinateFormatted}>{formatCoordinate(location.latitude, 'latitude')}</Text>
            </View>
            <View style={styles.copyIcon}>
              {copiedField === 'latitude' ? (
                <CheckCircle size={16} color="#10B981" />
              ) : (
                <Copy size={16} color="#6B7280" />
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.coordinateRow}>
          <Text style={styles.coordinateLabel}>Longitude:</Text>
          <TouchableOpacity 
            style={styles.coordinateValue}
            onPress={() => handleCopy(location.longitude.toString(), 'longitude')}
          >
            <View style={styles.coordinateInfo}>
              <Text style={styles.coordinateText}>{location.longitude.toFixed(6)}</Text>
              <Text style={styles.coordinateFormatted}>{formatCoordinate(location.longitude, 'longitude')}</Text>
            </View>
            <View style={styles.copyIcon}>
              {copiedField === 'longitude' ? (
                <CheckCircle size={16} color="#10B981" />
              ) : (
                <Copy size={16} color="#6B7280" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date(location.time).toLocaleString('fr-FR')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coordinateContainer: {
    gap: 16,
    marginBottom: 20,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinateLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    width: 90,
  },
  coordinateValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coordinateInfo: {
    flex: 1,
  },
  coordinateText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  coordinateFormatted: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  copyIcon: {
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timestamp: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  accuracy: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
});