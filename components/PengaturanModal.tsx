import React from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface PengaturanModalProps {
  visible: boolean;
  deviceCode: string;
  saldoAmount: string;
  nomorDarurat: string;
  onDeviceCodeChange: (code: string) => void;
  onSaldoAmountChange: (amount: string) => void;
  onNomorDaruratChange: (nomor: string) => void;
  onClose: () => void;
}

export default function PengaturanModal({
  visible,
  deviceCode,
  saldoAmount,
  nomorDarurat,
  onDeviceCodeChange,
  onSaldoAmountChange,
  onNomorDaruratChange,
  onClose,
}: PengaturanModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.settingsModalContent}>
          <Text style={styles.settingsModalTitle}>Pengaturan</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Hubungkan Perangkat</Text>
            <TextInput
              style={styles.formInput}
              value={deviceCode}
              onChangeText={onDeviceCodeChange}
              placeholder="No. Telepon"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Isi Saldo</Text>
            <View style={styles.saldoDisplayContainer}>
              <Text style={styles.saldoDisplayLabel}>Saldo saat ini</Text>
              <Text style={styles.saldoDisplayAmount}>Rp. 250.000</Text>
            </View>
            <View style={styles.saldoInputRow}>
              <TextInput
                style={styles.saldoInputSmall}
                value={saldoAmount}
                onChangeText={onSaldoAmountChange}
                placeholder="Nominal"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.isiButton}>
                <Text style={styles.isiButtonText}>Isi</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Atur Nomor Darurat</Text>
          </View>

          <TouchableOpacity 
            style={styles.tutupButton}
            onPress={onClose}
          >
            <Text style={styles.tutupButtonText}>Tutup</Text>
          </TouchableOpacity>

          <View style={styles.pinFooter}>
            <Text style={styles.pinFooterText}>Ketuk untuk lihat</Text>
            <Text style={styles.pinFooterLink}>Syarat & Ketentuan</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  settingsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    maxWidth: 450,
  },
  settingsModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  saldoDisplayContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  saldoDisplayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  saldoDisplayAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  saldoInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saldoInputSmall: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  isiButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  isiButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  tutupButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tutupButtonText: {
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
