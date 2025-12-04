import JemputBottomSheet from '@/components/JemputBottomSheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

// MapTiler API Key
const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';

// Initialize MapLibre
MapLibreGL.setAccessToken(null);

export default function JemputMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  // Koordinat Bandung - Dago ke Pasteur  
  const lokasiAwal = [107.6191, -6.8700]; // [longitude, latitude]
  const lokasiTujuan = [107.5975, -6.9025];

  // Fetch route dari MapTiler Directions API
  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      const url = `https://api.maptiler.com/routing/car/${lokasiAwal[0]},${lokasiAwal[1]};${lokasiTujuan[0]},${lokasiTujuan[1]}.json?key=${MAPTILER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const coordinates = data.routes[0].geometry.coordinates;
        setRouteCoordinates(coordinates);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      setRouteCoordinates([lokasiAwal, lokasiTujuan]);
    }
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
      {/* MapLibre Map dengan MapTiler */}
      <MapLibreGL.MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
      >
        <MapLibreGL.Camera
          zoomLevel={14}
          centerCoordinate={lokasiAwal}
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
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </MapLibreGL.ShapeSource>
        )}

        {/* Marker Lokasi Awal (Hijau) */}
        <MapLibreGL.PointAnnotation
          id="pickup"
          coordinate={lokasiAwal}
        >
          <View style={[styles.marker, { backgroundColor: '#4CAF50' }]} />
        </MapLibreGL.PointAnnotation>

        {/* Marker Lokasi Tujuan (Merah) */}
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
