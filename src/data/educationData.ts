import { SecurityArticle } from '../types';

export const EDUCATION_ARTICLES: SecurityArticle[] = [
  {
    id: 'phishing-guide',
    title: 'Cara Mengenali Serangan Phishing',
    category: 'phishing',
    summary:
      'Phishing adalah upaya penipuan untuk mencuri data pribadi, kata sandi, atau kredensial perbankan dengan menyamar sebagai institusi resmi.',
    warningSigns: [
      'Alamat URL meniru nama brand terkenal (contoh: bca-klik-update.xyz bukan klikbca.com)',
      'Menggunakan kata bernada darurat seperti "Akun akan diblokir dalam 1x24 jam"',
      'Mengarahkan login atau reset kata sandi ke halaman palsu',
      'Menggunakan salam pembuka generik ("Kepada Nasabah Yang Terhormat") tanpa nama lengkap Anda',
    ],
    tips: [
      'Periksa nama domain utama secara teliti sebelum memasukkan kredensial apa pun',
      'Ketik langsung alamat website resmi di browser, jangan mengklik link dari pesan atau email',
      'Aktifkan otentikasi dua faktor (2FA) dengan aplikasi authenticator jika memungkinkan',
    ],
    actionSteps: [
      'Jangan pernah memasukkan username, PIN, atau kata sandi',
      'Tutup tab browser segera jika curiga',
      'Laporkan link ke platform terkait atau laporkan ke tim IT institusi yang dicatut',
    ],
  },
  {
    id: 'otp-safety',
    title: 'Bahaya dan Mitigasi Permintaan OTP',
    category: 'otp',
    summary:
      'One-Time Password (OTP) adalah kunci rahasia sekali pakai untuk mengotorisasi transaksi finansial atau pengambilalihan akun.',
    warningSigns: [
      'Ada pihak mengaku CS bank/marketplace meminta kode 4-6 digit yang baru saja masuk ke SMS/WhatsApp Anda',
      'Alasan "verifikasi hadiah", "pembatalan transaksi", atau "sinkronisasi sistem"',
      'Penelepon bernada sangat memaksa dan tidak memperbolehkan Anda menutup telepon',
    ],
    tips: [
      'KODE OTP SIFATNYA RAHASIA MUTLAK - Petugas resmi mana pun TIDAK PERNAH berhak memintanya',
      'Baca teks SMS OTP secara saksama: biasanya tertera nominal transfer atau aktivitas yang sedang terjadi',
      'Gunakan kata sandi transaksi atau biometric yang kuat di perangkat Anda',
    ],
    actionSteps: [
      'Tolak dan segera putuskan panggilan atau blokir pesan yang meminta OTP',
      'Segera ganti password akun dan PIN transaksi aplikasi Anda',
      'Hubungi call center resmi bank untuk memblokir rekening sementara jika OTP sempat bocor',
    ],
  },
  {
    id: 'fake-jobs',
    title: 'Ciri Lowongan Kerja Palsu & Scam Part-Time',
    category: 'loker',
    summary:
      'Penipuan rekrutmen menjerat pencari kerja dengan iming-iming komisi harian besar dari tugas mudah atau meminta uang muka administrasi.',
    warningSigns: [
      'Tugas sederhana bergaji tidak masuk akal (misal: "Like dan subscribe YouTube dibayar Rp 500.000/hari")',
      'Diminta mentransfer deposit uang atau modal dengan janji kembali berlipat ganda',
      'Rekrutmen hanya melalui chat WhatsApp atau Telegram pribadi tanpa interview formal',
      'Menggunakan dokumen mengatasnamakan BUMN atau perusahaan besar namun dengan alamat email gratisan (gmail/yahoo)',
    ],
    tips: [
      'Perusahaan kredibel TIDAK PERNAH memungut biaya seleksi, akomodasi, atau tiket perjalanan',
      'Cek keabsahan lowongan di situs karier resmi perusahaan atau LinkedIn resmi',
      'Jangan pernah mentransfer uang dengan janji komisi kerja sampingan online',
    ],
    actionSteps: [
      'Hentikan komunikasi segera jika diminta top up dana tugas',
      'Tolak mengirimkan scan KTP/foto selfie dengan KTP jika identitas perusahaan belum jelas',
      'Simpan bukti tangkapan layar untuk laporan ke pihak berwenang',
    ],
  },
  {
    id: 'fake-marketplace',
    title: 'Mengenali Toko Online Palsu di Media Sosial',
    category: 'marketplace',
    summary:
      'Penipu membuat akun toko online tiruan dengan harga barang jauh di bawah pasaran untuk merampas uang transfer pembeli.',
    warningSigns: [
      'Harga barang tidak realistis (misal: iPhone keluaran terbaru dijual 1/3 harga resmi)',
      'Kolom komentar dinonaktifkan atau hanya berisi testimoni palsu tanpa interaksi organik',
      'Menolak transaksi melalui sistem rekening bersama resmi (Escrow) e-commerce dan memaksa transfer manual',
      'Meminta tambahan biaya "uang jaminan bea cukai" setelah pembeli mentransfer pembayaran awal',
    ],
    tips: [
      'Selalu bertransaksi di dalam sistem marketplace resmi yang memiliki jaminan garansi uang kembali',
      'Periksa nomor rekening penjual di platform kredibel seperti cekrekening.id sebelum transfer manual',
      'Cek umur akun sosial media dan riwayat perubahan nama akun pengguna',
    ],
    actionSteps: [
      'Batalkan pembelian jika penjual mengarahkan transaksi ke jalur pribadi di luar platform',
      'Laporkan akun toko palsu ke moderator marketplace atau media sosial',
    ],
  },
  {
    id: 'domain-inspection',
    title: 'Cara Memeriksa Keaslian Domain URL',
    category: 'domain',
    summary:
      'Pelaku phishing sering mendaftarkan nama domain yang mirip (typosquatting) untuk mengecoh pengguna yang kurang teliti.',
    warningSigns: [
      'Domain menggunakan ekstensi tidak umum untuk layanan finansial (misal: .top, .buzz, .cfd, bukan .co.id atau .com)',
      'Nama domain mengandung karakter angka pengganti huruf (misal: bca-0nline bukan bca)',
      'Nama brand diletakkan sebagai subdomain (misal: bca.com.pemberitahuan-resmi.xyz -> domain aslinya adalah pemberitahuan-resmi.xyz!)',
    ],
    tips: [
      'Perhatikan kata tepat sebelum ekstensi .com/.id — itulah domain sebenarnya',
      'Perhatikan sertifikat SSL (HTTPS): gembok hijau/aman bukan jaminan 100% aman, namun ketiadaan HTTPS adalah bendera merah',
    ],
    actionSteps: [
      'Gunakan fitur Periksa Link di ScamShield untuk mengecek reputasi teknis domain',
      'Jika ragu, cari nama brand di Google dan klik hasil pencarian pertama terverifikasi',
    ],
  },
  {
    id: 'incident-response',
    title: 'Langkah Penyelamatan Jika Terlanjur Mengklik Link',
    category: 'tindakan',
    summary:
      'Tindakan cepat dan tepat dalam hitungan menit pertama sangat menentukan penyelamatan akun dan keuangan Anda.',
    warningSigns: [
      'Muncul file asing yang otomatis terunduh (.apk, .exe, .zip)',
      'Perangkat terasa panas mendadak atau aplikasi perbankan tertutup sendiri',
    ],
    tips: [
      'Tetap tenang dan lakukan pemutusan koneksi secepatnya',
      'Dokumentasikan bukti screenshot tautan atau percakapan sebelum data hilang',
    ],
    actionSteps: [
      '1. Segera putuskan koneksi internet (aktifkan Airplane Mode / matikan Wi-Fi & data seluler)',
      '2. JANGAN instal file .APK yang terunduh otomatis. Hapus file tersebut dari folder Downloads',
      '3. Jika sempat memasukkan kredensial, segera ganti password akun Anda melalui perangkat lain yang bersih',
      '4. Hubungi Call Center bank untuk memblokir kartu debit/kredit dan membatukan mobile banking sementara',
      '5. Jalankan scan antivirus/antimalware pada perangkat Anda',
    ],
  },
  {
    id: 'reporting-guide',
    title: 'Saluran Resmi Pelaporan Penipuan Digital di Indonesia',
    category: 'pelaporan',
    summary:
      'Membantu aparat dan ekosistem digital memblokir rekening serta nomor pelaku kejahatan siber.',
    warningSigns: [],
    tips: [
      'Lapor.go.id - Layanan Pengaduan Pemerintah RI',
      'PatroliSiber.id - Bareskrim Polri untuk tindak pidana siber',
      'CekRekening.id - Kementerian Kominfo untuk pelaporan rekening bank penipu',
      'AduanKonten.id - Kominfo untuk pemblokiran website phishing atau konten ilegal',
      'BRTI / Kominfo Call Center 159 untuk pengaduan nomor telepon scammer',
    ],
    actionSteps: [
      'Kumpulkan tangkapan layar bukti obrolan dan nomor kontak penipu',
      'Kumpulkan bukti nomor rekening tujuan dan slip bukti transfer (jika sudah terjadi kerugian finansial)',
      'Buat laporan kepolisian terdekat (SKTLK) untuk persyaratan blokir rekening permanen di bank terkait',
    ],
  },
];
