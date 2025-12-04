import DaruratModal from '@/components/DaruratModal';
import LocationModal from '@/components/LocationModal';
import PengaturanModal from '@/components/PengaturanModal';
import PinModal from '@/components/PinModal';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Linking, StyleSheet, View } from 'react-native';
import { Avatar, Card, FAB, Text } from 'react-native-paper';

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

  const handleLocationSubmit = (pickupLat: number, pickupLng: number, destLat: number, destLng: number) => {
    setModalVisible(false);
    // Navigate berdasarkan jenis layanan dengan koordinat GPS
    if (modalTitle === 'Jemput') {
      router.push({
        pathname: '/jemput-page',
        params: { 
          pickupLat: pickupLat.toString(), 
          pickupLng: pickupLng.toString(), 
          destLat: destLat.toString(), 
          destLng: destLng.toString() 
        }
      });
    } else if (modalTitle === 'Antar') {
      router.push({
        pathname: '/antar-page',
        params: { 
          pickupLat: pickupLat.toString(), 
          pickupLng: pickupLng.toString(), 
          destLat: destLat.toString(), 
          destLng: destLng.toString() 
        }
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
          width={120}
          height={100}
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
      <DaruratModal
        visible={showDaruratModal}
        kontakList={kontakDarurat}
        onCall={handleCallDarurat}
        onClose={() => setShowDaruratModal(false)}
      />

      {/* PIN Modal */}
      <PinModal
        visible={showPinModal}
        pin={pin}
        onPinChange={setPin}
        onSubmit={handlePinSubmit}
        onClose={() => setShowPinModal(false)}
      />

      {/* Pengaturan Modal */}
      <PengaturanModal
        visible={showPengaturanModal}
        deviceCode={deviceCode}
        saldoAmount={saldoAmount}
        nomorDarurat={nomorDarurat}
        onDeviceCodeChange={setDeviceCode}
        onSaldoAmountChange={setSaldoAmount}
        onNomorDaruratChange={setNomorDarurat}
        onClose={() => {
          setShowPengaturanModal(false);
          setPin('');
        }}
      />
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
});
