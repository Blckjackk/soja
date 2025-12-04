import JemputBottomSheet from '@/components/JemputBottomSheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

// MapTiler API Key untuk map tiles
const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';
// OpenRouteService API untuk routing (gratis 2000 requests/hari)
const OPENROUTE_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBmNDc4MTYyYWVjYzQwNzdhZTEzZjIwMzJkY2ZmMWZmIiwiaCI6Im11cm11cjY0In0=';

export default function JemputMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  // Ambil koordinat dari params kalau ada, kalau gak ada pakai default Bandung
  const pickupLng = params.pickupLng ? parseFloat(params.pickupLng as string) : 107.6098;
  const pickupLat = params.pickupLat ? parseFloat(params.pickupLat as string) : -6.8915;
  const destLng = params.destLng ? parseFloat(params.destLng as string) : 107.6095;
  const destLat = params.destLat ? parseFloat(params.destLat as string) : -6.9147;

  // Koordinat Bandung - Default: Dago (ITB) ke Pasteur (RS Hasan Sadikin)
  const lokasiAwal = [pickupLng, pickupLat]; // [longitude, latitude]
  const lokasiTujuan = [destLng, destLat];

  // Fetch route dari MapTiler Directions API
  useEffect(() => {
    if (lokasiAwal[0] && lokasiAwal[1] && lokasiTujuan[0] && lokasiTujuan[1]) {
      fetchRoute();
    }
  }, [lokasiAwal[0], lokasiAwal[1], lokasiTujuan[0], lokasiTujuan[1]]);

  const fetchRoute = async () => {
    try {
      // OpenRouteService API (gratis, no credit card needed)
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${lokasiAwal[0]},${lokasiAwal[1]}&end=${lokasiTujuan[0]},${lokasiTujuan[1]}`;
      
      console.log('🗺️ Fetching route from OpenRouteService...');
      const response = await fetch(url, {
        headers: {
          'Authorization': OPENROUTE_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Routing API Error:', response.status, data);
        throw new Error(`HTTP ${response.status}`);
      }
      
      console.log('✅ Route response:', data.features ? 'SUCCESS' : 'NO ROUTES');

      if (data.features && data.features[0] && data.features[0].geometry) {
        const coordinates = data.features[0].geometry.coordinates;
        console.log('📍 Route points:', coordinates.length);
        setRouteCoordinates(coordinates);
      } else {
        console.warn('⚠️ No route found, using straight line');
        setRouteCoordinates([lokasiAwal, lokasiTujuan]);
      }
    } catch (error) {
      console.error('❌ Error fetching route:', error);
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
        styleURL={`https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_API_KEY}`}
      >
        <MapLibreGL.Camera
          zoomLevel={13}
          centerCoordinate={[
            (lokasiAwal[0] + lokasiTujuan[0]) / 2,
            (lokasiAwal[1] + lokasiTujuan[1]) / 2
          ]}
          animationDuration={1000}
        />

        {/* Route Line (Biru) */}
        {routeCoordinates.length > 0 && (
          <MapLibreGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              properties: {},
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
        pickupAddress={(params.pickup as string) || "ITB Ganesha, Bandung"}
        destinationAddress={(params.destination as string) || "RS Hasan Sadikin, Pasteur, Bandung"}
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
