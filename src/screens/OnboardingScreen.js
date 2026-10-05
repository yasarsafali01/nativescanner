import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useI18n } from "../i18n/I18nContext";
import { useAppTheme } from "../theme/ThemeContext";
import LanguagePills from "../components/LanguagePills";

export const ONBOARDING_STORAGE_KEY = "freescanner_onboarding_seen";

const ICONS = ["👋", "📷", "🎨", "🗂️"];

export default function OnboardingScreen({ onDone }) {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [step, setStep] = useState(0);

  const slides = [
    { title: t("onboarding.slide1Title"), body: t("onboarding.slide1Body") },
    { title: t("onboarding.slide2Title"), body: t("onboarding.slide2Body") },
    { title: t("onboarding.slide3Title"), body: t("onboarding.slide3Body") },
    { title: t("onboarding.slide4Title"), body: t("onboarding.slide4Body") },
  ];
  const isLast = step === slides.length - 1;

  async function finish() {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "1").catch(() => {});
    onDone();
  }

  function next() {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }

  return (
    <View style={styles.page}>
      <View style={styles.topRow}>
        <LanguagePills />
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skipText}>{t("onboarding.skip")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>{ICONS[step]}</Text>
        <Text style={styles.title}>{slides[step].title}</Text>
        <Text style={styles.body}>{slides[step].body}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={next}>
        <Text style={styles.nextBtnText}>{isLast ? t("onboarding.start") : t("onboarding.next")}</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 56 },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    skipText: { color: colors.textMuted, fontWeight: "600", fontSize: 13 },
    content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
    icon: { fontSize: 64, marginBottom: 24 },
    title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 12 },
    body: { fontSize: 15, color: colors.textMuted, textAlign: "center", lineHeight: 22 },
    dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 24 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
    dotActive: { backgroundColor: colors.accent, width: 20 },
    nextBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 16, alignItems: "center" },
    nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  });
}
