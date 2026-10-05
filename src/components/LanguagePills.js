import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useI18n } from "../i18n/I18nContext";
import { useAppTheme } from "../theme/ThemeContext";
import LanguageModal from "./LanguageModal";

// TR gets its own pill; every other language shares a second pill that opens
// a picker modal, matching the two-pill pattern used across the app header.
export default function LanguagePills() {
  const { lang, languages, setLang } = useI18n();
  const { colors } = useAppTheme();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const turkish = languages.find((l) => l.code === "tr");
  const otherLanguages = languages.filter((l) => l.code !== "tr");
  const isTurkish = lang === "tr";
  const currentOther = otherLanguages.find((l) => l.code === lang);
  const otherPillLanguage = currentOther || otherLanguages[0];

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.pill,
          { backgroundColor: colors.accentSoft },
          isTurkish && { backgroundColor: colors.accent },
        ]}
        onPress={() => setLang("tr")}
      >
        <Text style={styles.flagText}>{turkish?.flag}</Text>
        <Text style={[styles.pillText, { color: isTurkish ? "#ffffff" : colors.accentDark }]}>TR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.pill,
          { backgroundColor: colors.accentSoft },
          !isTurkish && { backgroundColor: colors.accent },
        ]}
        onPress={() => setLangModalVisible(true)}
      >
        <Text style={styles.flagText}>{otherPillLanguage?.flag}</Text>
        <Text style={[styles.pillText, { color: !isTurkish ? "#ffffff" : colors.accentDark }]}>
          {otherPillLanguage?.code.toUpperCase()}
        </Text>
      </TouchableOpacity>
      <LanguageModal visible={langModalVisible} onClose={() => setLangModalVisible(false)} data={otherLanguages} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 9,
  },
  flagText: { fontSize: 14 },
  pillText: { fontSize: 11.5, fontWeight: "700" },
});
