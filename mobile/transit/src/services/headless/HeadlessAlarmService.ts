// Sets up config for location aware (background) headless alarm service for Android
// ToDo: launch this service at startup if alarms exists in database, disable if not

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { getAlarmConfig, setAlarmConfig } from './storage/alarmConfigStorage';
import {AlarmConfig} from "./models/AsyncAlarmConfig";
import {LocationObject} from "expo-location";

export const LOCATION_TASK_NAME = 'LocationTask';

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
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Location task error:', error.message);
        return;
    }

    const locations = (data as { locations: LocationObject[] }).locations;

    if (!locations) return;

    const { latitude, longitude } = locations[0].coords;
    const config = await getAlarmConfig();

    // Creates a new config excluding executed alarms
    let newAlarmConfig: AlarmConfig = {
        alarms: []
    };

    for (const alarm of config.alarms) {
        const distance = getDistance(latitude, longitude, alarm.lat, alarm.lon);
        if (distance <= alarm.radius) {
            await notifee.displayNotification({
                title: alarm.displayName,
                body: alarm.address,
                android: {
                    channelId: 'alarm',
                    importance: AndroidImportance.HIGH,
                    sound: 'alarm',
                },
            });
        }
        else {
            newAlarmConfig.alarms.push(alarm);
        }
    }

    // Update alarm set excluding the triggered alarm
    await setAlarmConfig(newAlarmConfig);
});
