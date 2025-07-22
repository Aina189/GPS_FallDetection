import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Clipboard, Zap } from 'lucide-react-native';
import { parseCoordinatesFromText } from '@/utils/locationUtils';
import * as ClipboardAPI from 'expo-clipboard';

interface QuickPasteButtonProps {
  onCoordinatesParsed: (latitude:number,longitude:number,status:string) => void;
}

export default function QuickPasteButton({ onCoordinatesParsed }: QuickPasteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickPaste = async () => {
    setIsLoading(true);
    try {
      const clipboardText = await ClipboardAPI.getStringAsync();
      
      if (!clipboardText.trim()) {
        Alert.alert('Presse-papiers vide', 'Aucun texte trouvé dans le presse-papiers');
        return;
      }

      const  part:string[] = clipboardText.split(':');
      const { latitude, longitude } = parseCoordinatesFromText(part[1]);
      
      if (latitude !== undefined && longitude !== undefined) {
        onCoordinatesParsed(latitude, longitude,part[0]);
        Alert.alert('Succès', 'Coordonnées détectées et remplies automatiquement!');
      } else {
        Alert.alert(
          'Coordonnées non détectées', 
          'Impossible de détecter des coordonnées valides dans le texte copié.\n\nFormats supportés:\n• 40.7128, -74.0060\n• 40.7128N, 74.0060W\n• 40°42\'46"N 74°00\'22"W'
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire le presse-papiers');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.quickPasteButton} 
      onPress={handleQuickPaste}
      disabled={isLoading}
    >
      <View style={styles.buttonContent}>
        <Zap size={20} color="#F59E0B" />
        <Text style={styles.buttonText}>
          {isLoading ? 'Analyse...' : 'Coller & Détecter'}
        </Text>
      </View>
      <Text style={styles.buttonSubtext}>
        Colle automatiquement depuis le presse-papiers
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  quickPasteButton: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FED7AA',
    borderStyle: 'dashed',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 8,
  },
  buttonSubtext: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
});