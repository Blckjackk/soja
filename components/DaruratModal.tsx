import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface KontakDarurat {
  id: number;
  nama: string;
  telepon: string;
}

interface DaruratModalProps {
  visible: boolean;
  kontakList: KontakDarurat[];
  onCall: (telepon: string) => void;
  onClose: () => void;
}

export default function DaruratModal({ visible, kontakList, onCall, onClose }: DaruratModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kontak Darurat</Text>
          <Text style={styles.modalSubtitle}>Pilih kontak yang ingin dihubungi</Text>

          <View style={styles.kontakList}>
            {kontakList.map((kontak) => (
              <View key={kontak.id} style={styles.kontakItem}>
                <View style={styles.kontakInfo}>
                  <Text style={styles.kontakNama}>{kontak.nama}</Text>
                  <Text style={styles.kontakTelepon}>No. Telepon</Text>
                </View>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => onCall(kontak.telepon)}
                >
                  <Ionicons name="call" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Button 
            mode="contained" 
            style={styles.tutupButton}
            labelStyle={styles.tutupButtonLabel}
            onPress={onClose}
          >
            Tutup
          </Button>
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
    borderRadius: 25,
    padding: 25,
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 20,
  },
  kontakList: {
    marginBottom: 20,
  },
  kontakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    marginBottom: 12,
  },
  kontakInfo: {
    flex: 1,
  },
  kontakNama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  kontakTelepon: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#FF6B4A',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  tutupButton: {
    backgroundColor: '#FDB44B',
    borderRadius: 25,
    paddingVertical: 8,
  },
  tutupButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  footerText: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  voiceCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B7355',
  },
  voiceLine: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    marginTop: 8,
    borderRadius: 2,
  },
});
