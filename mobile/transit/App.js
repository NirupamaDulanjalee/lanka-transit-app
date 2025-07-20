import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , useColorScheme } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [loaded, error] = useFonts({
    'Inter': require('./src/assets/fonts/Inter.ttf'),

  });


  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

 const onLayoutRootView = async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  };

  
  const colorScheme = useColorScheme();


  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <MapScreen theme={colorScheme} />
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
