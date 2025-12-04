import AntarBottomSheet from '@/components/AntarBottomSheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

// MapTiler API Key
const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';

// Initialize MapLibre
MapLibreGL.setAccessToken(null);

export default function AntarMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  // Koordinat Bandung ke Jakarta
  const lokasiTravel = [107.5794, -6.9389]; // Terminal Leuwipanjang
  const lokasiTujuan = [106.8302, -6.1754]; // Stasiun Gambir

  // Fetch route dari MapTiler
  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      const url = `https://api.maptiler.com/routing/car/${lokasiTravel[0]},${lokasiTravel[1]};${lokasiTujuan[0]},${lokasiTujuan[1]}.json?key=${MAPTILER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const coordinates = data.routes[0].geometry.coordinates;
        setRouteCoordinates(coordinates);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      setRouteCoordinates([lokasiTravel, lokasiTujuan]);
    }
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
      {/* MapLibre Map dengan MapTiler */}
      <MapLibreGL.MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
      >
        <MapLibreGL.Camera
          zoomLevel={8}
          centerCoordinate={[
            (lokasiTravel[0] + lokasiTujuan[0]) / 2,
            (lokasiTravel[1] + lokasiTujuan[1]) / 2,
          ]}
        />

        {/* Route Line (Biru) */}
        {routeCoordinates.length > 0 && (
          <MapLibreGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            }}
          >
            <MapLibreGL.LineLayer
              id="routeLine"
              style={{
                lineColor: '#2196F3',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </MapLibreGL.ShapeSource>
        )}

        {/* Marker Keberangkatan (Hijau) */}
        <MapLibreGL.PointAnnotation
          id="origin"
          coordinate={lokasiTravel}
        >
          <View style={[styles.marker, { backgroundColor: '#4CAF50' }]} />
        </MapLibreGL.PointAnnotation>

        {/* Marker Tujuan (Merah) */}
        <MapLibreGL.PointAnnotation
          id="destination"
          coordinate={lokasiTujuan}
        >
          <View style={[styles.marker, { backgroundColor: '#F44336' }]} />
        </MapLibreGL.PointAnnotation>
      </MapLibreGL.MapView>

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
    flex: 1,
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
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
});
