import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useMemo } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Avatar, Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

// Snap points untuk antar page - lebih tinggi karena ada seat selection
const SNAP_POINTS = {
  MAX: 550,
  MID: 480,
  MIN: 200,
};

interface AntarBottomSheetProps {
  vehiclePlate?: string;
  departureTime?: string;
  estimatedArrival?: string;
  travelOrigin?: string;
  destination?: string;
  selectedSeat?: number | null;
  onSeatPress?: () => void;
  onConfirm?: () => void;
}

export default function AntarBottomSheet({
  vehiclePlate = 'B 1234 XYZ',
  departureTime = '14:00',
  estimatedArrival = '16:30',
  travelOrigin = 'Terminal Leuwipanjang, Bandung',
  destination = 'Stasiun Gambir, Jakarta',
  selectedSeat = null,
  onSeatPress,
  onConfirm,
}: AntarBottomSheetProps) {
  const translateY = useMemo(() => new Animated.Value(height - SNAP_POINTS.MID), []);
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = gestureState.dy;
        const minY = height - SNAP_POINTS.MAX;
        const maxY = height - SNAP_POINTS.MIN;
        
        if (newValue >= minY && newValue <= maxY) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        lastGestureDy.current = gestureState.dy;

        const currentY = lastGestureDy.current;
        let snapTo = SNAP_POINTS.MID;

        if (gestureState.dy < 0) {
          if (currentY < -(SNAP_POINTS.MAX - SNAP_POINTS.MID) / 2) {
            snapTo = SNAP_POINTS.MAX;
          } else {
            snapTo = SNAP_POINTS.MID;
          }
        } else {
          if (currentY > (SNAP_POINTS.MID - SNAP_POINTS.MIN) / 2) {
            snapTo = SNAP_POINTS.MIN;
          } else {
            snapTo = SNAP_POINTS.MID;
          }
        }

        Animated.spring(translateY, {
          toValue: height - snapTo,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          transform: [{ translateY }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.handleBar} />

      {/* Travel Info Card */}
      <View style={styles.travelInfoCard}>
        <View style={styles.travelHeader}>
          <View>
            <Text style={styles.plateNumber}>{vehiclePlate}</Text>
            <Text style={styles.travelLabel}>Travel Keberangkatan</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeValue}>{departureTime}</Text>
            <Text style={styles.timeLabel}>Waktu Berangkat</Text>
          </View>
        </View>
      </View>

      {/* Route Card */}
      <View style={styles.routeCard}>
        <View style={styles.routeItem}>
          <View style={styles.iconContainer}>
            <Avatar.Icon size={40} icon="home-circle" style={styles.originIcon} />
          </View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeTitle}>Titik Keberangkatan</Text>
            <Text style={styles.routeAddress} numberOfLines={1}>
              {travelOrigin}
            </Text>
          </View>
        </View>
        
        <View style={styles.routeDivider} />
        
        <View style={styles.routeItem}>
          <View style={styles.iconContainer}>
            <Avatar.Icon size={40} icon="map-marker" style={styles.destIcon} />
          </View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeTitle}>Tujuan</Text>
            <Text style={styles.routeAddress} numberOfLines={1}>
              {destination}
            </Text>
          </View>
        </View>

        <View style={styles.estimatedArrival}>
          <Ionicons name="time-outline" size={18} color="#7A7A7A" />
          <Text style={styles.estimatedText}>
            Estimasi tiba: {estimatedArrival}
          </Text>
        </View>
      </View>

      {/* Seat Selection Card */}
      <View style={styles.seatCard}>
        <View style={styles.seatHeader}>
          <Text style={styles.seatTitle}>Kursi Dipilih</Text>
          {selectedSeat ? (
            <View style={styles.seatBadge}>
              <Text style={styles.seatNumber}>#{selectedSeat}</Text>
            </View>
          ) : (
            <Text style={styles.noSeatText}>Belum dipilih</Text>
          )}
        </View>
        <TouchableOpacity style={styles.seatButton} onPress={onSeatPress}>
          <Text style={styles.seatButtonText}>
            {selectedSeat ? 'Ubah Kursi' : 'Pilih Kursi'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.confirmButton, !selectedSeat && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={!selectedSeat}
      >
        <Text style={styles.confirmButtonText}>Konfirmasi Perjalanan</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1D29',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 30,
    height: SNAP_POINTS.MAX + 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  handleBar: {
    width: 60,
    height: 5,
    backgroundColor: '#ffffff40',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  travelInfoCard: {
    backgroundColor: '#FDB44B',
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  travelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  travelLabel: {
    fontSize: 13,
    color: '#5A5A5A',
    fontWeight: '400',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 12,
    color: '#5A5A5A',
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 4,
  },
  iconContainer: {
    marginRight: 14,
  },
  originIcon: {
    backgroundColor: '#9E9E9E',
  },
  destIcon: {
    backgroundColor: '#9E9E9E',
  },
  routeTextContainer: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 13,
    color: '#7A7A7A',
    lineHeight: 18,
  },
  estimatedArrival: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  estimatedText: {
    fontSize: 13,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  seatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D29',
  },
  seatBadge: {
    backgroundColor: '#FDB44B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  seatNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D29',
  },
  noSeatText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  seatButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  seatButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#FDB44B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
