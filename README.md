# 🚗 SOJA - Smart On-Demand Journey Assistant

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.26-000020?style=flat&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)

Platform travel dan transportasi berbasis lokasi dengan sistem jemput-antar real-time menggunakan MapLibre dan OpenRouteService.

---

## 📦 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/Blckjackk/soja.git
cd soja
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Pastikan kamu punya API keys:
- **MapTiler**: Untuk maps & geocoding
- **OpenRouteService**: Untuk routing

### 4. Prebuild untuk Native Modules
```bash
npx expo prebuild
```

### 5. Jalankan di Development
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

**⚠️ Catatan**: Aplikasi ini menggunakan MapLibre (native module), jadi **TIDAK BISA** pakai Expo Go. Harus build development/production.

---

## 🚀 Build Production

### Android APK
```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```
APK ada di: `android\app\build\outputs\apk\release\app-release-unsigned.apk`

### Install ke Device
```bash
adb install -r android\app\build\outputs\apk\release\app-release-unsigned.apk
```

---

## ✨ Fitur Utama

- ✅ **Jemput & Antar** - Booking perjalanan dengan lokasi GPS
- ✅ **Pilih Kursi** - 18 kursi dengan nomor (1-18), highlight biru saat dipilih
- ✅ **Real-time Tracking** - Lacak driver dengan MapLibre
- ✅ **Geocoding** - Autocomplete lokasi pakai MapTiler
- ✅ **Routing** - Hitung jarak & durasi pakai OpenRouteService
- ✅ **Darurat** - Tombol panic button
- ✅ **Pengaturan** - Pairing device & cek saldo
- ✅ **PIN Security** - Autentikasi dengan 6-digit PIN

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | 54.0.26 | Development platform |
| TypeScript | 5.9.2 | Type safety |
| MapLibre React Native | 10.4.2 | Maps & navigation |
| React Native Paper | 5.14.5 | Material Design UI |
| Expo Router | 6.0.16 | File-based navigation |
| MapTiler API | - | Map tiles & geocoding |
| OpenRouteService | - | Route calculation |

---

## 📁 Struktur Project

```
soja/
├── 📱 app/                    # Screens (Expo Router)
│   ├── (tabs)/               # Tab navigation
│   │   ├── index.tsx         # Home screen
│   │   └── explore.tsx       # Explore screen
│   ├── antar-page.tsx        # Antar service
│   ├── jemput-page.tsx       # Jemput service
│   └── tracking.tsx          # Driver tracking
├── 🧩 components/            # Reusable components
│   ├── AntarBottomSheet.tsx  # Seat selection (18 kursi)
│   ├── LocationModal.tsx     # Location input
│   ├── PinModal.tsx          # PIN authentication
│   └── ...
├── 🎨 assets/                # Images & icons
├── 🔧 constants/             # Theme & config
└── 🪝 hooks/                 # Custom hooks
```

---

## 🔑 API Keys

| Service | Key | Limit |
|---------|-----|-------|
| MapTiler | `SaFxGRdQzxbsujzwd61b` | - |
| OpenRouteService | `eyJvcmci...` | 2000 req/day |

---

## 🐛 Troubleshooting

<details>
<summary><b>MapLibre native module error</b></summary>

Jika muncul error "MapLibreRNModule has not been registered", berarti native code belum dikompilasi:

**Solusi A** - Comment out MapLibre (temporary):
```typescript
// import MapLibreGL from '@maplibre/maplibre-react-native';
// <MapLibreGL.MapView ... />
```

**Solusi B** - Rebuild dengan native modules:
```bash
npx expo run:android
```
</details>

<details>
<summary><b>Gradle build gagal</b></summary>

```bash
cd android
.\gradlew clean
cd ..
npx expo prebuild --clean
cd android
.\gradlew assembleRelease
```
</details>

<details>
<summary><b>Module tidak ditemukan</b></summary>

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npx expo prebuild
```
</details>

---

## 💡 Development Tips

- Hot reload: `npx expo start --clear`
- Check logs: `adb logcat | findstr ReactNative`
- Reset cache: `npx expo start -c`

---

## 📄 License

MIT License - feel free to use this project!

---

**Dibuat dengan ❤️ menggunakan React Native & Expo**
