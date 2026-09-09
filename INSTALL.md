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

## Mağaza Yayını (Play Store / App Store)

Uygulama kimliği: **SCANSYNC - Free Document Scanner** — geliştirici **EYS Interactive Tech**, paket adı `com.eysinteractivetech.scanner`.

### İkon / Splash

`assets/icon.png`, `assets/android-icon-*.png`, `assets/splash-icon.png` ve `assets/favicon.png` şu an Expo varsayılanıdır. Kendi logonuzu aldıktan sonra bu dosyaların yerine aynı isim ve boyutlarda (icon 1024×1024, adaptive icon foreground 1024×1024 şeffaf zeminli) yenilerini koyup `npx expo prebuild --clean` ile native projeleri yeniden üretin.

### Android (Play Console)

1. Google Play Console'da yeni uygulama oluşturun, geliştirici adı olarak **EYS Interactive Tech** girin.
2. İmzalı bir AAB üretin:
   ```
   npx expo prebuild --clean
   cd android && ./gradlew bundleRelease
   ```
   Play App Signing kullanmanız önerilir (upload key + Google tarafında yönetilen imzalama).
3. Gizlilik politikası URL'i zorunludur: [PRIVACY.md](PRIVACY.md) içeriğini bir web sayfasında (ör. GitHub Pages) yayınlayıp linkini Play Console'a girin — repo içindeki dosya linki tek başına kabul edilmez.
4. İçerik derecelendirme anketini ve veri güvenliği (Data safety) formunu doldurun. Uygulama AdMob reklamları kullandığı için artık "No data collected" **seçilemez** — "Advertising ID" ve "Device or other IDs" toplandığını, reklam amaçlı kullanıldığını işaretleyin (bkz. [PRIVACY.md](PRIVACY.md)). AEA/İngiltere kullanıcıları için Google'ın UMP (User Messaging Platform) SDK'sı ile onay (consent) akışı eklenmesi Play politikası gereğidir — şu an eklenmedi, canlıya çıkmadan önce yapılmalı.
5. Store listing metinleri:
   - **Kısa açıklama:** "EYS Interactive Tech'ten ücretsiz, tamamen cihazda çalışan belge tarayıcı."
   - **Uzun açıklama:** README.md'deki özellik listesini (köşe düzeltme, filtreler, çoklu sayfa PDF, geçmiş) temel alarak yazılabilir; internet/backend gerekmediği vurgulanmalı.

### iOS (App Store Connect)

1. Apple Developer hesabında bundle identifier olarak `com.eysinteractivetech.scanner` kaydedin (app.json'daki değerle birebir aynı olmalı).
2. `npx expo prebuild --clean` sonrası Xcode'dan (veya EAS Build ile) arşiv alıp App Store Connect'e yükleyin.
3. Gizlilik politikası URL'i ve "App Privacy" (veri toplama beyanı) formunda [PRIVACY.md](PRIVACY.md) içeriğiyle uyumlu şekilde "Data Not Collected" işaretlenebilir.

## Reklamlar (AdMob)

Uygulama `react-native-google-mobile-ads` ile banner (ana ekran altı) ve geçiş (tarama bitince, resim indirirken) reklamları gösterir. Şu an **Google'ın test ad unit ID'leri** kullanılıyor (`src/ads/ads.js`) — bunlarla gerçek gelir oluşmaz ve mağazaya bu haliyle gönderilemez.

### AdMob hesabı ve gerçek ID'lere geçiş

1. https://admob.google.com adresinden Google hesabınızla ücretsiz AdMob hesabı açın.
2. "Uygulamalar > Uygulama Ekle" ile SCANSYNC'i ekleyin (henüz mağazada değilse "Hayır" deyip devam edebilirsiniz).
3. Uygulama için bir **banner** ve bir **interstitial** reklam birimi (ad unit) oluşturun; her biri `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY` formatında bir ID verir.
4. AdMob hesabınızın kendi **App ID**'sini alın (`ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ` formatında).
5. `app.json` içindeki `react-native-google-mobile-ads` plugin ayarındaki `androidAppId`/`iosAppId` değerlerini kendi App ID'nizle değiştirin.
6. `src/ads/ads.js` içindeki `BANNER_AD_UNIT_ID` ve `INTERSTITIAL_AD_UNIT_ID` değerlerini kendi ad unit ID'lerinizle değiştirin (test ID'lerini kullanmaya devam ederseniz reklam gelir getirmez).
7. Değişikliklerden sonra `npx expo prebuild --clean` ile native projeyi yeniden üretip yeniden derleyin.

### Versiyon Artırma

Her mağaza gönderiminde `app.json` içindeki `version`, Android `versionCode` ve iOS `buildNumber` alanlarını artırmayı unutmayın.
