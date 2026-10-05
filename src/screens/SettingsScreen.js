import { useMemo } from "react";
import { Linking, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as StoreReview from "expo-store-review";
import Constants from "expo-constants";

import { useI18n } from "../i18n/I18nContext";
import { useAppTheme } from "../theme/ThemeContext";
import LanguagePills from "../components/LanguagePills";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.eysinteractivetech.scanner";

export default function SettingsScreen() {
  const { t } = useI18n();
  const { colors, themeMode, setThemeMode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const THEME_OPTIONS = [
    { value: "light", label: t("theme.light") },
    { value: "dark", label: t("theme.dark") },
    { value: "system", label: t("theme.system") },
  ];

  async function rateApp() {
    const available = await StoreReview.isAvailableAsync();
    if (available) {
      await StoreReview.requestReview();
    } else {
      Linking.openURL(PLAY_STORE_URL);
    }
  }

  function shareApp() {
    Share.share({ message: t("settings.shareMessage") });
  }

  return (
    <View style={styles.page}>
      <Text style={styles.sectionTitle}>{t("theme.label")}</Text>
      <View style={styles.optionRow}>
        {THEME_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, themeMode === opt.value && styles.optionActive]}
            onPress={() => setThemeMode(opt.value)}
          >
            <Text style={themeMode === opt.value ? styles.optionTextActive : styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t("language.label")}</Text>
      <View style={styles.languageBox}>
        <LanguagePills />
      </View>

      <TouchableOpacity style={styles.row} onPress={rateApp}>
        <Text style={styles.rowIcon}>⭐</Text>
        <View style={styles.rowTextBox}>
          <Text style={styles.rowTitle}>{t("settings.rateApp")}</Text>
          <Text style={styles.rowHint}>{t("settings.rateAppHint")}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={shareApp}>
        <Text style={styles.rowIcon}>📤</Text>
        <View style={styles.rowTextBox}>
          <Text style={styles.rowTitle}>{t("settings.shareApp")}</Text>
          <Text style={styles.rowHint}>{t("settings.shareAppHint")}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.about}>
        <Text style={styles.aboutText}>{t("settings.about")}</Text>
        <Text style={styles.aboutVersion}>
          SCANSYNC {Constants.expoConfig?.version ? `v${Constants.expoConfig.version}` : ""}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background, padding: 16 },
    sectionTitle: { fontSize: 13, fontWeight: "700", color: colors.textMuted, marginTop: 8, marginBottom: 8 },
    optionRow: { flexDirection: "row", gap: 8 },
    option: {
      flex: 1,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: "center",
    },
    optionActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    optionText: { color: colors.text, fontWeight: "600", fontSize: 13 },
    optionTextActive: { color: "#fff", fontWeight: "600", fontSize: 13 },
    languageBox: { marginTop: 2 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginTop: 20,
    },
    rowIcon: { fontSize: 22 },
    rowTextBox: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
    rowHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    about: { marginTop: 28, alignItems: "center" },
    aboutText: { fontSize: 12, color: colors.textFaint, fontWeight: "600" },
    aboutVersion: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  });
}
