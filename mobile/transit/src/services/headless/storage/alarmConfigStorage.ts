import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlarmConfig } from "../models/AsyncAlarmConfig";

const CONFIG_KEY = 'location_alarm_config';

export const setAlarmConfig = async (config: AlarmConfig) => {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const getAlarmConfig = async (): Promise<AlarmConfig | null> => {
    const json = await AsyncStorage.getItem(CONFIG_KEY);
    return json ? JSON.parse(json) : null;
};

export const clearAlarmConfig = async () => {
    await AsyncStorage.removeItem(CONFIG_KEY);
};
