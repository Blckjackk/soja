import AntarBottomSheet from '@/components/AntarBottomSheet';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

// MapTiler API Key untuk map tiles
const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';
// OpenRouteService API untuk routing (gratis 2000 requests/hari)
const OPENROUTE_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBmNDc4MTYyYWVjYzQwNzdhZTEzZjIwMzJkY2ZmMWZmIiwiaCI6Im11cm11cjY0In0=';

export default function AntarMapsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  // Ambil koordinat dari params kalau ada, kalau gak ada pakai default Bandung-Jakarta
  const pickupLng = params.pickupLng ? parseFloat(params.pickupLng as string) : 107.5794;
  const pickupLat = params.pickupLat ? parseFloat(params.pickupLat as string) : -6.9389;
  const destLng = params.destLng ? parseFloat(params.destLng as string) : 106.8451;
  const destLat = params.destLat ? parseFloat(params.destLat as string) : -6.1754;

  // Koordinat - Default: Bandung (Terminal Leuwipanjang) ke Jakarta (Gambir)
  const lokasiTravel = [pickupLng, pickupLat]; // [longitude, latitude]
  const lokasiTujuan = [destLng, destLat];

  // Fetch route dari MapTiler Directions API
  useEffect(() => {
    if (lokasiTravel[0] && lokasiTravel[1] && lokasiTujuan[0] && lokasiTujuan[1]) {
      fetchRoute();
    }
  }, [lokasiTravel[0], lokasiTravel[1], lokasiTujuan[0], lokasiTujuan[1]]);

  const fetchRoute = async () => {
    try {
      // OpenRouteService API (gratis, no credit card needed)
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${lokasiTravel[0]},${lokasiTravel[1]}&end=${lokasiTujuan[0]},${lokasiTujuan[1]}`;
      
      console.log('🗺️ Fetching Bandung-Jakarta route...');
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
        const distance = data.features[0].properties.summary.distance;
        const duration = data.features[0].properties.summary.duration;
        console.log(`📍 Route: ${coordinates.length} points, ${(distance/1000).toFixed(1)}km, ${(duration/60).toFixed(0)}min`);
        setRouteCoordinates(coordinates);
      } else {
        console.warn('⚠️ No route found, using straight line');
        setRouteCoordinates([lokasiTravel, lokasiTujuan]);
      }
    } catch (error) {
      console.error('❌ Error fetching route:', error);
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
          zoomLevel={9}
          centerCoordinate={[
            (lokasiTravel[0] + lokasiTujuan[0]) / 2,
            (lokasiTravel[1] + lokasiTujuan[1]) / 2,
          ]}
          animationDuration={1500}
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
        destination={params.destination as string || "Gambir, Jakarta Pusat"}
        distance="150 km"
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
