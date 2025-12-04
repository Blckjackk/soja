import AntarBottomSheet from '@/components/AntarBottomSheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function AntarMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showSeatModal, setShowSeatModal] = useState(false);

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
    [0, 1, 0, 0, 1], // Baris 1
    [0, 0, 1, 0, 0], // Baris 2
    [1, 0, 0, 1, 0], // Baris 3
  ];

  const handleSeatPress = (rowIndex: number, seatIndex: number) => {
    if (seats[rowIndex][seatIndex] === 1) return; // Kursi sudah terisi
    const seatNumber = rowIndex * 5 + seatIndex + 1;
    setSelectedSeat(seatNumber);
  };

  const getSeatColor = (rowIndex: number, seatIndex: number) => {
    const seatNumber = rowIndex * 5 + seatIndex + 1;
    if (seats[rowIndex][seatIndex] === 1) return '#999'; // Terisi
    if (selectedSeat === seatNumber) return '#FF6B4A'; // Dipilih
    return '#FDB44B'; // Tersedia
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
        selectedSeat={selectedSeat}
        onSeatPress={() => setShowSeatModal(true)}
        onConfirm={handleConfirm}
      />

      {/* Seat Selection Modal */}
      <Modal
        visible={showSeatModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSeatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Kursi</Text>
            
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#FDB44B' }]} />
                <Text style={styles.legendText}>Tersedia</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#999' }]} />
                <Text style={styles.legendText}>Terisi</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: '#FF6B4A' }]} />
                <Text style={styles.legendText}>Dipilih</Text>
              </View>
            </View>

            {/* Seat Layout */}
            <View style={styles.seatContainer}>
              {seats.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.seatRow}>
                  {row.map((seat, seatIndex) => {
                    const seatNumber = rowIndex * 5 + seatIndex + 1;
                    return (
                      <TouchableOpacity
                        key={seatIndex}
                        style={[
                          styles.seat,
                          { backgroundColor: getSeatColor(rowIndex, seatIndex) }
                        ]}
                        onPress={() => handleSeatPress(rowIndex, seatIndex)}
                        disabled={seat === 1}
                      >
                        <Text style={styles.seatNumber}>{seatNumber}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowSeatModal(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: width * 0.9,
    maxWidth: 450,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  seatContainer: {
    marginBottom: 20,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  seat: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  seatNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#FDB44B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
