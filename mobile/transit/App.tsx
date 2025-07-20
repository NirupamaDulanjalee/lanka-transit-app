import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, useColorScheme, Alert, BackHandler} from 'react-native';
import MapScreen from './src/screens/MapScreen';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import {AlarmDAO} from "./src/data/daos/AlarmDAO";
import notifee, { AndroidImportance } from '@notifee/react-native';
import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from './src/services/headless/HeadlessAlarmService';

// Method to initialize location task at app startup
async function initLocationTask() {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') return;

    const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!started) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 50,
            timeInterval: 60000,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Wakey Alarm Running",
                notificationBody: "Tracking your location in background",
                notificationColor: '#0000ff'
            }
        });
    }
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {

    const [appReady, setAppReady] = useState(false);

    const [loaded, error] = useFonts({
        'Inter': require('./src/assets/fonts/Inter.ttf'),

    });

    useEffect(() => {
        const prepareApp = async () => {
            try {
                // Initialize database
                await AlarmDAO.init();

                // Set notifee channel
                await notifee.createChannel({
                    id: 'alarm',
                    name: 'Alarm Notification',
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    vibration: true,
                });

                // Set alarm background task manager
                await initLocationTask();

                if (loaded || error) {
                    setAppReady(true);
                    await SplashScreen.hideAsync();
                }
            } catch (err) {
                console.error('Failed to initialize database:', err);
                Alert.alert('Initialization Error', 'Failed to initialize the database. ' +
                    'The app will now exit.', [
                    {text: 'OK', onPress: () => BackHandler.exitApp()},
                ]);
            }
        };

        prepareApp();
    }, [loaded, error]);

    const onLayoutRootView = async () => {
        if (appReady) {
            await SplashScreen.hideAsync();
        }
    };

    if (!appReady) {
        return null;
    }


    const colorScheme = useColorScheme();


    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar style="auto"/>
            <MapScreen theme={colorScheme}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
