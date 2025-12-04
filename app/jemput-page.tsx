import JemputBottomSheet from '@/components/JemputBottomSheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from 'react-native-paper';

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

  const handleChatPress = () => {
    console.log('Chat pressed');
    // Implementasi untuk membuka chat
  };

  const handlePhonePress = () => {
    console.log('Phone pressed');
    // Implementasi untuk menelepon driver
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

      {/* Bottom Sheet yang bisa di-drag */}
      <JemputBottomSheet
        driverName="Nama Driver"
        driverPlate="B 1234 ABC"
        driverRating={4.9}
        estimatedTime="5 menit"
        pickupAddress={(params.pickup as string) || "Jl. Cempaka no. 5, Lantai 5, Bandung"}
        destinationAddress={(params.destination as string) || "Jl. Melati no. 7, Lantai 5 Bandung"}
        onChatPress={handleChatPress}
        onPhonePress={handlePhonePress}
      />
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
});
