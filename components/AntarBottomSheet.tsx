import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

const { height } = Dimensions.get('window');

// Snap points untuk antar page - minimal hanya travel info, mid untuk detail, max untuk full
const SNAP_POINTS = {
  MAX: height * 0.7,
  MID: 400,
  MIN: 150,
};

interface AntarBottomSheetProps {
  vehiclePlate?: string;
  departureTime?: string;
  estimatedArrival?: string;
  travelOrigin?: string;
  destination?: string;
  distance?: string;
  selectedSeat?: number | null;
  seats?: number[][];
  onSeatSelect?: (seatNumber: number) => void;
  onConfirm?: () => void;
}

export default function AntarBottomSheet({
  vehiclePlate = 'B 1234 XYZ',
  departureTime = '14:00',
  estimatedArrival = '16:30',
  travelOrigin = 'Terminal Leuwipanjang, Bandung',
  destination = 'Stasiun Gambir, Jakarta',
  distance = '10 km',
  selectedSeat = null,
  seats = [
    [0, 0, 0, 0, 1], // Top row (5 seats)
    [0, 0, 0, 0, 0], // Bottom row (5 seats)
  ],
  onSeatSelect,
  onConfirm,
}: AntarBottomSheetProps) {
  const translateY = useMemo(() => new Animated.Value(height - SNAP_POINTS.MIN), []);
  const lastGestureDy = useRef(0);
  const currentSnapPoint = useRef(SNAP_POINTS.MIN);

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
        
        const velocity = gestureState.vy;
        const currentPosition = height - currentSnapPoint.current + gestureState.dy;
        
        let snapTo = SNAP_POINTS.MIN;

        if (velocity < -0.5) {
          if (currentSnapPoint.current === SNAP_POINTS.MIN) {
            snapTo = SNAP_POINTS.MID;
          } else {
            snapTo = SNAP_POINTS.MAX;
          }
        } else if (velocity > 0.5) {
          if (currentSnapPoint.current === SNAP_POINTS.MAX) {
            snapTo = SNAP_POINTS.MID;
          } else {
            snapTo = SNAP_POINTS.MIN;
          }
        } else {
          const distanceToMin = Math.abs(currentPosition - (height - SNAP_POINTS.MIN));
          const distanceToMid = Math.abs(currentPosition - (height - SNAP_POINTS.MID));
          const distanceToMax = Math.abs(currentPosition - (height - SNAP_POINTS.MAX));

          if (distanceToMin < distanceToMid && distanceToMin < distanceToMax) {
            snapTo = SNAP_POINTS.MIN;
          } else if (distanceToMid < distanceToMax) {
            snapTo = SNAP_POINTS.MID;
          } else {
            snapTo = SNAP_POINTS.MAX;
          }
        }

        currentSnapPoint.current = snapTo;

        Animated.spring(translateY, {
          toValue: height - snapTo,
          useNativeDriver: true,
          friction: 10,
          tension: 50,
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
          <View style={styles.travelTextInfo}>
            <Text style={styles.vehicleName}>Transjakarta</Text>
            <Text style={styles.routeDescription}>Rute Dago - Monumen Nasional</Text>
          </View>
          <View style={styles.distanceInfo}>
            <Text style={styles.distanceLabel}>Jarak</Text>
            <Text style={styles.distanceValue}>{distance}</Text>
          </View>
        </View>
      </View>

      {/* Seat Selection Card */}
      <View style={styles.seatCard}>
        <View style={styles.seatHeader}>
          <Text style={styles.seatTitle}>Kursi Anda</Text>
          <Text style={styles.seatSubtitle}>Lorem ipsum</Text>
        </View>

        {/* Seat Layout */}
        <View style={styles.seatLayoutContainer}>
          {/* Left Section: Top & Bottom Rows */}
          <View style={styles.leftSection}>
            {/* Top Row - 5 Horizontal Seats */}
            <View style={styles.topRow}>
              {seats[0].map((seat, seatIndex) => {
                const seatNumber = seatIndex + 1;
                const isOccupied = seat === 1;
                const isSelected = selectedSeat === seatNumber;
                
                return (
                  <TouchableOpacity
                    key={seatIndex}
                    style={[
                      styles.seatHorizontal,
                      isOccupied && styles.seatOccupied,
                      isSelected && styles.seatSelected,
                    ]}
                    onPress={() => !isOccupied && onSeatSelect?.(seatNumber)}
                    disabled={isOccupied}
                  >
                    <Text style={[styles.seatNumber, isSelected && styles.seatNumberSelected]}>
                      {seatNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Row - 5 Horizontal Seats */}
            <View style={styles.bottomRow}>
              {seats[1].map((seat, seatIndex) => {
                const seatNumber = seatIndex + 6;
                const isOccupied = seat === 1;
                const isSelected = selectedSeat === seatNumber;
                
                return (
                  <TouchableOpacity
                    key={seatIndex}
                    style={[
                      styles.seatHorizontal,
                      isOccupied && styles.seatOccupied,
                      isSelected && styles.seatSelected,
                    ]}
                    onPress={() => !isOccupied && onSeatSelect?.(seatNumber)}
                    disabled={isOccupied}
                  >
                    <Text style={[styles.seatNumber, isSelected && styles.seatNumberSelected]}>
                      {seatNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          
          {/* Right Section: 8 Vertical Seats (4 rows x 2 columns) */}
          <View style={styles.rightSection}>
            {[0, 1, 2, 3].map((rowIndex) => (
              <View key={rowIndex} style={styles.verticalRow}>
                {[0, 1].map((colIndex) => {
                  const seatNumber = 11 + (rowIndex * 2) + colIndex;
                  const isSelected = selectedSeat === seatNumber;
                  
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.seatVertical,
                        isSelected && styles.seatSelected,
                      ]}
                      onPress={() => onSeatSelect?.(seatNumber)}
                    >
                      <Text style={[styles.seatNumber, isSelected && styles.seatNumberSelected]}>
                        {seatNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>
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
    height: height,
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
    marginBottom: 12,
  },
  travelInfoCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  travelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  travelTextInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 12,
    color: '#5A5A5A',
    fontWeight: '400',
  },
  distanceInfo: {
    alignItems: 'flex-end',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#5A5A5A',
    marginBottom: 2,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D29',
  },
  seatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  seatHeader: {
    marginBottom: 16,
  },
  seatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 2,
  },
  seatSubtitle: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  seatLayoutContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    gap: 20,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 8,
  },
  seatHorizontal: {
    width: 42,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'column',
    gap: 6,
  },
  verticalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  seatVertical: {
    width: 24,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatOccupied: {
    backgroundColor: '#9CA3AF',
  },
  seatSelected: {
    backgroundColor: '#4A90E2',
  },
  seatNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  seatNumberSelected: {
    color: '#FFF',
  },
});
