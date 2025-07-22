// Search bar component for the map screen
// Sends suggestions to the user
// Suggestions are fetched with the services/internal/LocationService
import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const SearchBarComponent = ({ 
  onSearch, 
  placeholder = "Enter a location to search ",
}) => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearchText('');
    onSearch && onSearch('');
    inputRef.current?.blur();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch && onSearch(text);
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <View style={styles.container}>
          <Ionicons name="search" size={22} color="#6C6C80" style={styles.searchIcon} />
          
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#B0B0B0"
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={22} color="#B0B0B0" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  blurContainer: {
    borderRadius: 90,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 90,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#22223B',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  clearButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
});

export default SearchBarComponent;