import AntarBottomSheet from '@/components/AntarBottomSheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function AntarMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // State untuk region maps (koordinat Bandung - bisa diganti sesuai kebutuhan)
  const [region, setRegion] = useState({
    latitude: -6.9175,
    longitude: 107.6191,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  });

  // Koordinat lokasi travel saat ini (dari mana naik) dan tujuan
  const lokasiTravel = {
    latitude: -6.9175,
    longitude: 107.6191,
  };

  const lokasiTujuan = {
    latitude: -6.9250,
    longitude: 107.6300,
  };

  // Data kursi (0 = kosong, 1 = terisi)
  const seats = [
    [0, 0, 0, 0, 1], // Top row
    [0, 0, 0, 0, 0], // Bottom row
  ];

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      console.log('Confirmed seat:', selectedSeat);
      // Implementasi konfirmasi booking
    }
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
        {/* Marker Lokasi Travel (biru) */}
        <Marker
          coordinate={lokasiTravel}
          title="Lokasi Travel"
          description="Posisi travel saat ini"
          pinColor="#4A90E2"
        />

        {/* Marker Lokasi Tujuan (hijau) */}
        <Marker
          coordinate={lokasiTujuan}
          title="Tujuan"
          description={params.destination as string || "Tujuan perjalanan"}
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
      <AntarBottomSheet
        vehiclePlate="B 1234 XYZ"
        departureTime="14:00"
        estimatedArrival="16:30"
        travelOrigin={params.pickup as string || "Terminal Leuwipanjang, Bandung"}
        destination={params.destination as string || "Stasiun Gambir, Jakarta"}
        distance="10 km"
        selectedSeat={selectedSeat}
        seats={seats}
        onSeatSelect={handleSeatSelect}
        onConfirm={handleConfirm}
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
