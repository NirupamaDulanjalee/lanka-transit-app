// Used to create or edit an alarm
// Can set name, location and notifying distances
// Can set and edit alarms with services/internal/AlarmService
// Styled to match the app's theme
// Envelopped in OverlayParent.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Pencil,Trash2,ListX, Check, Plus, X  } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AlarmContolOverlay.styles';
// Main Alarm Component
const AlarmControlOverlay = ({onClose}) => {
  const [alarmName, setAlarmName] = useState('Location 1');
  const [location, setLocation] = useState('Galwala Road, Pothanegama...');
  const [distances, setDistances] = useState([
    { id: 1, value: '5', unit: 'km' },
    { id: 2, value: '678', unit: 'ft' }
  ]);

  const handleSave = async () => {
    const alarmData = {
    name: alarmName,
    location: location , 
    notifyingDistances: distances,
  };
  try {
    
    const existing = await AsyncStorage.getItem('alarmData');
    const alarms = existing ? JSON.parse(existing) : [];
    alarms.push(alarmData);
    await AsyncStorage.setItem('alarmData', JSON.stringify(alarms));
    console.log('Alarm saved successfully:', alarmData);


  } catch (e) {
    console.error(e);
  }
};
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    console.log('Close alarm settings');

  };

  const handleLocationEdit = () => {
    console.log('Edit location');
  };

  const handleDeleteDistance = (id) => {
    setDistances(distances.filter(distance => distance.id !== id));
  };

  const handleRemoveDistances = () =>{
    console.log('Remove all distances');
  };
  const handleAddDistance = () => {
    const newDistance = {
      id: Date.now(),
      value: '0',
      unit: 'km'
    };
    setDistances([...distances, newDistance]);
  };



  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Alarm</Text>
          <TouchableOpacity onPress={handleClose}>
            <X strokeWidth={2} size={36} />
          </TouchableOpacity>
        </View>

        {/* Name row */}
        <View style={styles.row}>
          <View style={styles.cellLabel}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.subLabel}>Display name of the alarm</Text>
          </View>
          <View style={styles.cellInput}>
            <TextInput
              value={alarmName}
              onChangeText={setAlarmName}
              placeholder="Display name of the alarm"
              style={styles.textInput}
            />
          </View>
        </View>
        <View style={styles.divider} />

        {/* Location row */}
        <View style={styles.row}>
          <View style={styles.cellLabel}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.subLabel}>Location for the alarm</Text>
          </View>
          <View style={styles.cellInputRow}>
            <Text style={styles.locationValue}>{location}</Text>
            <TouchableOpacity onPress={handleLocationEdit} style={styles.pencilButton}>
              <Pencil size={24} strokeWidth={3} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Distances section */}
        <View style={styles.distancesHeaderRow}>
          <View>
            <Text style={styles.distancesHeader}>Notifying distances</Text>
            <Text style={styles.distancesSubHeader}>
              Distances from the location to be notified at
            </Text>
          </View>
          <TouchableOpacity onPress={handleRemoveDistances}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

           <ListX size={36} strokeWidth={2} style={{ marginBottom: 10 , marginLeft: 20 }} />
          </View>
        </TouchableOpacity>
        </View>

        <View style={styles.distancesList}>
          <ScrollView
            style={styles.distancesScroll}
            contentContainerStyle={{ paddingBottom: 4 }}
            showsVerticalScrollIndicator={false}
          >
            {distances.map(distance => (
              <View key={distance.id} style={styles.distanceItem}>
                <View style={styles.distanceCol}>
                  <Text style={styles.distanceValue}>{distance.value}</Text>
                </View>
                <View style={styles.distanceCol}>
                  <Text style={styles.distanceUnit}>{distance.unit}</Text>
                </View>
                <View >
                  <TouchableOpacity onPress={() => handleDeleteDistance(distance.id)}>
                    <Trash2 />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addDistance} onPress={handleAddDistance}>
              <Plus size={36} strokeWidth={3} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Save button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSave} style={styles.checkButton}>
            <Check strokeWidth={3} size={36} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


export default AlarmControlOverlay;

