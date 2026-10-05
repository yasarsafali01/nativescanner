import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { BANNER_AD_UNIT_ID } from "./ads";
import { useAppTheme } from "../theme/ThemeContext";

export default function AppBanner() {
  const { colors } = useAppTheme();
  return (
    <View style={{ alignItems: "center", backgroundColor: colors.headerBg, paddingVertical: 4 }}>
      <BannerAd unitId={BANNER_AD_UNIT_ID} size={BannerAdSize.LARGE_BANNER} />
    </View>
  );
}
