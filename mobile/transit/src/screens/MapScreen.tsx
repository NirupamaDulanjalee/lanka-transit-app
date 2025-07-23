import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import AlarmMenuOverlay from "../components/overlays/AlarmMenuOverlay";
import SearchBarComponent from "../components/map/auxiliary/SearchBarComponent";
import SelectLocationOverlay from "../components/overlays/SelectLocationOverlay";
import AlarmControlOverlay from "../components/overlays/AlarmContolOverlay";
import { MapPin } from "lucide-react-native";
import { getAddressesFromCoordinates } from "../services/internal/LocationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
const MapScreen = ({ theme }) => {
  const [showFab, setShowFab] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [alarmData, setAlarmData] = useState([
    {
      id: '1',
      name: 'Location 1',
      address: 'Galwala Road, Pothanegama...',
    },
    {
      id: '2',
      name: 'Location 2',
      address: 'At Vessagiriya Road, 02 Can...',
    },
    {
      id: '3',
      name: 'Location 3',
      address: '596, 69 Bandaranaike Mawa...',
    },
    {
      id: '4',
      name: 'Location 4',
      address: '25/6, Colombo 04',
    },
  ]);
  // Track which overlay is active
  const [activeOverlay, setActiveOverlay] = useState<
    "none" | "alarmMenu" | "selectLocation" | "alarmControl"
  >("none");
  const [region, setRegion] = useState({
    latitude: 6.9271, // Colombo latitude
    longitude: 79.8612, // Colombo longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });


  const handlePress = () => {
    setActiveOverlay("alarmMenu");
  };

  const handleClose = () => {
    setActiveOverlay("none");
  };

  const handleAddAlarm = () => {
    setActiveOverlay("selectLocation");
  };
    // Save alarm handler
  const handleAlarmControlSave = (alarm) => {
    setAlarmData(prev => [
      ...prev,
      alarm

    ]);
    setActiveOverlay("alarmMenu");
  };

  // Update selectedLocation when region changes
  useEffect(() => {
    setSelectedLocation({
      longitude: region.longitude,
      latitude: region.latitude,
      
      
    });
  }, [region]);
  useEffect(() => {
    if (activeOverlay === "selectLocation") {
      setShowFab(false);
    }
  }, [activeOverlay]);

  return (
    <View style={styles.container}>
      {/* Change the temporary logic below, also check whether MapPin points the exact location by reverseGeocoding */}
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onPress={() => setShowFab(true)}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          if (
            Math.round(newRegion.latitude * 1000) / 1000 !==
              Math.round(region.latitude * 1000) / 1000 ||
            Math.round(newRegion.longitude * 1000) / 1000 !==
              Math.round(region.longitude * 1000) / 1000
          ) {
            console.log(
              "Region changed:",
              newRegion.latitude,
              newRegion.longitude
            );
          }
        }}
      />
      {/* Centered MapPin icon */}
      {activeOverlay !== "alarmMenu" && activeOverlay !== "alarmControl" && (
        <View style={styles.pinContainer} pointerEvents="none">
          <MapPin
            size={48}
            color={theme === "dark" ? "rgb(201, 6, 6)" : "rgb(201, 6, 6)"}
          />
        </View>
      )}

      {/* Show overlays based on state */}
      {activeOverlay === "selectLocation" && (
        <SelectLocationOverlay
          showFab={showFab}
          setShowFab={setShowFab}
          onSearch={handleClose}
          onAdd={async () => {
            if (selectedLocation) {
              try {
                const locations = await getAddressesFromCoordinates(
                  selectedLocation
                );
                console.log("Selected location:", locations);
                console.log("Locations found:", locations);
                if (locations.length > 0) {
                  setSelectedAddress(locations[0].address);
                }
              } catch (e) {
                setSelectedAddress("Address not found");
              }
            }
            setActiveOverlay("alarmControl");
          }}
        />
      )}
      {activeOverlay === "alarmControl" && (
        <AlarmControlOverlay
          onClose={() => setActiveOverlay("selectLocation")}
          onSave={handleAlarmControlSave}
          location={selectedAddress}
          onEditLocation={() => setActiveOverlay("selectLocation")} 
        />
      )}
      {activeOverlay !== "alarmControl" && (
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <SearchBarComponent onSearch={undefined} />
        </View>
      )}

      {activeOverlay !== "selectLocation" &&
        activeOverlay !== "alarmControl" && (
          <TouchableOpacity
            style={{ position: "absolute", bottom: 25, right: 10 }}
            onPress={handlePress}
          >
            <Image
              style={{
                width: 98,
                height: 98,
                resizeMode: "contain",
              }}
              source={
                theme === "dark"
                  ? require("../assets/images/location_dark.png")
                  : require("../assets/images/location_light.png")
              }
            />
          </TouchableOpacity>
        )}
      <AlarmMenuOverlay
        visible={activeOverlay === "alarmMenu"}
        onClose={handleClose}
        onAddAlarm={handleAddAlarm}
        alarmData={alarmData} // Pass alarm list
        setAlarmData={setAlarmData} // Pass setter for delete/edit
      />
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
    width: Dimensions.get("window").width,
    height: "100%",
  },
  pinContainer: {
    position: "absolute",
    top: Dimensions.get("window").height / 2 - 24, // half icon height
    left: Dimensions.get("window").width / 2 - 24, // half icon width
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
