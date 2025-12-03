import LocationModal from '@/components/LocationModal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Linking, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, FAB, Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [showDaruratModal, setShowDaruratModal] = useState(false);
  const [showPengaturanModal, setShowPengaturanModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [saldoAmount, setSaldoAmount] = useState('250000');
  const [deviceCode, setDeviceCode] = useState('');
  const [nomorDarurat, setNomorDarurat] = useState('');

  // Data kontak darurat
  const kontakDarurat = [
    { id: 1, nama: 'Orang Tua', telepon: '08123456789' },
    { id: 2, nama: 'Rumah Sakit', telepon: '119' },
    { id: 3, nama: 'Polisi', telepon: '110' },
  ];

  const handleCallDarurat = (telepon: string) => {
    Linking.openURL(`tel:${telepon}`);
  };

  const handleMenuPress = (menu: string) => {
    if (menu === 'jemput' || menu === 'antar') {
      setModalTitle(menu === 'jemput' ? 'Jemput' : 'Antar');
      setModalVisible(true);
    } else if (menu === 'darurat') {
      setShowDaruratModal(true);
    } else if (menu === 'pengaturan') {
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      setShowPinModal(false);
      setShowPengaturanModal(true);
    }
  };

  const handleLocationSubmit = (pickup: string, destination: string) => {
    setModalVisible(false);
    // Navigate berdasarkan jenis layanan
    if (modalTitle === 'Jemput') {
      router.push({
        pathname: '/jemput-page',
        params: { pickup, destination }
      });
    } else if (modalTitle === 'Antar') {
      router.push({
        pathname: '/antar-page',
        params: { pickup, destination }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header dengan Logo */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/Logo Soja.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Info Card */}
      <Card style={styles.infoCard} mode="elevated">
        <Card.Content style={styles.infoContent}>
          <Avatar.Icon 
            size={48} 
            icon="account" 
            style={styles.avatar}
          />
          <View style={styles.infoTextContainer}>
            <Text variant="titleMedium" style={styles.infoTitle}>Nama Orang</Text>
            <Text variant="bodySmall" style={styles.infoSubtitle}>Lorem Ipsum</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Grid Menu 2x2 */}
      <View style={styles.menuGrid}>
        {/* Row 1 */}
        <View style={styles.menuRow}>
          <Card 
            style={styles.menuCard}
            mode="elevated"
            onPress={() => handleMenuPress('jemput')}
          >
            <Card.Content style={styles.menuContent}>
              <Image 
                source={require('@/assets/images/Jemput Icon.png')} 
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <Text variant="titleMedium" style={styles.menuLabel}>Jemput</Text>
            </Card.Content>
          </Card>

          <Card 
            style={styles.menuCard}
            mode="elevated"
            onPress={() => handleMenuPress('antar')}
          >
            <Card.Content style={styles.menuContent}>
              <Image 
                source={require('@/assets/images/Antar Icon.png')} 
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <Text variant="titleMedium" style={styles.menuLabel}>Antar</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Row 2 */}
        <View style={styles.menuRow}>
          <Card 
            style={[styles.menuCard, styles.menuCardDarurat]}
            mode="elevated"
            onPress={() => handleMenuPress('darurat')}
          >
            <Card.Content style={styles.menuContent}>
              <Image 
                source={require('@/assets/images/Darurat Icon.png')} 
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <Text variant="titleMedium" style={[styles.menuLabel, styles.menuLabelWhite]}>
                Darurat
              </Text>
            </Card.Content>
          </Card>

          <Card 
            style={styles.menuCard}
            mode="elevated"
            onPress={() => handleMenuPress('pengaturan')}
          >
            <Card.Content style={styles.menuContent}>
              <Image 
                source={require('@/assets/images/Settings Icon.png')} 
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <Text variant="titleMedium" style={styles.menuLabel}>Pengaturan</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Voice Chat Button */}
      <View style={styles.voiceChatContainer}>
        <Text variant="bodyMedium" style={styles.voiceChatText}>Klik untuk kirim</Text>
        <Text variant="bodySmall" style={styles.voiceChatSubtext}>Voice Chat</Text>
        <FAB
          icon="microphone"
          style={styles.voiceButton}
          color="white"
          onPress={() => {}}
        />
      </View>

      {/* Location Modal */}
      <LocationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleLocationSubmit}
        title={modalTitle}
      />

      {/* Modal Kontak Darurat */}
      <Modal
        visible={showDaruratModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDaruratModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Kontak Darurat</Text>
            
            <View style={styles.kontakContainer}>
              {kontakDarurat.map((kontak) => (
                <View key={kontak.id} style={styles.kontakItem}>
                  <View style={styles.kontakInfo}>
                    <Text style={styles.kontakNama}>{kontak.nama}</Text>
                    <Text style={styles.kontakTelepon}>No. Telepon</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCallDarurat(kontak.telepon)}
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
              onPress={() => setShowDaruratModal(false)}
            >
              Tutup
            </Button>

            <View style={styles.footerText}>
              <Text style={styles.footerLabel}>tekan untuk lebih</Text>
              <Text style={styles.footerLabel}>Voice Chat</Text>
            </View>

            <View style={styles.voiceButtonContainer}>
              <View style={styles.voiceCircle} />
              <View style={styles.voiceLine} />
            </View>
          </View>
        </View>
      </Modal>

      {/* PIN Modal */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPinModal(false)}
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
              <Text style={styles.pinButtonText}>Masuk</Text>
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

      {/* Pengaturan Modal */}
      <Modal
        visible={showPengaturanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPengaturanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsModalTitle}>Pengaturan</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hubungkan Perangkat</Text>
              <TextInput
                style={styles.formInput}
                value={deviceCode}
                onChangeText={setDeviceCode}
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
                  onChangeText={setSaldoAmount}
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
              style={styles.tutupButton2}
              onPress={() => {
                setShowPengaturanModal(false);
                setPin('');
              }}
            >
              <Text style={styles.tutupButtonText}>Tutup</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 60,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    marginBottom: 30,
    elevation: 4,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontWeight: '600',
    color: '#333',
  },
  infoSubtitle: {
    color: '#999',
    marginTop: 2,
  },
  menuGrid: {
    marginBottom: 40,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 4,
  },
  menuCardDarurat: {
    backgroundColor: '#FF6B4A',
  },
  menuContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  menuIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  menuLabel: {
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  menuLabelWhite: {
    color: '#ffffff',
  },
  voiceChatContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
  },
  voiceChatText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  voiceChatSubtext: {
    color: '#ffffff',
    marginBottom: 16,
  },
  voiceButton: {
    backgroundColor: '#FDB44B',
  },
  // Modal Darurat Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  kontakContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  kontakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#FDB44B',
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
  tutupButton2: {
    backgroundColor: '#FDB44B',
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
});
