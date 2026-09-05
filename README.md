# NativeScanner

Backend'siz, tamamen cihaz üzerinde çalışan bir React Native (Expo) belge tarayıcı. Köşe düzeltme, döndürme, parlaklık/kontrast, siyah-beyaz/gri/renkli mod, çoklu sayfa PDF birleştirme ve tarama geçmişi — hepsi ağ bağlantısı olmadan, cihazda işlenir.

## Mimari

Tüm işlem cihaz üzerinde yapılır, sunucuya hiçbir görüntü gönderilmez:

1. **Çekim / seçim** — kamera veya galeriden fotoğraf alınır.
2. **Köşe düzeltme** — kullanıcı 4 köşeyi sürükler, `src/processing/perspectiveWarp.js` saf JS homografi matrisiyle perspektif düzeltmesi uygular.
3. **Görüntü kod çözme/kodlama** — `src/processing/skiaImage.js`, `@shopify/react-native-skia`'yı yalnızca JPEG decode/encode için kullanır.
4. **Filtre** — `src/processing/applyFilter.js` parlaklık/kontrast ve renk modunu (bw/gray/color) uygular.
5. **PDF** — çoklu sayfa taramalar `pdf-lib` ile tek bir PDF'e birleştirilir (`src/processing/pdf.js`).
6. **Geçmiş** — taramalar cihazda `src/storage/history.js` üzerinden saklanır (arama, yeniden adlandırma, silme).

Tema (açık/koyu) ve dil (8 dil, bayrak seçici) desteği `src/theme/` ve `src/i18n/` altında Context tabanlı sağlayıcılarla yönetilir.

## Klasör Yapısı

```
src/
  components/     # Header'daki tema/dil kontrolleri, dil seçim modalı
  i18n/           # Çeviri sözlüğü ve I18nContext
  navigation/     # RootNavigator (tab + stack navigasyon)
  processing/     # Perspektif düzeltme, filtre, Skia decode/encode, PDF üretimi
  scanner/        # Stepper, ProgressBar gibi paylaşılan tarama bileşenleri
  screens/        # HomeScreen, EditScreen, MultiScanScreen, ResultScreen, HistoryScreen
  storage/        # AsyncStorage tabanlı tarama geçmişi
  theme/          # Açık/koyu tema Context'i
```

## Teknoloji

- React Native + Expo (SDK 57)
- `@shopify/react-native-skia` — yalnızca JPEG decode/encode için
- `pdf-lib` — PDF birleştirme
- `react-native-reanimated` — Skia'nın native JSI kurulumu için gerekli
- AsyncStorage — tarama geçmişi ve tema/dil tercihi kalıcılığı

## Hızlı Başlangıç

```
npm install
npx expo run:android
```

Kurulum detayları için [INSTALL.md](INSTALL.md) dosyasına bakın.
