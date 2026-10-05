import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "freescanner_theme";

const lightColors = {
  background: "#f1f3f6",
  card: "#ffffff",
  cardAlt: "#fafafa",
  border: "#e5e7eb",
  borderStrong: "#d1d5db",
  text: "#111111",
  textMuted: "#6b7280",
  textFaint: "#9ca3af",
  accent: "#2563eb",
  accentSoft: "#eef2ff",
  accentDark: "#1d4ed8",
  success: "#16a34a",
  danger: "#dc2626",
  dangerSoft: "#fef2f2",
  headerBg: "#ffffff",
  statusBarStyle: "dark",
};

const darkColors = {
  background: "#0f1115",
  card: "#1a1d24",
  cardAlt: "#20242c",
  border: "#2a2e37",
  borderStrong: "#3a3f4b",
  text: "#f2f3f5",
  textMuted: "#9aa0ac",
  textFaint: "#6b7280",
  accent: "#3b82f6",
  accentSoft: "#1e2a47",
  accentDark: "#60a5fa",
  success: "#22c55e",
  danger: "#f87171",
  dangerSoft: "#3a1e1e",
  headerBg: "#161920",
  statusBarStyle: "light",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // themeMode is "light" | "dark" | "system". Default is "light" regardless
  // of the device's system theme; the user switches explicitly, and that
  // choice is persisted.
  const [themeMode, setThemeMode] = useState("light");
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const systemScheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "dark" || saved === "light" || saved === "system") setThemeMode(saved);
      setLoadedFromStorage(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMode(mode) {
    setThemeMode(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }

  function toggleTheme() {
    setMode(isDarkFor(themeMode, systemScheme) ? "light" : "dark");
  }

  const isDark = isDarkFor(themeMode, systemScheme);

  const value = useMemo(
    () => ({
      isDark,
      themeMode,
      setThemeMode: setMode,
      colors: isDark ? darkColors : lightColors,
      toggleTheme,
      loadedFromStorage,
    }),
    [isDark, themeMode, loadedFromStorage]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function isDarkFor(mode, systemScheme) {
  if (mode === "system") return systemScheme === "dark";
  return mode === "dark";
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
}
