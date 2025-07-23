// Shows all options
// Can add, edit or delete alarms
// Styled to match the app's theme
// Works with services/internal/AlarmService
// Envelopped in OverlayParent.tsx

import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import styles from "./AlarmMenuOverlay.styles";
import { X, Trash2, Pencil, Plus } from "lucide-react-native";
type Props = {
  visible: any;
  onClose: any;
  onAddAlarm: () => void;
  alarmData: any[];
  setAlarmData: (data: any[]) => void;
};

const AlarmMenuOverlay = ({ visible, onClose, onAddAlarm, alarmData, setAlarmData }: Props) => {
  // component
  const [selectedId, setSelectedId] = useState(null);

  
  if (!visible) return null;

  const handleItemPress = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleAddAlarm = () => {};
  const handleDeleteAlarm = (id) => {
    setAlarmData(alarmData.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const handleEditAlarm = () => {
    console.log("Edit alarm");
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        onPress={() => {
          handleItemPress(item.id);
          onAddAlarm();
        }}
        style={[styles.alarmItem, isSelected && styles.selectedItem]}
        activeOpacity={0.9}
      >
        <TouchableOpacity
          onPress={() => {
            handleItemPress(item.id);
            onAddAlarm();
          }}
          style={styles.leftIcon}
        >
          <Pencil size={24} strokeWidth={3} color="#333" />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text
            style={[styles.locationName, isSelected && styles.selectedText]}
          >
            {item.name}
          </Text>
          <Text style={[styles.addressText, isSelected && styles.selectedText]}>
            {item.address}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleDeleteAlarm(item.id)}
          style={styles.deleteButton}
        >
          <Trash2 />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlayBackground}>
      <View style={styles.menuContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>All Alarms</Text>
          <TouchableOpacity onPress={onClose}>
            <X strokeWidth={2} size={36} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={alarmData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
        />

        <TouchableOpacity style={styles.addButton} onPress={onAddAlarm}>
          <Plus size={36} strokeWidth={3} style={{ marginBottom: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlarmMenuOverlay;
