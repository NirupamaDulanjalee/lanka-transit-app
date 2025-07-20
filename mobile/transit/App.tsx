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
                // Request permissions
                const fg = await Location.requestForegroundPermissionsAsync();
                const bg = await Location.requestBackgroundPermissionsAsync();

                if (fg.status !== 'granted' || bg.status !== 'granted') {
                    Alert.alert('Initialization Error', 'Required location permissions not granted.', [
                        { text: 'Close', onPress: () => BackHandler.exitApp() },
                    ]);
                    return; // Don't proceed
                }

                // Initialize database
                await AlarmDAO.init();

                // Create Notifee channel
                await notifee.createChannel({
                    id: 'alarm',
                    name: 'Alarm Notification',
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    vibration: true,
                });

                // Initialize background task
                await initLocationTask();

                // If fonts/resources are loaded, launch app
                if (loaded && !error) {
                    setAppReady(true);
                    await SplashScreen.hideAsync();
                }
            } catch (err) {
                console.error('App initialization error:', err);
                Alert.alert('Initialization Error', 'A critical error occurred. The app will now exit.', [
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
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
