import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, useColorScheme, Alert, BackHandler} from 'react-native';
import MapScreen from './src/screens/MapScreen';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import {AlarmDAO} from "./src/data/daos/AlarmDAO";
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';

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
                    name: 'Alarm Channel',
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    vibration: true,
                });

                // Configure BackgroundFetch
                BackgroundFetch.configure(
                    {
                        minimumFetchInterval: 15, // <-- minutes
                        stopOnTerminate: false,
                        startOnBoot: true,
                        enableHeadless: true,
                    },
                    async (taskId) => {
                        const task = require('./src/background/LocationTask');
                        await task.checkLocationAndNotify();
                        BackgroundFetch.finish(taskId);
                    },
                    (err) => {
                        console.error('[BackgroundFetch] Failed to start:', err);
                        Alert.alert('Initialization Error', 'Failed to start background alarm ' +
                            'service.', [
                            {text: 'OK', onPress: () => BackHandler.exitApp()},
                        ]);
                    }
                );

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
