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

// Snap points disesuaikan agar minimal lebih tinggi dan maksimal pas dengan konten
const SNAP_POINTS = {
  MAX: 480, // Fixed height untuk konten yang cukup
  MID: 420, // Default posisi
  MIN: 180, // Minimal masih terlihat driver info
};

interface JemputBottomSheetProps {
  driverName?: string;
  driverPlate?: string;
  driverRating?: number;
  estimatedTime?: string;
  pickupAddress?: string;
  destinationAddress?: string;
  onChatPress?: () => void;
  onPhonePress?: () => void;
}

export default function JemputBottomSheet({
  driverName = 'Nama Driver',
  driverPlate = 'B 1234 ABC',
  driverRating = 4.9,
  estimatedTime = '5 menit',
  pickupAddress = 'Jl. Cempaka no. 5, Lantai 5, Bandung',
  destinationAddress = 'Jl. Melati no. 7, Lantai 5 Bandung',
  onChatPress,
  onPhonePress,
}: JemputBottomSheetProps) {
  const translateY = useMemo(() => new Animated.Value(height - SNAP_POINTS.MID), []);
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Hanya aktif jika drag vertikal lebih dari horizontal
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = gestureState.dy;
        // Batasi agar tidak bisa drag ke atas lebih dari MAX atau ke bawah lebih dari MIN
        const minY = height - SNAP_POINTS.MAX;
        const maxY = height - SNAP_POINTS.MIN;
        
        if (newValue >= minY && newValue <= maxY) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        lastGestureDy.current = gestureState.dy;

        // Tentukan snap point terdekat
        const currentY = lastGestureDy.current;
        let snapTo = SNAP_POINTS.MID;

        if (gestureState.dy < 0) {
          // Drag ke atas
          if (currentY < -(SNAP_POINTS.MAX - SNAP_POINTS.MID) / 2) {
            snapTo = SNAP_POINTS.MAX;
          } else {
            snapTo = SNAP_POINTS.MID;
          }
        } else {
          // Drag ke bawah
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
      {/* Handle bar untuk drag */}
      <View style={styles.handleBar} />

      {/* Status Card dengan warna kuning */}
      <View style={styles.statusCard}>
        <View style={styles.statusContent}>
          <View>
            <Text style={styles.statusLabel}>Driver dalam perjalanan</Text>
            <Text style={styles.statusSubLabel}>Lorem ipsum dolor</Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Sampai dalam</Text>
            <Text style={styles.timeValue}>{estimatedTime}</Text>
          </View>
        </View>
      </View>

      {/* Lokasi Cards - Combined */}
      <View style={styles.locationCombinedCard}>
        {/* Lokasi Awal */}
        <View style={styles.locationContent}>
          <View style={styles.iconContainer}>
            <Avatar.Icon size={40} icon="home" style={styles.homeIcon} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>Lokasi Awal</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {pickupAddress}
            </Text>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.locationDivider} />
        
        {/* Lokasi Tujuan */}
        <View style={styles.locationContent}>
          <View style={styles.iconContainer}>
            <Avatar.Icon size={40} icon="map-marker" style={styles.locationIcon} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>Lokasi Tujuan</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon size={70} icon="account" style={styles.driverAvatar} />
            {driverRating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{driverRating}</Text>
              </View>
            )}
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driverName}</Text>
            <Text style={styles.driverPlate}>{driverPlate}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onChatPress}>
              <View style={styles.actionIconWrapper}>
                <Ionicons name="chatbubble" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onPhonePress}>
              <View style={styles.actionIconWrapper}>
                <Ionicons name="call" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
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
  statusCard: {
    backgroundColor: '#FDB44B',
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 2,
  },
  statusSubLabel: {
    fontSize: 13,
    color: '#5A5A5A',
    fontWeight: '400',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 13,
    color: '#5A5A5A',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1D29',
  },
  locationCombinedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 4,
  },
  iconContainer: {
    marginRight: 14,
  },
  homeIcon: {
    backgroundColor: '#9E9E9E',
  },
  locationIcon: {
    backgroundColor: '#9E9E9E',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 13,
    color: '#7A7A7A',
    lineHeight: 18,
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  driverAvatar: {
    backgroundColor: '#6B9DB8',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    transform: [{ translateX: -22 }],
    backgroundColor: '#FDB44B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    elevation: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1D29',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  driverPlate: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    // Wrapper for icon button
  },
  actionIconWrapper: {
    backgroundColor: '#FDB44B',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
