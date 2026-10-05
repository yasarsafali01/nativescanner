import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useI18n } from "../i18n/I18nContext";
import { useAppTheme } from "../theme/ThemeContext";
import LanguagePills from "./LanguagePills";

export default function HeaderControls() {
  const { t } = useI18n();
  const { isDark, toggleTheme, colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <LanguagePills />
      <TouchableOpacity style={[styles.pill, { backgroundColor: colors.accentSoft }]} onPress={toggleTheme}>
        <Text style={styles.iconText}>{isDark ? "🌙" : "☀️"}</Text>
        <Text style={[styles.pillText, { color: colors.accentDark }]}>
          {isDark ? t("theme.dark") : t("theme.light")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginRight: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 9,
  },
  iconText: { fontSize: 12 },
  pillText: { fontSize: 11.5, fontWeight: "700" },
});
