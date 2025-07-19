    // Loading screen until the database, backend and map connections are made
    import React, { useEffect } from 'react';
    import { View, Text, ActivityIndicator, Alert, BackHandler } from 'react-native';
    import { useNavigation } from '@react-navigation/native';
    import { AlarmDAO } from '../data/daos/AlarmDAO';

    export default function LoadingScreen() {
        const navigation = useNavigation();

        useEffect(() => {
            // Try to initialize app
            const init = async () => {
                try {
                    // Initialize databases
                    await AlarmDAO.init();

                    // Route to MapScreen
                    // ToDo: Add routing to map screen
                } catch (e) {
                    Alert.alert("Database Error", "Failed to initialize database. Exiting app.");
                    setTimeout(() => BackHandler.exitApp(), 2000);
                }
            };
            init();
        }, []);

        return (
            //ToDo: Update loading screen content
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Initializing App...</Text>
            </View>
        );
    }
