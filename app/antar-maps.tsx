import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Avatar, Card, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

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

  // Data kursi (0 = kosong, 1 = terisi, 2 = dipilih)
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

  return (
    <View style={styles.container}>
      {/* Header dengan tombol kembali */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>

      {/* Google Maps dengan rounded corners */}
      <View style={styles.mapWrapper}>
        <View style={styles.mapContainer}>
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
        </View>
      </View>

      {/* Bottom Panel dengan Info */}
      <ScrollView style={styles.bottomPanel}>
        {/* Info Transportasi Card */}
        <Card style={styles.transportCard} mode="elevated">
          <Card.Content style={styles.transportContent}>
            <View style={styles.transportInfo}>
              <Text style={styles.transportTitle}>Transporta</Text>
              <Text style={styles.transportSubtitle}>Rute Dago-Kiaracondong-Baleendah</Text>
            </View>
            <View style={styles.distanceInfo}>
              <Text style={styles.distanceLabel}>Jarak</Text>
              <Text style={styles.distanceValue}>10 km</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Pilih Kursi Section */}
        <View style={styles.seatSection}>
          <View style={styles.seatHeader}>
            <Text style={styles.seatTitle}>Pilih Kursi</Text>
            <Text style={styles.seatSubtitle}>(Pilih kursi)</Text>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#4ECDC4' }]} />
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

          {/* Kursi Layout */}
          <Card style={styles.seatCard} mode="elevated">
            <Card.Content style={styles.seatContent}>
              {seats.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.seatRow}>
                  {row.map((seat, seatIndex) => (
                    <TouchableOpacity
                      key={seatIndex}
                      style={[
                        styles.seat,
                        { backgroundColor: getSeatColor(rowIndex, seatIndex) }
                      ]}
                      onPress={() => handleSeatPress(rowIndex, seatIndex)}
                      disabled={seat === 1}
                    />
                  ))}
                  {/* Kolom kanan untuk navigasi */}
                  <View style={styles.rightColumn}>
                    <View style={[styles.navCircle, { backgroundColor: '#FDB44B' }]} />
                    <View style={[styles.navCircle, { backgroundColor: '#FDB44B' }]} />
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Selected Seat Info */}
        {selectedSeat && (
          <Card style={styles.selectedCard} mode="elevated">
            <Card.Content>
              <Text style={styles.selectedText}>
                Kursi terpilih: <Text style={styles.selectedNumber}>Nomor {selectedSeat}</Text>
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
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
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mapWrapper: {
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  mapContainer: {
    height: height * 0.40,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    elevation: 4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomPanel: {
    flex: 1,
    backgroundColor: '#1a2332',
    paddingHorizontal: 20,
  },
  transportCard: {
    backgroundColor: '#FDB44B',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
  },
  transportContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transportInfo: {
    flex: 1,
  },
  transportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  transportSubtitle: {
    fontSize: 11,
    color: '#555',
  },
  distanceInfo: {
    alignItems: 'flex-end',
  },
  distanceLabel: {
    fontSize: 11,
    color: '#555',
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seatSection: {
    marginBottom: 20,
  },
  seatHeader: {
    marginBottom: 12,
  },
  seatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  seatSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
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
    color: '#ffffff',
  },
  seatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 4,
  },
  seatContent: {
    paddingVertical: 16,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  seat: {
    width: 40,
    height: 35,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rightColumn: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 16,
  },
  navCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  selectedCard: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
  },
  selectedText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  selectedNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
});
