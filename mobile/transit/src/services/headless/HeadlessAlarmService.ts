// Sets up config for location aware (background) headless alarm service for Android
// ToDo: launch this service at startup if alarms exists in database, disable if not

import * as Location from 'expo-location';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Audio } from 'expo-av';
import { getAlarmConfig } from './storage/alarmConfigStorage';

// Calculate distance using Haversine formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Check locations and notify for all configured locations
export const checkLocationAndNotify = async () => {
    const config = await getAlarmConfig();
    if (config.alarms.length < 1) return;

    const { coords } = await Location.getCurrentPositionAsync({});

    for (const alarm of config.alarms) {
        const distance = getDistance(coords.latitude, coords.longitude, alarm.lat, alarm.lon);

        if (distance <= alarm.radius) {
            await notifee.displayNotification({
                title: alarm.displayName,
                body: alarm.address,
                android: {
                    channelId: 'alarm', // ToDo: set up @notifee channel at App.tsx
                    sound: 'default',
                    importance: AndroidImportance.HIGH
                },
            });

            const sound = new Audio.Sound();
            await sound.loadAsync(require('../../assets/alarm.mp3'));
            await sound.playAsync();
        }
    }
};

