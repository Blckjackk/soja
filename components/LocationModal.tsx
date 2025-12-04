import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pickupLat: number, pickupLng: number, destLat: number, destLng: number) => void;
  title: string;
}

interface Suggestion {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

const MAPTILER_API_KEY = 'SaFxGRdQzxbsujzwd61b';

export default function LocationModal({ visible, onClose, onSubmit, title }: LocationModalProps) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Store selected coordinates
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState<Suggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Suggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [searchingPickup, setSearchingPickup] = useState(false);
  const [searchingDest, setSearchingDest] = useState(false);

  // Debounce timer
  const [pickupTimer, setPickupTimer] = useState<NodeJS.Timeout | null>(null);
  const [destTimer, setDestTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch suggestions from MapTiler Geocoding API
  const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
    if (query.length < 3) return [];
    
    try {
      // Bias results to Indonesia
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}&country=id&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center
        }));
      }
      return [];
    } catch (err) {
      console.error('Autocomplete error:', err);
      return [];
    }
  };

  // Handle pickup input change with debounce
  const handlePickupChange = (text: string) => {
    setPickup(text);
    setShowPickupSuggestions(true);

    // Clear previous timer
    if (pickupTimer) clearTimeout(pickupTimer);

    if (text.length >= 3) {
      setSearchingPickup(true);
      const timer = setTimeout(async () => {
        const suggestions = await fetchSuggestions(text);
        setPickupSuggestions(suggestions);
        setSearchingPickup(false);
      }, 500); // 500ms debounce
      setPickupTimer(timer);
    } else {
      setPickupSuggestions([]);
      setSearchingPickup(false);
    }
  };

  // Handle destination input change with debounce
  const handleDestinationChange = (text: string) => {
    setDestination(text);
    setShowDestSuggestions(true);

    // Clear previous timer
    if (destTimer) clearTimeout(destTimer);

    if (text.length >= 3) {
      setSearchingDest(true);
      const timer = setTimeout(async () => {
        const suggestions = await fetchSuggestions(text);
        setDestSuggestions(suggestions);
        setSearchingDest(false);
      }, 500); // 500ms debounce
      setDestTimer(timer);
    } else {
      setDestSuggestions([]);
      setSearchingDest(false);
    }
  };

  // Select pickup suggestion
  const selectPickupSuggestion = (suggestion: Suggestion) => {
    setPickup(suggestion.place_name);
    // Store coordinates from suggestion (center is [lng, lat])
    setPickupCoords({
      lng: suggestion.center[0],
      lat: suggestion.center[1]
    });
    setShowPickupSuggestions(false);
    setPickupSuggestions([]);
  };

  // Select destination suggestion
  const selectDestSuggestion = (suggestion: Suggestion) => {
    setDestination(suggestion.place_name);
    // Store coordinates from suggestion (center is [lng, lat])
    setDestCoords({
      lng: suggestion.center[0],
      lat: suggestion.center[1]
    });
    setShowDestSuggestions(false);
    setDestSuggestions([]);
  };

  // Geocoding function using Nominatim (OpenStreetMap)
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SojaApp/1.0' // Nominatim requires User-Agent
        }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (pickup && destination) {
      setLoading(true);
      setError('');

      try {
        let finalPickupCoords = pickupCoords;
        let finalDestCoords = destCoords;

        // If coordinates not set from suggestion, fallback to geocoding
        if (!finalPickupCoords) {
          console.log('📍 Geocoding pickup:', pickup);
          finalPickupCoords = await geocodeAddress(pickup);
        }

        if (!finalDestCoords) {
          console.log('📍 Geocoding destination:', destination);
          finalDestCoords = await geocodeAddress(destination);
        }

        if (!finalPickupCoords) {
          setError('Lokasi penjemputan tidak ditemukan. Pilih dari saran yang muncul.');
          setLoading(false);
          return;
        }

        if (!finalDestCoords) {
          setError('Lokasi tujuan tidak ditemukan. Pilih dari saran yang muncul.');
          setLoading(false);
          return;
        }

        console.log('✅ Using coordinates:', {
          pickup: finalPickupCoords,
          dest: finalDestCoords
        });

        // Pass coordinates to parent
        onSubmit(finalPickupCoords.lat, finalPickupCoords.lng, finalDestCoords.lat, finalDestCoords.lng);
        
        // Reset form
        setPickup('');
        setDestination('');
        setError('');
        setPickupCoords(null);
        setDestCoords(null);
        setPickupSuggestions([]);
        setDestSuggestions([]);
      } catch (err) {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Card style={styles.card}>
            <Card.Title
              title={`${title} - Pilih Lokasi`}
              titleStyle={styles.cardTitle}
              right={(props) => (
                <IconButton {...props} icon="close" onPress={onClose} />
              )}
            />
            <Card.Content>
              <View>
                <TextInput
                  label="Lokasi Penjemputan"
                  value={pickup}
                  onChangeText={handlePickupChange}
                  mode="outlined"
                  left={<TextInput.Icon icon="map-marker" color="#4A90E2" />}
                  right={searchingPickup ? <TextInput.Icon icon={() => <ActivityIndicator size={20} />} /> : null}
                  style={styles.input}
                  outlineColor="#e0e0e0"
                  activeOutlineColor="#4A90E2"
                  placeholder="Cth: Terminal Leuwipanjang"
                  disabled={loading}
                  onFocus={() => setShowPickupSuggestions(true)}
                />
                
                {/* Pickup Suggestions */}
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <Card style={styles.suggestionsCard}>
                    <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled>
                      {pickupSuggestions.map((suggestion, index) => (
                        <View key={index}>
                          <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => selectPickupSuggestion(suggestion)}
                          >
                            <IconButton icon="map-marker-outline" size={20} />
                            <Text style={styles.suggestionText} numberOfLines={2}>
                              {suggestion.place_name}
                            </Text>
                          </TouchableOpacity>
                          {index < pickupSuggestions.length - 1 && <Divider />}
                        </View>
                      ))}
                    </ScrollView>
                  </Card>
                )}
              </View>
              
              <View style={styles.divider}>
                <View style={styles.dashedLine} />
              </View>

              <View>
                <TextInput
                  label="Lokasi Tujuan"
                  value={destination}
                  onChangeText={handleDestinationChange}
                  mode="outlined"
                  left={<TextInput.Icon icon="flag" color="#FF6B4A" />}
                  right={searchingDest ? <TextInput.Icon icon={() => <ActivityIndicator size={20} />} /> : null}
                  style={styles.input}
                  outlineColor="#e0e0e0"
                  activeOutlineColor="#FF6B4A"
                  placeholder="Cth: Stasiun Gambir"
                  disabled={loading}
                  onFocus={() => setShowDestSuggestions(true)}
                />

                {/* Destination Suggestions */}
                {showDestSuggestions && destSuggestions.length > 0 && (
                  <Card style={styles.suggestionsCard}>
                    <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled>
                      {destSuggestions.map((suggestion, index) => (
                        <View key={index}>
                          <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => selectDestSuggestion(suggestion)}
                          >
                            <IconButton icon="map-marker-outline" size={20} />
                            <Text style={styles.suggestionText} numberOfLines={2}>
                              {suggestion.place_name}
                            </Text>
                          </TouchableOpacity>
                          {index < destSuggestions.length - 1 && <Divider />}
                        </View>
                      ))}
                    </ScrollView>
                  </Card>
                )}
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.loadingText}>Mencari lokasi...</Text>
                </View>
              ) : null}
            </Card.Content>

            <Card.Actions style={styles.actions}>
              <Button 
                mode="outlined" 
                onPress={onClose}
                style={styles.cancelButton}
              >
                Batal
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!pickup || !destination || loading}
                style={styles.submitButton}
                buttonColor="#4A90E2"
              >
                {loading ? 'Mencari...' : 'Cari Driver'}
              </Button>
            </Card.Actions>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
  },
  divider: {
    paddingVertical: 8,
    paddingLeft: 48,
  },
  dashedLine: {
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    borderStyle: 'dashed',
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
  },
  errorText: {
    color: '#FF6B4A',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#4A90E2',
    fontSize: 14,
  },
  suggestionsCard: {
    marginTop: 4,
    marginBottom: 8,
    maxHeight: 200,
    elevation: 4,
    backgroundColor: 'white',
  },
  suggestionsScroll: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
