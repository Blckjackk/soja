import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal, Card, TextInput, Button, IconButton, Text } from 'react-native-paper';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pickup: string, destination: string) => void;
  title: string;
}

export default function LocationModal({ visible, onClose, onSubmit, title }: LocationModalProps) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = () => {
    if (pickup && destination) {
      onSubmit(pickup, destination);
      setPickup('');
      setDestination('');
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
              <TextInput
                label="Lokasi Penjemputan"
                value={pickup}
                onChangeText={setPickup}
                mode="outlined"
                left={<TextInput.Icon icon="map-marker" color="#4A90E2" />}
                style={styles.input}
                outlineColor="#e0e0e0"
                activeOutlineColor="#4A90E2"
              />
              
              <View style={styles.divider}>
                <View style={styles.dashedLine} />
              </View>

              <TextInput
                label="Lokasi Tujuan"
                value={destination}
                onChangeText={setDestination}
                mode="outlined"
                left={<TextInput.Icon icon="flag" color="#FF6B4A" />}
                style={styles.input}
                outlineColor="#e0e0e0"
                activeOutlineColor="#FF6B4A"
              />
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
                disabled={!pickup || !destination}
                style={styles.submitButton}
                buttonColor="#4A90E2"
              >
                Cari Driver
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
});
