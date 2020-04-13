import { AppRegistry } from "react-native";
import App from "./src";
import { name as appName } from "./app.json";
import "./pollyfills";

AppRegistry.registerComponent(appName, () => App);
