const fs = require("fs");
const path = require("path");
const { withAppBuildGradle } = require("@expo/config-plugins");

// Wires the real upload keystore (kept outside android/, which is wiped on
// every prebuild) into the generated project so release builds are signed
// with it instead of the react-native template's debug key. If the keystore
// isn't present (e.g. a fresh checkout without the secret files), release
// builds silently keep using the debug key so prebuild never breaks.
module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    const propsPath = path.join(config.modRequest.projectRoot, "keystore", "keystore.properties");
    if (!fs.existsSync(propsPath)) return config;

    const props = Object.fromEntries(
      fs
        .readFileSync(propsPath, "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const idx = line.indexOf("=");
          return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
        })
    );

    const keystoreSrc = path.join(config.modRequest.projectRoot, "keystore", props.storeFile);
    const keystoreDest = path.join(config.modRequest.platformProjectRoot, "app", props.storeFile);
    fs.copyFileSync(keystoreSrc, keystoreDest);

    if (config.modResults.language !== "groovy") return config;

    config.modResults.contents = config.modResults.contents.replace(
      /signingConfigs\s*\{/,
      `signingConfigs {
        release {
            storeFile file('${props.storeFile}')
            storePassword '${props.storePassword}'
            keyAlias '${props.keyAlias}'
            keyPassword '${props.keyPassword}'
        }`
    );
    config.modResults.contents = config.modResults.contents.replace(
      /(release\s*\{[^}]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig signingConfigs.release"
    );

    return config;
  });
};
