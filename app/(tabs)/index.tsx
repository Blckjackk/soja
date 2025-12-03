import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Surface, Text, Card, Avatar, FAB } from 'react-native-paper';
import LocationModal from '@/components/LocationModal';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const handleMenuPress = (menu: string) => {
    if (menu === 'jemput' || menu === 'antar') {
      setModalTitle(menu === 'jemput' ? 'Jemput' : 'Antar');
      setModalVisible(true);
    }
  };

  const handleLocationSubmit = (pickup: string, destination: string) => {
    setModalVisible(false);
    // Navigate ke halaman tracking dengan parameter
    router.push({
      pathname: '/tracking',
      params: { pickup, destination }
    });
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
