import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import styles from './SelectLocationOverlay.styles';
import { Plus } from 'lucide-react-native';

const SelectLocationOverlay = ({ onSearch, onAdd }) => {
  const handleFabPress = () => {
    if (onAdd) {
      onAdd();
    } else {
      Alert.alert('button pressed');
    }
  };

  return (
    <View style={styles.overlayContainer}>
      
      {/* Centered label */}
      <View style={styles.centerLabelContainer}>
        <TouchableOpacity><Text style={styles.centerLabel}>Pick a location</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.centerLabel}>Cancel</Text></TouchableOpacity>
      </View>
      {/* FAB at bottom right */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleFabPress} activeOpacity={0.7}>
          <Plus size={42} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default SelectLocationOverlay;