import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import AlarmMenuOverlay from '../components/overlays/AlarmMenuOverlay';
import SearchBarComponent from '../components/map/auxiliary/SearchBarComponent';
import SelectLocationOverlay from '../components/overlays/SelectLocationOverlay';
import AlarmControlOverlay from '../components/overlays/AlarmContolOverlay';

const MapScreen = ({ theme }) => {
  // Track which overlay is active
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'alarmMenu' | 'selectLocation' | 'alarmControl'>('none');

  const handlePress = () => {
    setActiveOverlay('alarmMenu');
  };

  const handleClose = () => {
    setActiveOverlay('none');
  };

  const handleAddAlarm = () => {
    setActiveOverlay('selectLocation');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      {/* Show overlays based on state */}
      {activeOverlay === 'selectLocation' && (
        <SelectLocationOverlay
          onSearch={handleClose}
          onAdd={() => setActiveOverlay('alarmControl')}
        />
      )}
      {activeOverlay === 'alarmControl' && (
        <AlarmControlOverlay onClose={() => setActiveOverlay('selectLocation')} />
      )}
      {activeOverlay !== 'alarmControl'  && (
        <View style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1 }}>
          <SearchBarComponent onSearch={undefined} />
        </View>
      )}
      
      {activeOverlay !== 'selectLocation' && activeOverlay !== 'alarmControl' && (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 25, right: 10 }}
          onPress={handlePress}
        >
          <Image
            style={{
              width: 98,
              height: 98,
              resizeMode: 'contain',
            }}
            source={
              theme === 'dark'
                ? require('../assets/images/location_dark.png')
                : require('../assets/images/location_light.png')
            }
          />
        </TouchableOpacity>
      )}
      <AlarmMenuOverlay visible={activeOverlay === 'alarmMenu'} 
        onClose={handleClose}
        onAddAlarm={handleAddAlarm} />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});

