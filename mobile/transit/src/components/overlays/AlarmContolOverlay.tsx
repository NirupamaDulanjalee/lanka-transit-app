// Used to create or edit an alarm
// Can set name, location and notifying distances
// Can set and edit alarms with services/internal/AlarmService
// Styled to match the app's theme
// Envelopped in OverlayParent.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Pencil,Trash2,ListX, Check, Plus, X  } from 'lucide-react-native';
  
// Main Alarm Component
const AlarmControlOverlay = () => {
  const [alarmName, setAlarmName] = useState('Location 1');
  const [distances, setDistances] = useState([
    { id: 1, value: '5', unit: 'km' },
    { id: 2, value: '678', unit: 'ft' }
  ]);

  const handleClose = () => {
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

  const handleSave = () => {
    console.log('Save alarm settings');
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
            <Text style={styles.locationValue}>Alankulama, Anuradhapura</Text>
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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#333',
  },
  icon: {
    fontSize: 24,
    color: '#333',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingVertical: 8,
  },
  cellLabel: {
    flex: 1.2,
    paddingRight: 8,
  },
  cellInput: {
    flex: 2,
    justifyContent: 'center',
  },
  cellInputRow: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
  subLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#888',
    fontSize: 18,
    paddingVertical: 2,
    color: '#222',
  },
  locationValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  pencilButton: {
    marginLeft: -24, 
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  distancesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
    marginTop: 8,
  },
  distancesHeader: {
    fontSize: 18,
    fontWeight: '400',
    color: '#222',
  },
  distancesSubHeader: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  distancesList: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 0,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    // limit height to 3 items (each ~52px + padding)
    maxHeight: 3 * 52 + 24, // 3 items + add button + padding
  },
  distancesScroll: {
    maxHeight: 3 * 52 + 24,
  },
  distanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bbdefb',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  distanceCol: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  distanceValue: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  distanceUnit: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  addDistance: {
    backgroundColor: '#bbdefb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
   
    marginBottom: 4,
  },
  addIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  checkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  checkIcon: {
    fontSize: 38,
    color: '#333',
    fontWeight: '300',
  },
});

export default AlarmControlOverlay;

