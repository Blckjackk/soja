import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Avatar, Card, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function JemputMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // State untuk region maps (koordinat Bandung - bisa diganti sesuai kebutuhan)
  const [region, setRegion] = useState({
    latitude: -6.9175,
    longitude: 107.6191,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });

  // Koordinat lokasi awal dan tujuan (bisa diganti)
  const lokasiAwal = {
    latitude: -6.9175,
    longitude: 107.6191,
  };

  const lokasiTujuan = {
    latitude: -6.9250,
    longitude: 107.6300,
  };

  return (
    <View style={styles.container}>
      {/* Google Maps Full Screen sebagai background */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {/* Marker Lokasi Awal (merah) */}
        <Marker
          coordinate={lokasiAwal}
          title="Lokasi Awal"
          description="Jl. Campaka No. 6, Lomba 5, Bandung"
          pinColor="#FF6B4A"
        />

        {/* Marker Lokasi Tujuan (hijau/cyan) */}
        <Marker
          coordinate={lokasiTujuan}
          title="Lokasi Tujuan"
          description="Jl. Kebon Kol. 7, Lomba 5, Bandung"
          pinColor="#4ECDC4"
        />
      </MapView>

      {/* Header dengan tombol kembali - Overlay di atas maps */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet yang bisa di-scroll */}
      <View style={styles.bottomSheet}>
        {/* Handle bar untuk indikator drag */}
        <View style={styles.handleBar} />
        
        {/* Status Card dengan warna kuning */}
        <Card style={styles.statusCard} mode="elevated">
          <Card.Content style={styles.statusContent}>
            <Text style={styles.statusLabel}>Driver dalam perjalanan</Text>
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Sampai dalam</Text>
              <Text style={styles.timeValue}>5 menit</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Lokasi Awal Card */}
        <Card style={styles.locationCard} mode="elevated">
          <Card.Content style={styles.locationContent}>
            <Avatar.Icon 
              size={40} 
              icon="home" 
              style={styles.homeIcon}
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Lokasi Awal</Text>
              <Text style={styles.locationAddress}>
                Jl. Campaka No. 6, Lomba 5, Bandung
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Lokasi Tujuan Card */}
        <Card style={styles.locationCard} mode="elevated">
          <Card.Content style={styles.locationContent}>
            <Avatar.Icon 
              size={40} 
              icon="map-marker" 
              style={styles.locationIcon}
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Lokasi Tujuan</Text>
              <Text style={styles.locationAddress}>
                Jl. Kebon Kol. 7, Lomba 5, Bandung
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Driver Info Card */}
        <Card style={styles.driverCard} mode="elevated">
          <Card.Content style={styles.driverContent}>
            <Avatar.Icon 
              size={48} 
              icon="account" 
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Nama Driver</Text>
              <Text style={styles.driverPlate}>B 1234 ABC</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Avatar.Icon 
                  size={40} 
                  icon="chat" 
                  style={styles.chatIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Avatar.Icon 
                  size={40} 
                  icon="phone" 
                  style={styles.phoneIcon}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a2332',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: height * 0.75,
    minHeight: height * 0.35,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  handleBar: {
    width: 60,
    height: 5,
    backgroundColor: '#ffffff40',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#FDB44B',
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 11,
    color: '#555',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  homeIcon: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  locationIcon: {
    backgroundColor: '#666',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  driverCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 4,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  driverAvatar: {
    backgroundColor: '#FDB44B',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  driverPlate: {
    fontSize: 12,
    color: '#666',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    // Wrapper for icon button
  },
  chatIcon: {
    backgroundColor: '#FDB44B',
  },
  phoneIcon: {
    backgroundColor: '#FDB44B',
  },
});
