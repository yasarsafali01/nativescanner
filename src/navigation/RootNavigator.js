import { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "../screens/HomeScreen";
import EditScreen from "../screens/EditScreen";
import MultiScanScreen from "../screens/MultiScanScreen";
import ResultScreen from "../screens/ResultScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OnboardingScreen, { ONBOARDING_STORAGE_KEY } from "../screens/OnboardingScreen";
import HeaderControls from "../components/HeaderControls";
import { useAppTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import { FONTS } from "../theme/fonts";

const Tab = createBottomTabNavigator();
const ScanStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function HomeHeaderLogo() {
  return (
    <Image
      source={require("../../assets/icon.png")}
      style={{ width: 34, height: 34, borderRadius: 9 }}
      resizeMode="cover"
    />
  );
}

function ScanStackScreen() {
  const { t } = useI18n();
  return (
    <ScanStack.Navigator
      screenOptions={{
        headerRight: () => <HeaderControls />,
        headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 18 },
      }}
    >
      <ScanStack.Screen name="ScanHome" component={HomeScreen} options={{ headerTitle: () => <HomeHeaderLogo /> }} />
      <ScanStack.Screen name="Edit" component={EditScreen} options={{ title: t("titles.edit") }} />
      <ScanStack.Screen name="MultiScan" component={MultiScanScreen} options={{ title: t("titles.multiscan") }} />
      <ScanStack.Screen name="Result" component={ResultScreen} options={{ title: t("titles.result") }} />
    </ScanStack.Navigator>
  );
}

function HistoryStackScreen() {
  const { t } = useI18n();
  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerRight: () => <HeaderControls />,
        headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 18 },
      }}
    >
      <HistoryStack.Screen name="HistoryHome" component={HistoryScreen} options={{ title: t("titles.history") }} />
      <HistoryStack.Screen name="Result" component={ResultScreen} options={{ title: t("titles.result") }} />
    </HistoryStack.Navigator>
  );
}

function SettingsStackScreen() {
  const { t } = useI18n();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerRight: () => <HeaderControls />,
        headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 18 },
      }}
    >
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: t("titles.settings") }} />
    </SettingsStack.Navigator>
  );
}

function TabIcon({ symbol }) {
  return <Text style={{ fontSize: 20 }}>{symbol}</Text>;
}

export default function RootNavigator() {
  const { colors, isDark } = useAppTheme();
  const { t } = useI18n();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).then((seen) => {
      setOnboardingDone(seen === "1");
    });
  }, []);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.accent,
      background: colors.background,
      card: colors.headerBg,
      text: colors.text,
      border: colors.border,
    },
  };

  if (onboardingDone === null) return null;

  if (!onboardingDone) {
    return <OnboardingScreen onDone={() => setOnboardingDone(true)} />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: { backgroundColor: colors.headerBg, borderTopColor: colors.border },
          tabBarLabelStyle: { fontFamily: FONTS.semiBold, fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Tara"
          component={ScanStackScreen}
          options={{ title: t("tabs.scan"), tabBarIcon: () => <TabIcon symbol="📷" /> }}
        />
        <Tab.Screen
          name="Taramalarım"
          component={HistoryStackScreen}
          options={{ title: t("tabs.history"), tabBarIcon: () => <TabIcon symbol="🗂️" /> }}
        />
        <Tab.Screen
          name="Ayarlar"
          component={SettingsStackScreen}
          options={{ title: t("tabs.settings"), tabBarIcon: () => <TabIcon symbol="⚙️" /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
