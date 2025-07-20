// Handles geocoding, reverse geocoding, place suggestion retrieval
// Uses Google Maps API for location services

import { GeoCodingResultsDTO } from "../../data/dtos/GeoCodingResultsDTO";
import { ReverseGeoCodingResultsDTO } from "../../data/dtos/ReverseGeoCodingResultsDTO";
import * as ExpoLocation from 'expo-location';
import { fetch } from 'expo/fetch';
import { Location } from "../../data/models/Location";


/**
 * @function getCoordinatesFromAddress
 * @param {string} address - The address to geocode.
 * 
 * @returns {Promise<Location>} - A promise that resolves to the coordinates of the address.
 */
export async function getCoordinatesFromAddress(address:string): Promise<Location> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as GeoCodingResultsDTO;
    if (data.status !== "OK"){ 
        throw new Error(`Geocoding failed: ${data.status}`);
    }
    return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
        address: data.results[0].formatted_address,
    };
}


/**
 * @function getAddressesFromCoordinates
 * @param {Location} location - An object containing the latitude and longitude of the location.
 * 
 * 
 * @returns {Promise<Location[]>} - A promise that resolves to the address of the coordinates.
 */
export async function getAddressesFromCoordinates(location: Location): Promise<Location[]> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as ReverseGeoCodingResultsDTO;
    if (data.status !== "OK") {
        throw new Error(`Reverse geocoding failed: ${data.status}`);
    }

    location.address = data.results[0].formatted_address;
    const locations: Location[] = data.results.map(result => ({
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        address: result.formatted_address,
    }));
    return locations;
}



/**
 * @function getUserCurrentLocation
 * @returns {Promise<Location>} - A promise that resolves to the user's current location.
 * Get User's Current Location from GPS - withount address component
 */

export async function getUserCurrentLocation(): Promise<Location> {
    try {
        // Request location permissions
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== ExpoLocation.PermissionStatus.GRANTED) {
            throw new Error('Location permission not granted');
        }
        const { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== ExpoLocation.PermissionStatus.GRANTED) {
            throw new Error('Background location permission not granted');
        }

        const location = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.High,
        });

        return {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            address: '', 
        };
    } catch (error) {
        throw new Error(`Error retrieving location: ${error.message}`);
    }
}