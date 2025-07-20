import { AppRegistry } from 'react-native';
import App from './App';
import appConfig from './app.json'; // 👈 contains expo.name
import { checkLocationAndNotify } from './src/services/headless/HeadlessAlarmService';

const appName = appConfig.expo.name;

// Register app root
AppRegistry.registerComponent(appName, () => App);

// Register headless task
AppRegistry.registerHeadlessTask('LocationTask', () => checkLocationAndNotify);
