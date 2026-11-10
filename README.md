# ScamShield 🛡️

Aplikasi mobile berbasis React Native dan Expo untuk mendeteksi potensi risiko penipuan digital (phishing, loker palsu, penipuan marketplace, hadiah fiktif, pencurian OTP, dan skema transfer).

---

## Masalah yang Diselesaikan

Meningkatnya kejahatan siber di Indonesia menyasar mahasiswa, pencari kerja, dan masyarakat awam melalui:
- Pesan rekrutmen kerja palsu (tugas like YouTube / TikTok dengan iming-iming jutaan rupiah).
- Phishing perbankan berkedok pemblokiran rekening atau pembaruan tarif transfer.
- Undian berhadiah fiktif dan klaim voucher belanja gratis yang meminta OTP / PIN.
- Tautan palsu yang mengarahkan korban mengunduh file berbahaya (APK malware) atau memasukkan kredensial pribadi.

ScamShield hadir sebagai lini pertahanan pertama untuk mengidentifikasi indikator ancaman sebelum pengguna membuka link, login, membagikan OTP, atau mentransfer uang.

---

## Fitur Utama

### 1. Beranda Interaktif
- Aksi cepat pemeriksaan link URL dan teks pesan.
- Ringkasan riwayat pemeriksaan terbaru.
- Tips keamanan harian dan banner disclaimer indikatif.

### 2. Pemeriksaan Link (URL Checker)
- Validasi format dan normalisasi protokol otomatis (`https://`).
- Penolakan ketat skema berbahaya (`javascript:`, `data:`, `file:`, `vbscript:`).
- Deteksi IP address sebagai hostname, subdomain berlapis, shortener URL, dan TLD mencurigakan.
- Quick samples untuk pengujian langsung jenis phishing umum.
- Tanpa membuka WebView otomatis untuk menjaga keamanan perangkat pengguna.

### 3. Pemeriksaan Pesan (Message Checker)
- Ekstraksi dan inspeksi tautan tersembunyi di dalam pesan.
- Analisis tekanan waktu dan urgensi palsu ("Akun diblokir", "Batas 24 jam").
- Deteksi pencurian OTP, PIN, password, CVV, dan nomor kartu ATM.
- Deteksi loker fiktif ("tanpa seleksi", tugas follow/like berbayar) dan skema investasi bodong.

### 4. Skor dan Kategori Risiko Transparan
- Skala skor 0–100 dengan indikator visual dan rincian poin:
  - `0–19`: **Indikatif Aman** (`#22C55E`)
  - `20–39`: **Risiko Rendah** (`#84CC16`)
  - `40–59`: **Risiko Sedang** (`#F59E0B`)
  - `60–79`: **Risiko Tinggi** (`#F97316`)
  - `80–100`: **Risiko Kritis** (`#EF4444`)
- Rekomendasi mitigasi praktis sesuai tingkat bahaya.
- Fitur bagikan ringkasan peringatan ke kerabat/keluarga.

### 5. Penyimpanan Riwayat Tersanitasi (Privacy-First)
- Riwayat disimpan lokal di perangkat menggunakan `@react-native-async-storage/async-storage`.
- **Sensitisasi PII Otomatis:** Nomor telepon, email, query token, dan nomor kartu otomatis disensor (`[REDACTED]`) sebelum disimpan.
- Filter berdasarkan level risiko, hapus per item, atau hapus seluruh riwayat.

### 6. Edukasi Keamanan Interaktif
- Modul panduan mendalam:
  - Cara mengenali serangan Phishing.
  - Bahaya membagikan kode OTP.
  - Ciri-ciri lowongan kerja bodong & penipuan online shop.
  - Cara memeriksa keaslian nama domain.
  - Langkah darurat jika terlanjur mengklik link mencurigakan.
  - Saluran resmi pelaporan penipuan siber di Indonesia (Kominfo, OJK, Patroli Siber Polri).

### 7. Pengaturan & Aksesibilitas
- Dukungan Light Mode & Dark Mode.
- Sakelar Mode Simulasi / Demo offline.
- Kebijakan privasi dan transparansi data.

---

## Teknologi yang Digunakan

- **Framework:** [React Native](https://reactnative.dev/) dengan [Expo SDK 52](https://expo.dev/)
- **Routing:** [Expo Router v4](https://docs.expo.dev/router/introduction/) (File-based routing & Native Tabs)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Komponen UI & Desain:** Custom UI Kit dengan token tema mobile-first (Touch target min. 44x44, rasio kontras WCAG)
- **Ikon:** `@expo/vector-icons` (Ionicons)
- **Penyimpanan Lokal:** `@react-native-async-storage/async-storage`
- **Testing:** Jest + `ts-jest`
- **Backend / Proxy:** Arsitektur Supabase Edge Function (Free Tier) & fallback mock lokal

---

## Struktur Proyek

```text
ScamShield/
├── __tests__/                     # Pengujian unit (Jest)
│   ├── apiHandling.test.ts
│   ├── messageAnalysis.test.ts
│   ├── redaction.test.ts
│   ├── riskScoring.test.ts
│   ├── setup.ts
│   └── urlValidator.test.ts
├── src/
│   ├── app/                       # Layar Expo Router
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── check.tsx
│   │   │   ├── history.tsx
│   │   │   ├── index.tsx
│   │   │   ├── learn.tsx
│   │   │   └── settings.tsx
│   │   ├── _layout.tsx
│   │   ├── check-message.tsx
│   │   ├── check-url.tsx
│   │   ├── history-detail.tsx
│   │   └── result.tsx
│   ├── components/                # Komponen UI modular
│   │   ├── checker/
│   │   ├── common/
│   │   ├── history/
│   │   ├── home/
│   │   └── result/
│   ├── constants/                 # Token warna & pola regex scam
│   ├── data/                      # Artikel edukasi & data contoh
│   ├── hooks/                     # Custom hooks (Theme, History, Analyzer)
│   ├── services/                  # Logika domain analisis & storage
│   │   ├── scamAnalysis/          # Engine penilai risiko & provider
│   │   ├── storage/               # AsyncStorage adapter
│   │   └── supabase/              # Klien Edge Function
│   ├── theme/                     # Token desain
│   ├── types/                     # Definisi TypeScript
│   └── utils/                     # Sanitasi URL & redaksi data PII
├── app.json
├── jest.config.js
├── package.json
└── tsconfig.json
```

---

## Cara Instalasi & Menjalankan

### Prasyarat
- Node.js versi 18+ (disarankan versi LTS)
- npm atau yarn
- Expo Go di smartphone (Android/iOS) atau emulator lokal

### 1. Kloning & Instalasi Dependensi
```bash
# Clone repository atau buka folder project
cd ScamShield

# Instalasi paket
npm install
```

### 2. Konfigurasi Environment Variable
Buat file `.env` di root direktori jika ingin mengaktifkan integrasi backend:
```env
# Supabase Edge Proxy (Opsional untuk integrasi production)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Mode Demo / Mock Paksa (true jika ingin sepenuhnya offline/demo)
EXPO_PUBLIC_FORCE_MOCK=false
```

*Catatan Keamanan: API key pihak ketiga (seperti Google Safe Browsing) tidak pernah dimasukkan ke dalam kode aplikasi mobile. Kunci tersebut disimpan di backend Supabase Edge Functions.*

### 3. Menjalankan Aplikasi
```bash
# Jalankan Expo dev server
npx expo start

# Atau jalankan langsung untuk web / emulator
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## Mode Demo & Tanpa API Eksternal

Aplikasi dirancang **100% resilient offline**:
- Jika API eksternal belum dikonfigurasi atau perangkat tidak memiliki koneksi internet, ScamShield secara otomatis menjalankan **Mesin Heuristik Lokal** dipadukan dengan **Mock Dataset**.
- Hasil pemindaian akan menyertakan label transparan `Demo analysis` atau `Heuristik Lokal`.
- Seluruh modul edukasi, formulir uji coba, kalkulasi risiko, dan riwayat lokal tetap berfungsi penuh tanpa jaringan internet.

---

## Batasan Deteksi (Limitations)

1. **Penilaian Bersifat Indikatif:** ScamShield mengidentifikasi pola teknis dan linguistik yang biasa digunakan dalam rekayasa sosial, namun tidak dapat memberikan jaminan keamanan absolut 100%.
2. **Domain Baru (Zero-Day Phishing):** Penyerang dapat membuat situs baru yang belum terdaftar di database reputasi global. Heuristik ScamShield akan menandai indikator struktural (usia domain, penggunaan IP, kata kunci login).
3. **Pesan Konteks Khusus:** Beberapa pesan resmi dari instansi tertentu mungkin menggunakan kata bernada darurat. Pengguna dianjurkan selalu melakukan konfirmasi sekunder ke nomor narahubung resmi.

---

## Kebijakan Privasi & Perlindungan Data

- **Zero Data Logging:** URL dan isi pesan mentah tidak pernah dicatat (console logging dinonaktifkan di build rilis).
- **Redaksi PII:** Sebelum disimpan di riwayat penyimpanan lokal, nomor telepon, alamat email, nomor rekening/kartu, serta parameter sensitif pada query URL otomatis disensor.
- **Penyimpanan Lokal Eksklusif:** Riwayat analisis tersimpan hanya di memori internal ponsel pengguna dan dapat dihapus seutuhnya kapan saja melalui menu Pengaturan.

---

## Menjalankan Pengujian (Testing) & Linter

```bash
# Menjalankan unit test Jest
npm test

# Menjalankan ESLint
npm run lint

# Memeriksa TypeScript type safety
npx tsc --noEmit
```

Semua 39 test suite mencakup:
- Validasi URL dan penolakan protokol berbahaya (`javascript:`, `data:`, `file:`).
- Ekstraksi tautan dari teks pesan.
- Deteksi pola penipuan (urgensi, OTP, lowongan kerja fiktif, undian).
- Perhitungan dan pembatasan skor risiko 0–100.
- Penyimpanan dan penghapusan riwayat lokal.
- Penanganan timeout, rate limit (HTTP 429), dan ketahanan offline.
- Penyensoran data sensitif (PII redaction).

---

## Roadmap Pengembangan

- [ ] Integrasi integrasi pemindai QR Code untuk URL phishing fisik (Quishing).
- [ ] Deteksi file APK berbahaya secara lokal sebelum diinstal.
- [ ] Sinkronisasi cloud terenkripsi end-to-end opsional antar perangkat via Supabase Auth.
- [ ] Penambahan basis data nomor rekening penipu terverifikasi (integrasi CekRekening.id).

---

## Disclaimer Resmi

> **PENTING:** ScamShield adalah alat bantu peringatan dini dan edukasi keamanan siber. Hasil analisis yang diberikan bersifat indikatif dan tidak menjamin bahwa suatu URL atau pesan 100% bebas dari ancaman kejahatan siber. Jangan pernah membagikan kode OTP, PIN, kata sandi, atau data identitas rahasia kepada pihak manapun.
