import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import styles from './SelectLocationOverlay.styles';
import { Plus } from 'lucide-react-native';

const SelectLocationOverlay = ({ showFab, setShowFab,onSearch, onAdd }) => {
    // const [showFab,setShowFab] = React.useState(false);

    const handlePickLocation = () => {
        setShowFab(true);
    };

    const handleCancel = () => {
        setShowFab(false);
        if (onSearch) {
            onSearch();
        }
    };
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
      {!showFab && (
        <View style={styles.centerLabelContainer} pointerEvents="box-none">
          <Text style={styles.centerLabel}>Pick a location</Text>
          <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
            <Text style={styles.centerLabel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* FAB at bottom right */}
      {showFab && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={handleFabPress} activeOpacity={0.7}>
            <Plus size={42} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


export default SelectLocationOverlay;