import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

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
        <Text style={styles.centerLabel}>Pick a location</Text>
      </View>
      {/* FAB at bottom right */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleFabPress} activeOpacity={0.7}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    pointerEvents: 'box-none',
  },
  centerLabelContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -20 }],
    pointerEvents: 'none',
  },
  centerLabel: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'rgba(105, 105, 105,0.76)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
  fab: {
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  plus: {
    fontSize: 70,
    color: '#333',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'light',
    lineHeight: 44,
  }
});

export default SelectLocationOverlay;