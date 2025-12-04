import React from 'react';
import { Dimensions, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface PinModalProps {
  visible: boolean;
  pin: string;
  onPinChange: (pin: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function PinModal({ visible, pin, onPinChange, onSubmit, onClose }: PinModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pinModalContent}>
          <Text style={styles.pinTitle}>Pengaturan</Text>
          
          <View style={styles.pinInputContainer}>
            <Text style={styles.pinLabel}>Masukkan Pin</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={onPinChange}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={styles.pinButton}
            onPress={onSubmit}
          >
            <Text style={styles.pinButtonText}>Masuk</Text>
          </TouchableOpacity>

          <View style={styles.pinFooter}>
            <Text style={styles.pinFooterText}>Ketuk untuk lihat</Text>
            <Text style={styles.pinFooterLink}>Syarat & Ketentuan</Text>
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
  pinModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
  },
  pinTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  pinInputContainer: {
    marginBottom: 20,
  },
  pinLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  pinInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  pinButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  pinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  pinFooter: {
    marginTop: 30,
    alignItems: 'center',
  },
  pinFooterText: {
    fontSize: 12,
    color: '#666',
  },
  pinFooterLink: {
    fontSize: 12,
    color: '#4A90E2',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  fingerprint: {
    marginTop: 20,
  },
});
