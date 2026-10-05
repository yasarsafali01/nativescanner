import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

import { ThemeProvider, useAppTheme } from "./src/theme/ThemeContext";
import { I18nProvider } from "./src/i18n/I18nContext";
import { ToastProvider } from "./src/components/ToastContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { initAds } from "./src/ads/ads";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AppShell() {
  const { colors } = useAppTheme();
  return (
    <>
      <StatusBar style={colors.statusBarStyle === "light" ? "light" : "dark"} />
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    initAds();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <I18nProvider>
          <AppShell />
        </I18nProvider>
      </ThemeProvider>
    </View>
  );
}
