import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function PengaturanScreen() {
  const router = useRouter();
  const [showPinModal, setShowPinModal] = useState(true);
  const [pin, setPin] = useState('');
  const [showMainSettings, setShowMainSettings] = useState(false);
  
  // Settings modals
  const [showHubungkanModal, setShowHubungkanModal] = useState(false);
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [showDaruratModal, setShowDaruratModal] = useState(false);
  
  // Form states
  const [saldoAmount, setSaldoAmount] = useState('250000');
  const [deviceCode, setDeviceCode] = useState('');
  const [nomorDarurat, setNomorDarurat] = useState('');

  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      setShowPinModal(false);
      setShowMainSettings(true);
    }
  };

  const handleSaldoSubmit = () => {
    setShowSaldoModal(false);
    // Handle saldo top-up logic here
  };

  const handleHubungkanSubmit = () => {
    setShowHubungkanModal(false);
    // Handle device connection logic here
  };

  const handleDaruratSubmit = () => {
    setShowDaruratModal(false);
    // Handle emergency contact logic here
  };

  return (
    <View style={styles.container}>
      {/* PIN Modal */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => router.back()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pinModalContent}>
            <Text style={styles.pinTitle}>Pengaturan</Text>
            
            <View style={styles.pinInputContainer}>
              <Text style={styles.pinLabel}>Masukkan Pin</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity 
              style={styles.pinButton}
              onPress={handlePinSubmit}
            >
              <Text style={styles.pinButtonText}>Lanjut</Text>
            </TouchableOpacity>

            <View style={styles.pinFooter}>
              <Text style={styles.pinFooterText}>Ketuk untuk lihat</Text>
              <Text style={styles.pinFooterLink}>Syarat & Ketentuan</Text>
              <View style={styles.fingerprint}>
                <Ionicons name="finger-print" size={40} color="#FDB44B" />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Settings Screen */}
      {showMainSettings && (
        <View style={styles.settingsContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pengaturan</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {/* Hubungkan Perangkat */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setShowHubungkanModal(true)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="phone-portrait-outline" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.menuText}>Hubungkan Perangkat</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Isi Saldo */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setShowSaldoModal(true)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="wallet-outline" size={24} color="#FDB44B" />
              </View>
              <Text style={styles.menuText}>Isi Saldo</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Saldo Saat Ini */}
            <View style={styles.saldoCard}>
              <View style={styles.saldoHeader}>
                <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                <Text style={styles.saldoLabel}>Saldo Saat Ini</Text>
              </View>
              <Text style={styles.saldoAmount}>Rp. 250.000</Text>
            </View>

            {/* Atur Nomor Darurat */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setShowDaruratModal(true)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="call-outline" size={24} color="#FF6B4A" />
              </View>
              <Text style={styles.menuText}>Atur Nomor Darurat</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Privasi & Keamanan */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.menuText}>Privasi & Keamanan</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Bantuan */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="help-circle-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.menuText}>Bantuan</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Tentang */}
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="information-circle-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.menuText}>Tentang Aplikasi</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Keluar */}
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#F44336" />
              </View>
              <Text style={[styles.menuText, styles.logoutText]}>Keluar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Hubungkan Perangkat Modal */}
      <Modal
        visible={showHubungkanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHubungkanModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsModalTitle}>Pengaturan</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hubungkan Perangkat</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={deviceCode}
                  onChangeText={setDeviceCode}
                  placeholder="Ex: 1928301"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowHubungkanModal(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSubmitButton}
                onPress={handleHubungkanSubmit}
              >
                <Text style={styles.modalSubmitText}>Hubungkan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>Ketuk untuk lihat</Text>
              <Text style={styles.modalFooterLink}>Syarat & Ketentuan</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Isi Saldo Modal */}
      <Modal
        visible={showSaldoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSaldoModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsModalTitle}>Pengaturan</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hubungkan Perangkat</Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={deviceCode}
                  onChangeText={setDeviceCode}
                  placeholder="Ex: 1928301"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Isi Saldo</Text>
              <View style={styles.saldoInputContainer}>
                <Text style={styles.saldoCurrency}>Rp</Text>
                <TextInput
                  style={styles.saldoInput}
                  value={saldoAmount}
                  onChangeText={setSaldoAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.saldoOptions}>
                <TouchableOpacity style={styles.saldoOption}>
                  <Text style={styles.saldoOptionText}>50.000</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saldoOption}>
                  <Text style={styles.saldoOptionText}>100.000</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saldoOptionActive}>
                  <Text style={styles.saldoOptionActiveText}>250.000</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Atur Nomor Darurat</Text>
              <TextInput
                style={styles.formInput}
                value={nomorDarurat}
                onChangeText={setNomorDarurat}
                placeholder="08xxxxxxxxxx"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity 
              style={styles.fullWidthButton}
              onPress={handleSaldoSubmit}
            >
              <Text style={styles.fullWidthButtonText}>Lanjut</Text>
            </TouchableOpacity>

            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>Ketuk untuk lihat</Text>
              <Text style={styles.modalFooterLink}>Syarat & Ketentuan</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Nomor Darurat Modal */}
      <Modal
        visible={showDaruratModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDaruratModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsModalTitle}>Pengaturan</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Atur Nomor Darurat</Text>
              <TextInput
                style={styles.formInput}
                value={nomorDarurat}
                onChangeText={setNomorDarurat}
                placeholder="08xxxxxxxxxx"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowDaruratModal(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSubmitButton}
                onPress={handleDaruratSubmit}
              >
                <Text style={styles.modalSubmitText}>Simpan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>Ketuk untuk lihat</Text>
              <Text style={styles.modalFooterLink}>Syarat & Ketentuan</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // PIN Modal Styles
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
    borderColor: '#FDB44B',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  pinButton: {
    backgroundColor: '#FDB44B',
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

  // Settings Screen Styles
  settingsContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  menuList: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  saldoCard: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  saldoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  saldoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  saldoAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 5,
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    color: '#F44336',
  },

  // Settings Modal Styles
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
    borderColor: '#FDB44B',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FDB44B',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  saldoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#FDB44B',
  },
  saldoCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 5,
  },
  saldoInput: {
    flex: 1,
    padding: 15,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  saldoOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saldoOption: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saldoOptionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  saldoOptionActive: {
    backgroundColor: '#FDB44B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  saldoOptionActiveText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#FDB44B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  fullWidthButton: {
    backgroundColor: '#FDB44B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  fullWidthButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalFooterText: {
    fontSize: 11,
    color: '#666',
  },
  modalFooterLink: {
    fontSize: 11,
    color: '#4A90E2',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
});
