const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure the input path points to wherever you created your global.css file
module.exports = withNativeWind(config, { input: "./src/global.css" });