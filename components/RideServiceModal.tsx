import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface RideServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onJemputPress?: () => void;
  onAntarPress?: () => void;
}

export default function RideServiceModal({
  visible,
  onClose,
  onJemputPress,
  onAntarPress,
}: RideServiceModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pilih Layanan</Text>
          <Text style={styles.modalSubtitle}>
            Pilih layanan yang Anda butuhkan
          </Text>

          <View style={styles.servicesContainer}>
            {/* Jemput Card */}
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                onJemputPress?.();
                onClose();
              }}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="location" size={40} color="#4A90E2" />
              </View>
              <Text style={styles.serviceTitle}>Jemput</Text>
              <Text style={styles.serviceDescription}>
                Driver akan menjemput Anda di lokasi yang ditentukan
              </Text>
            </TouchableOpacity>

            {/* Antar Card */}
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => {
                onAntarPress?.();
                onClose();
              }}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons name="navigate" size={40} color="#4A90E2" />
              </View>
              <Text style={styles.serviceTitle}>Antar</Text>
              <Text style={styles.serviceDescription}>
                Driver akan mengantar Anda ke lokasi tujuan
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ketuk untuk lihat</Text>
            <Text style={styles.footerLink}>Syarat & Ketentuan</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    maxWidth: 450,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  servicesContainer: {
    gap: 15,
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  footerLink: {
    fontSize: 12,
    color: '#4A90E2',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
});
