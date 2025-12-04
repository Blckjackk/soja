import MapLibreGL from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Surface, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// MapTiler API Key untuk map tiles
const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';
// OpenRouteService API untuk routing (gratis 2000 requests/hari)
const OPENROUTE_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBmNDc4MTYyYWVjYzQwNzdhZTEzZjIwMzJkY2ZmMWZmIiwiaCI6Im11cm11cjY0In0=';

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  // Koordinat Bandung - Cicadas ke Pasteur
  const lokasiAwal = [107.6191, -6.9175]; // Cicadas [longitude, latitude]
  const lokasiTujuan = [107.6095, -6.9147]; // Pasteur

  // Fetch route dari MapTiler Directions API
  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    try {
      // OpenRouteService API (gratis, no credit card needed)
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${lokasiAwal[0]},${lokasiAwal[1]}&end=${lokasiTujuan[0]},${lokasiTujuan[1]}`;
      
      console.log('🗺️ Fetching tracking route...');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button 
          mode="contained"
          onPress={() => router.back()}
          icon="arrow-left"
          buttonColor="white"
          textColor="#333"
          style={styles.backButton}
        >
          Kembali
        </Button>
      </View>

      {/* MapLibre Map */}
      <Surface style={styles.mapContainer} elevation={0}>
        <MapLibreGL.MapView
          style={styles.map}
          styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
        >
          <MapLibreGL.Camera
            zoomLevel={13}
            centerCoordinate={[
              (lokasiAwal[0] + lokasiTujuan[0]) / 2,
              (lokasiAwal[1] + lokasiTujuan[1]) / 2
            ]}
            animationDuration={1000}
          />

          {/* Route Line */}
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

          {/* Marker Lokasi Awal */}
          <MapLibreGL.PointAnnotation
            id="pickup"
            coordinate={lokasiAwal}
          >
            <View style={[styles.marker, { backgroundColor: '#4A90E2' }]} />
          </MapLibreGL.PointAnnotation>

          {/* Marker Lokasi Tujuan */}
          <MapLibreGL.PointAnnotation
            id="destination"
            coordinate={lokasiTujuan}
          >
            <View style={[styles.marker, { backgroundColor: '#4ECDC4' }]} />
          </MapLibreGL.PointAnnotation>
        </MapLibreGL.MapView>
      </Surface>

      {/* Bottom Info Panel */}
      <Surface style={styles.bottomPanel} elevation={4}>
        {/* Driver Status Bar */}
        <Card style={styles.statusCard} mode="elevated">
          <Card.Content style={styles.statusContent}>
            <View style={styles.statusLeft}>
              <Text variant="bodyMedium" style={styles.statusText}>
                Driver dalam perjalanan
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Text variant="bodySmall" style={styles.timeLabel}>Sampai dalam</Text>
              <Text variant="titleLarge" style={styles.timeValue}>5 menit</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Location Cards */}
        <View style={styles.locationsContainer}>
          {/* Lokasi Awal */}
          <Card style={styles.locationCard} mode="elevated">
            <Card.Content style={styles.locationContent}>
              <Avatar.Icon 
                size={40} 
                icon="map-marker" 
                style={styles.locationIconStart}
              />
              <View style={styles.locationInfo}>
                <Text variant="titleSmall" style={styles.locationTitle}>Lokasi Awal</Text>
                <Text variant="bodySmall" style={styles.locationAddress}>
                  {params.pickup || 'Jl. Campaka No. 6, Lomba 5, Bandung'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Lokasi Tujuan */}
          <Card style={styles.locationCard} mode="elevated">
            <Card.Content style={styles.locationContent}>
              <Avatar.Icon 
                size={40} 
                icon="flag" 
                style={styles.locationIconEnd}
              />
              <View style={styles.locationInfo}>
                <Text variant="titleSmall" style={styles.locationTitle}>Lokasi Tujuan</Text>
                <Text variant="bodySmall" style={styles.locationAddress}>
                  {params.destination || 'Jl. Malabar No. 7, Lomba 5, Bandung'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Driver Info */}
        <Card style={styles.driverCard} mode="elevated">
          <Card.Content style={styles.driverContent}>
            <Avatar.Icon 
              size={56} 
              icon="account" 
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfo}>
              <Text variant="titleMedium" style={styles.driverName}>Nama Driver</Text>
              <Text variant="bodySmall" style={styles.driverPlate}>B 1234 ABC</Text>
            </View>
            <View style={styles.driverActions}>
              <IconButton
                icon="chat"
                mode="contained"
                containerColor="#4A90E2"
                iconColor="white"
                size={24}
                onPress={() => {}}
              />
              <IconButton
                icon="phone"
                mode="contained"
                containerColor="#4A90E2"
                iconColor="white"
                size={24}
                onPress={() => {}}
              />
            </View>
          </Card.Content>
        </Card>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
    marginTop: 100,
    borderRadius: 30,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  pSubtext: {
    color: '#666',
    marginTop: 8,
  },
  centerPin: {
    position: 'absolute',
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: 'white',
  },
  bottomPanel: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    marginBottom: 16,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flex: 1,
  },
  statusText: {
    fontWeight: '600',
    color: '#333',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    color: '#666',
  },
  timeValue: {
    fontWeight: '700',
    color: '#333',
  },
  locationsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconStart: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  locationIconEnd: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    color: '#666',
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 16,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    backgroundColor: '#4A90E2',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  driverPlate: {
    color: '#666',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
