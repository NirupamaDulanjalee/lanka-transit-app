import { AppRegistry } from 'react-native';
import App from './App';
import appConfig from './app.json';

const appName = appConfig.expo.name;

// Register app root
AppRegistry.registerComponent(appName, () => App);
