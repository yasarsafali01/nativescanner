const { withProjectBuildGradle, withGradleProperties } = require("@expo/config-plugins");

// react-native-google-mobile-ads pulls a recent play-services-ads release
// whose Kotlin metadata (2.3.x) is newer than the Kotlin compiler this Expo
// SDK/React Native version ships by default (2.1.x), which fails the release
// build with "Module was compiled with an incompatible version of Kotlin".
// Forcing the actual Kotlin Gradle Plugin (compiler) version up to 2.3.0
// across the whole project fixes the compile error.
const KOTLIN_VERSION = "2.3.0";

// The newer Kotlin 2.3 compiler needs more Metaspace than this project's
// default JVM args allow, otherwise lint/dex tasks crash with "Metaspace"
// out-of-memory errors during a release build.
const GRADLE_JVM_ARGS = "-Xmx4096m -XX:MaxMetaspaceSize=1536m";

function setProperty(config, key, value) {
  const existing = config.modResults.find((item) => item.type === "property" && item.key === key);
  if (existing) {
    existing.value = value;
  } else {
    config.modResults.push({ type: "property", key, value });
  }
}

module.exports = function withKotlinVersionBump(config) {
  config = withGradleProperties(config, (config) => {
    setProperty(config, "android.kotlinVersion", KOTLIN_VERSION);
    setProperty(config, "org.gradle.jvmargs", GRADLE_JVM_ARGS);
    return config;
  });

  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") return config;
    config.modResults.contents = config.modResults.contents.replace(
      "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')",
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${KOTLIN_VERSION}')`
    );
    return config;
  });
};
