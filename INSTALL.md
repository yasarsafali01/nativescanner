# Kurulum

## Gereksinimler

- Node.js 18+
- Android Studio (emülatör veya fiziksel cihaz için) ya da Xcode (iOS için)
- Expo CLI bağımlılıkları `npm install` ile otomatik gelir

## Bağımlılıkları Yükleme

```
npm install
```

## Native Projeyi Oluşturma

Bu proje `expo prebuild` ile native `android/`/`ios/` klasörlerini üretir (bunlar `.gitignore`'da olduğu için repoda yoktur):

```
npx expo prebuild --clean
```

## Çalıştırma

```
npx expo run:android
# veya
npx expo run:ios
```

## Ortam Değişkenleri

Backend bağımlılığı olmadığı için `.env` dosyasına ihtiyaç yoktur.

## Platforma Özel Notlar

- `react-native-reanimated` ve `react-native-worklets`, Skia'nın native JSI kurulumu için zorunludur; `babel.config.js` içinde `react-native-worklets/plugin` eklidir.
- Yeni bir native bağımlılık eklendiğinde (`expo prebuild --clean` sonrası) Gradle derlemesi ilk seferde uzun sürebilir; dosya kilidi hatası (`EBUSY`) alınırsa artakalan Gradle daemon süreçlerini sonlandırıp tekrar deneyin.
- Varsayılan dil Türkçe, varsayılan tema açık (beyaz) temadır; bu tercihler AsyncStorage üzerinden cihazda saklanır.
