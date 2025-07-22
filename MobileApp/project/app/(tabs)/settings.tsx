import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  ScrollView,
  Linking 
} from 'react-native';
import { 
  Settings, 
  Info, 
  ExternalLink, 
  MapPin, 
  Trash2,
  Mail,
  Shield,
  Smartphone,
  Navigation
} from 'lucide-react-native';
import { clearLocationHistory } from '@/utils/storage';

export default function SettingsTab() {
  const handleClearHistory = () => {
    Alert.alert(
      'Effacer tout l\'historique',
      'Êtes-vous sûr de vouloir effacer tout l\'historique des emplacements ? Cette action ne peut pas être annulée.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Effacer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearLocationHistory();
              Alert.alert('Succès', 'Tout l\'historique des emplacements a été effacé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'effacer l\'historique');
            }
          }
        }
      ]
    );
  };

  const handleOpenMaps = () => {
    const url = 'https://maps.google.com';
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de cartes');
    });
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Support technique',
      'Besoin d\'aide avec l\'application Localisation GPS ? Nous sommes là pour vous aider !',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Localisation GPS',
      'Version 1.0.0\n\nApplication de localisation GPS permettant de trouver des emplacements à partir de coordonnées et d\'afficher des itinéraires.\n\nDéveloppé avec React Native & Expo',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onPress: () => void,
    destructive?: boolean
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, destructive && styles.destructiveItem]} 
      onPress={onPress}
    >
      <View style={[styles.settingIcon, destructive && styles.destructiveIcon]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <ExternalLink size={16} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Settings size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <Text style={styles.headerSubtitle}>
            Configurez vos préférences de localisation GPS
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services de localisation</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <MapPin size={22} color="#3B82F6" />,
              'Ouvrir Google Maps',
              'Voir les emplacements dans Google Maps',
              handleOpenMaps
            )}
            {renderSettingItem(
              <Navigation size={22} color="#10B981" />,
              'Applications de navigation',
              'Accès rapide aux itinéraires',
              () => Alert.alert('Navigation', 'Utilisez les boutons d\'itinéraire sur chaque emplacement pour accéder aux applications de navigation')
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestion des données</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Trash2 size={22} color="#EF4444" />,
              'Effacer l\'historique',
              'Supprimer tous les emplacements sauvegardés',
              handleClearHistory,
              true
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Mail size={22} color="#3B82F6" />,
              'Contacter le support',
              'Obtenir de l\'aide avec l\'application',
              handleContactSupport
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              <Info size={22} color="#3B82F6" />,
              'Informations sur l\'application',
              'Version 1.0.0',
              handleAbout
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Shield size={28} color="#64748B" />
            <View style={styles.footerText}>
              <Text style={styles.footerTitle}>Confidentialité et sécurité</Text>
              <Text style={styles.footerSubtitle}>
                Vos données de localisation sont stockées localement sur votre appareil pour garantir votre confidentialité et sécurité.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#6366F1',
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  destructiveItem: {
    // Additional styling for destructive actions
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#FEF2F2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  destructiveText: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  footerText: {
    marginLeft: 16,
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  footerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
});