import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import AlarmMenuOverlay from '../components/overlays/AlarmMenuOverlay';

const MapScreen = ({ theme }) => {
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);

  const handlePress = () => {
    setShowAlarmMenu(true);
  };

  const handleClose = () => {
    setShowAlarmMenu(false);
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
      <AlarmMenuOverlay visible={showAlarmMenu} onClose={handleClose} />
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
