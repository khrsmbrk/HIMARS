import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Anggota {
  id: number;
  nama: string;
  nim: string;
  jabatan: string;
  departemen?: string;
  angkatan: string;
  divisi: string;
  noHp: string;
  status: 'Aktif' | 'Non-aktif';
  foto?: string;
  qrCode: string;
}

export interface Kehadiran {
  id: number;
  tanggal: string;
  waktu: string;
  kegiatan: string;
  nama: string;
  nim: string;
  departemen?: string;
  keterangan: string;
}

export interface Formatur {
  id: string;
  nama: string;
  jabatan: string;
  departemen?: string;
  foto?: string;
}

export interface KasWajib {
  id: number;
  anggotaId: number;
  bulan: string;
  status: 'lunas' | 'belum';
  nominal: number;
  tanggalBayar?: string;
}

export interface Keuangan {
  id: number;
  tanggal: string;
  jenis: 'pemasukan' | 'pengeluaran';
  kategori: string;
  programKerja: string;
  keterangan: string;
  nominal: number;
  bukti?: string; // Base64 or URL
}

export interface Dokumen {
  id: number;
  nama: string;
  tipe: string;
  ukuran: number;
  kategori: string;
  tanggal: string;
  url: string;
  isPublic: boolean;
}

export interface News {
  id: number;
  judul: string;
  kategori: string;
  isi: string;
  tanggal: string;
  waktu: string;
  qrCode: string;
  coverImage?: string;
}

export interface DrivePermission {
  userId: number;
  role: 'viewer' | 'editor';
}

export interface DriveItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  parentId: string | null;
  department: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  ownerId: number;
  timestamp: number;
  isTrashed: boolean;
  permissions: DrivePermission[];
  isPublicLink?: boolean;
}

export interface Inventaris {
  id: number;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  jumlah: number;
  lokasi: string;
  tanggalMasuk: string;
}

export interface Peminjaman {
  id: number;
  inventarisId: number;
  peminjam: string;
  kontak: string;
  instansi: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
  keterangan: string;
}

export interface Surat {
  id: number;
  nomorSurat: string;
  jenis: 'Masuk' | 'Keluar';
  tanggalSurat: string;
  tanggalDiterima: string;
  pengirimPenerima: string;
  perihal: string;
  fileUrl?: string;
  status: 'Diproses' | 'Selesai' | 'Diarsipkan';
}

export interface Proker {
  id: number;
  namaProker: string;
  departemen: string;
  ketuaPelaksana: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  status: 'Belum Mulai' | 'Sedang Berjalan' | 'Selesai' | 'Overdue';
  kpi: string;
  anggaran: number;
  realisasi: number;
  deskripsi?: string;
  labels?: string[];
  assignee?: string;
  source?: 'manual' | 'email' | 'slack' | 'teams';
  attachments?: string[];
  mirroredIn?: string[]; // Departments where this card is mirrored
}

export interface InboxItem {
  id: number;
  title: string;
  content: string;
  source: 'email' | 'slack' | 'teams';
  timestamp: string;
  processed: boolean;
}

export interface AutomationRule {
  id: number;
  name: string;
  trigger: 'due_date_passed' | 'status_changed' | 'card_created';
  action: 'move_to_column' | 'notify_slack' | 'add_label';
  params: any;
  enabled: boolean;
}

export interface Aspirasi {
  id: number;
  nama?: string;
  nim?: string;
  kategori: 'Akademik' | 'Fasilitas' | 'Organisasi' | 'Lainnya';
  pesan: string;
  tanggal: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  tanggapan?: string;
}

export interface Alumni {
  id: number;
  nama: string;
  nim: string;
  tahunJabatan: string;
  jabatanTerakhir: string;
  kontak: string;
  pekerjaanSekarang: string;
  linkedin?: string;
}

export interface Kandidat {
  id: number;
  nama: string;
  foto: string;
  visi: string;
  misi: string;
  jumlahSuara: number;
}

export interface VotingSession {
  id: number;
  judul: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Belum Mulai' | 'Aktif' | 'Selesai';
  kandidat: Kandidat[];
  nimTerdaftar: string[];
  nimSudahMemilih: string[];
  kodeAkses?: string; // Added for event security
}

export interface HomeSection {
  id: string;
  title: string;
  enabled: boolean;
}

export interface WebsiteSettings {
  siteName: string;
  siteDescription: string;
  memberIdFormat: string; // e.g., "ORG-{YEAR}-{ID}"
  primaryColor: string;
  logoUrl: string;
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  visiMisiTitle: string;
  visiMisiText: string;
  visiMisiImageUrl: string;
  prokerImageUrl: string;
  kontakImageUrl: string;
  pillarImages: string[];
  strukturHeroImageUrl: string;
  blogHeroImageUrl: string;
  dokumenHeroImageUrl: string;
  profilHeroImageUrl: string;
  kopSuratUrl?: string;
  tandaTanganUrl?: string;
  stempelUrl?: string;
  youtubeUrl: string;
  podcastUrl: string;
  formatur: Formatur[];
  homeSections: HomeSection[];
  privacyPolicy: string;
  termsConditions: string;
}

export interface User {
  id: number;
  username: string;
  password: string; // In a real app, this would be hashed
  nama: string;
  role: 'admin' | 'member';
  department?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  username: string;
  nama: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

interface DataState {
  anggota: Anggota[];
  kehadiran: Kehadiran[];
  keuangan: Keuangan[];
  kasWajib: KasWajib[];
  dokumen: Dokumen[];
  news: News[];
  drive: DriveItem[];
  inventaris: Inventaris[];
  peminjaman: Peminjaman[];
  surat: Surat[];
  proker: Proker[];
  inbox: InboxItem[];
  automations: AutomationRule[];
  aspirasi: Aspirasi[];
  alumni: Alumni[];
  voting: VotingSession[];
  settings: WebsiteSettings;
  users: User[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  storageQuota: {
    used: number;
    limit: number;
  };
}

interface DataContextType {
  data: DataState;
  setData: React.Dispatch<React.SetStateAction<DataState>>;
  addAnggota: (anggota: Omit<Anggota, 'id' | 'qrCode'>) => void;
  deleteAnggota: (id: number) => void;
  addKehadiran: (kehadiran: Omit<Kehadiran, 'id' | 'tanggal' | 'waktu'>) => void;
  addKeuangan: (keuangan: Omit<Keuangan, 'id' | 'tanggal'>) => void;
  updateKasWajib: (kas: KasWajib) => void;
  generateMonthlyKas: (bulan: string, nominal: number) => void;
  addDokumen: (dokumen: Omit<Dokumen, 'id' | 'tanggal' | 'isPublic'>) => void;
  deleteDokumen: (id: number) => void;
  toggleDokumenPublic: (id: number) => void;
  addNews: (news: Omit<News, 'id' | 'tanggal' | 'waktu' | 'qrCode'>) => void;
  deleteNews: (id: number) => void;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  updateHomeSections: (sections: HomeSection[]) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (id: number) => void;
  updateUserRole: (id: number, role: 'admin' | 'member') => void;
  updateUserDepartment: (id: number, department: string) => void;
  addDriveItem: (item: Omit<DriveItem, 'id' | 'createdAt' | 'updatedAt' | 'timestamp' | 'isTrashed' | 'permissions'>) => void;
  deleteDriveItem: (id: string) => void;
  trashDriveItem: (id: string) => void;
  restoreDriveItem: (id: string) => void;
  permanentlyDeleteDriveItem: (id: string) => void;
  renameDriveItem: (id: string, newName: string) => void;
  moveDriveItem: (id: string, newParentId: string | null) => void;
  shareDriveItem: (id: string, userId: number, role: 'viewer' | 'editor') => void;
  toggleDrivePublicLink: (id: string) => void;
  deleteMonthlyKas: (bulan: string) => void;
  deleteKeuangan: (id: number) => void;
  deleteKehadiran: (id: number) => void;
  addInventaris: (item: Omit<Inventaris, 'id'>) => void;
  updateInventaris: (item: Inventaris) => void;
  deleteInventaris: (id: number) => void;
  addPeminjaman: (item: Omit<Peminjaman, 'id'>) => void;
  updatePeminjamanStatus: (id: number, status: Peminjaman['status']) => void;
  addSurat: (item: Omit<Surat, 'id'>) => void;
  updateSuratStatus: (id: number, status: Surat['status']) => void;
  deleteSurat: (id: number) => void;
  addProker: (item: Omit<Proker, 'id'>) => void;
  updateProkerStatus: (id: number, status: Proker['status'], realisasi?: number) => void;
  deleteProker: (id: number) => void;
  updateProkerDates: (id: number, start: string, end: string, startTime?: string, endTime?: string) => void;
  updateProkerDetails: (id: number, details: Partial<Proker>) => void;
  addInboxItem: (item: Omit<InboxItem, 'id' | 'timestamp' | 'processed'>) => void;
  processInboxItem: (id: number) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => void;
  toggleAutomationRule: (id: number) => void;
  runAutomations: () => void;
  addAspirasi: (item: Omit<Aspirasi, 'id' | 'tanggal' | 'status'>) => void;
  updateAspirasiStatus: (id: number, status: Aspirasi['status'], tanggapan?: string) => void;
  deleteAspirasi: (id: number) => void;
  addAlumni: (item: Omit<Alumni, 'id'>) => void;
  updateAlumni: (item: Alumni) => void;
  deleteAlumni: (id: number) => void;
  addVotingSession: (item: Omit<VotingSession, 'id' | 'nimSudahMemilih'>) => void;
  updateVotingStatus: (id: number, status: VotingSession['status']) => void;
  deleteVotingSession: (id: number) => void;
  castVote: (sessionId: number, kandidatId: number, nim: string) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: number) => void;
  deleteNotification: (id: number) => void;
}

const STORAGE_KEY = 'hmps_dashboard_data';

const defaultData: DataState = {
  anggota: [],
  kehadiran: [],
  keuangan: [],
  kasWajib: [],
  dokumen: [],
  inventaris: [],
  peminjaman: [],
  surat: [],
  proker: [
    {
      id: 1,
      namaProker: 'Rapat Tim Koordinasi',
      departemen: 'BPH',
      ketuaPelaksana: 'Admin',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date().toISOString().split('T')[0],
      status: 'Belum Mulai',
      kpi: 'Tersusunnya rencana kerja bulanan',
      anggaran: 0,
      realisasi: 0,
      deskripsi: 'Membahas agenda strategis organisasi untuk satu bulan ke depan.',
      labels: ['Penting', 'Internal'],
      assignee: 'Kharis'
    }
  ],
  inbox: [
    {
      id: 1,
      title: 'Email: Sponsor Proposal',
      content: 'Dari PT. Maju Jaya menanyakan proposal sponsorship untuk event milad.',
      source: 'email',
      timestamp: new Date().toISOString(),
      processed: false
    },
    {
      id: 2,
      title: 'Slack: Rapat Koordinasi',
      content: 'Pesan dari Ketua: Tolong agendakan rapat koordinasi BPH besok jam 10.',
      source: 'slack',
      timestamp: new Date().toISOString(),
      processed: false
    }
  ],
  automations: [
    {
      id: 1,
      name: 'Auto Overdue',
      trigger: 'due_date_passed',
      action: 'move_to_column',
      params: { column: 'Overdue' },
      enabled: true
    }
  ],
  aspirasi: [],
  alumni: [],
  voting: [],
  activityLogs: [],
  notifications: [],
  storageQuota: {
    used: 2400000, // Initial size of Logo HIMARS HighRes.png
    limit: 1024 * 1024 * 1024 * 1024, // 1 TB
  },
  news: [
    {
      id: 1,
      judul: 'Selamat Datang di Website HMPS ARS',
      kategori: 'pengumuman',
      isi: 'Website resmi Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit telah resmi diluncurkan. Website ini akan menjadi pusat informasi dan layanan bagi seluruh mahasiswa ARS.',
      tanggal: new Date().toLocaleDateString('id-ID'),
      waktu: new Date().toLocaleTimeString('id-ID'),
      qrCode: 'EVT-INITIAL-WELCOME',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
    }
  ],
  drive: [
    {
      id: 'folder-1',
      name: 'Dokumentasi Kegiatan',
      type: 'folder',
      parentId: null,
      department: 'medkom',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      createdBy: 'System',
      ownerId: 1,
      timestamp: Date.now() - 5000,
      isTrashed: false,
      permissions: []
    },
    {
      id: 'folder-2',
      name: 'Project Poster',
      type: 'folder',
      parentId: null,
      department: 'medkom',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      createdBy: 'System',
      ownerId: 1,
      timestamp: Date.now() - 4000,
      isTrashed: false,
      permissions: []
    },
    {
      id: 'file-1',
      name: 'Logo HIMARS HighRes.png',
      type: 'file',
      mimeType: 'image/png',
      size: 2400000,
      parentId: null,
      department: 'medkom',
      url: 'https://picsum.photos/seed/logo/800/800',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      createdBy: 'System',
      ownerId: 1,
      timestamp: Date.now() - 3000,
      isTrashed: false,
      permissions: []
    },
    {
      id: 'folder-bendahara',
      name: 'Laporan Keuangan Internal',
      type: 'folder',
      parentId: null,
      department: 'bendahara',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      createdBy: 'System',
      ownerId: 1,
      timestamp: Date.now() - 2000,
      isTrashed: false,
      permissions: []
    },
    {
      id: 'folder-sekretaris',
      name: 'Arsip Surat Masuk',
      type: 'folder',
      parentId: null,
      department: 'sekretaris',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      createdBy: 'System',
      ownerId: 1,
      timestamp: Date.now() - 1000,
      isTrashed: false,
      permissions: []
    }
  ],
  settings: {
    siteName: 'HIMARS',
    siteDescription: 'Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit Universitas Muhammadiyah Lamongan',
    memberIdFormat: 'ORG-{TIME}-{RAND}',
    primaryColor: '#f9a875',
    logoUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&w=200&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    heroTitle: 'Mewujudkan Administrator Kesehatan Masa Depan.',
    heroSubtitle: 'Wadah pengembangan diri dan kolaborasi mahasiswa Administrasi Rumah Sakit Universitas Muhammadiyah Lamongan untuk menjadi tenaga kesehatan profesional yang Islami.',
    visiMisiTitle: 'Mewujudkan Ekselensi dalam Administrasi RS.',
    visiMisiText: 'Menjadi program studi Administrasi Rumah Sakit yang terkemuka, inovatif, islami, serta unggul di bidang rekam medik dan sistem teknologi informasi kesehatan.',
    visiMisiImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    prokerImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    kontakImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=80',
    pillarImages: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    strukturHeroImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    blogHeroImageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    dokumenHeroImageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    profilHeroImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    kopSuratUrl: '',
    tandaTanganUrl: '',
    stempelUrl: '',
    youtubeUrl: 'https://www.youtube.com/@himarsumla3924',
    podcastUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    formatur: [
      { id: '1', nama: 'Ketua Umum', jabatan: 'Ketua Umum' },
      { id: '2', nama: 'Sekretaris', jabatan: 'Sekretaris' },
      { id: '3', nama: 'Bendahara', jabatan: 'Bendahara' },
    ],
    homeSections: [
      { id: 'hero', title: 'Hero Banner', enabled: true },
      { id: 'stats', title: 'Statistik & Fitur', enabled: true },
      { id: 'visi-misi', title: 'Visi & Misi', enabled: true },
      { id: 'program-kerja', title: 'Program Kerja Unggulan', enabled: true },
      { id: 'pillars', title: 'Pilar Utama (Navigasi)', enabled: true },
      { id: 'video', title: 'Video & Podcast', enabled: true },
      { id: 'kontak', title: 'Informasi Sekretariat', enabled: true },
    ],
    privacyPolicy: 'Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit (HIMARS) Universitas Muhammadiyah Lamongan menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan website kami.\n\n1. Informasi yang Kami Kumpulkan\nKami dapat mengumpulkan informasi pribadi yang Anda berikan secara langsung kepada kami, seperti:\n- Nama lengkap dan Nomor Induk Mahasiswa (NIM)\n- Alamat email dan nomor telepon\n- Data akademik terkait program studi\n- Informasi kehadiran pada acara atau kegiatan HIMARS\n\n2. Penggunaan Informasi\nInformasi yang kami kumpulkan digunakan untuk:\n- Mengelola keanggotaan dan administrasi HIMARS\n- Mencatat presensi kehadiran kegiatan melalui sistem QR Code\n- Mengirimkan informasi, pengumuman, dan pembaruan terkait kegiatan himpunan\n- Meningkatkan kualitas layanan dan program kerja HIMARS\n\n3. Keamanan Data\nKami berkomitmen untuk melindungi keamanan data pribadi Anda. Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk mencegah akses, pengungkapan, perubahan, atau penghancuran data yang tidak sah. Data Anda hanya dapat diakses oleh pengurus HIMARS yang berwenang.\n\n4. Berbagi Informasi\nKami tidak akan menjual, menyewakan, atau menukar informasi pribadi Anda kepada pihak ketiga. Kami hanya dapat membagikan informasi Anda jika diwajibkan oleh hukum atau peraturan akademik Universitas Muhammadiyah Lamongan.\n\n5. Perubahan Kebijakan Privasi\nHIMARS berhak untuk memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diumumkan melalui website ini. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan apa pun.\n\n6. Hubungi Kami\nJika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi kami melalui email di himars@umla.ac.id atau melalui kontak resmi HIMARS lainnya.',
    termsConditions: 'Selamat datang di website resmi Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit (HIMARS) Universitas Muhammadiyah Lamongan. Dengan mengakses dan menggunakan website ini, Anda menyetujui Syarat dan Ketentuan berikut.\n\n1. Penerimaan Syarat\nDengan mengakses dan menggunakan website ini, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan website ini.\n\n2. Penggunaan Website\n- Website ini ditujukan untuk memberikan informasi terkait kegiatan, program kerja, dan administrasi HIMARS UMLA.\n- Anda setuju untuk menggunakan website ini hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku.\n- Anda tidak diperkenankan menggunakan website ini dengan cara yang dapat merusak, menonaktifkan, membebani, atau mengganggu server atau jaringan yang terhubung ke website.\n- Anda tidak diperkenankan mencoba mendapatkan akses tidak sah ke bagian mana pun dari website, akun pengguna lain, atau sistem komputer.\n\n3. Hak Kekayaan Intelektual\nSeluruh konten, desain, teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, kompilasi data, dan perangkat lunak yang terdapat di website ini adalah milik HIMARS UMLA atau penyedia kontennya dan dilindungi oleh undang-undang hak cipta Indonesia dan internasional.\n\n4. Konten Pengguna\nJika Anda mengirimkan atau memposting konten ke website (misalnya, komentar, artikel, atau materi lainnya), Anda memberikan HIMARS UMLA hak non-eksklusif, bebas royalti, abadi, tidak dapat dibatalkan, dan dapat disublisensikan sepenuhnya untuk menggunakan, mereproduksi, memodifikasi, mengadaptasi, menerbitkan, menerjemahkan, membuat karya turunan dari, mendistribusikan, dan menampilkan konten tersebut di seluruh dunia dalam media apa pun.\n\n5. Tautan ke Pihak Ketiga\nWebsite ini mungkin berisi tautan ke situs web pihak ketiga yang tidak dimiliki atau dikendalikan oleh HIMARS UMLA. Kami tidak memiliki kendali atas, dan tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik dari situs web pihak ketiga mana pun.\n\n6. Penafian Jaminan\nWebsite ini disediakan "sebagaimana adanya" dan "sebagaimana tersedia". HIMARS UMLA tidak membuat pernyataan atau jaminan apa pun, tersurat maupun tersirat, mengenai pengoperasian website ini atau informasi, konten, materi, atau produk yang disertakan di website ini.\n\n7. Batasan Tanggung Jawab\nHIMARS UMLA tidak akan bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan website ini, termasuk namun tidak terbatas pada kerugian langsung, tidak langsung, insidental, hukuman, dan konsekuensial.\n\n8. Perubahan Syarat dan Ketentuan\nHIMARS UMLA berhak untuk mengubah Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan Anda yang berkelanjutan atas website ini setelah perubahan tersebut merupakan persetujuan Anda terhadap Syarat dan Ketentuan yang baru.\n\n9. Hukum yang Berlaku\nSyarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul sehubungan dengan Syarat dan Ketentuan ini akan tunduk pada yurisdiksi eksklusif pengadilan di Indonesia.'
  },
  users: [
    {
      id: 1,
      username: 'himars',
      password: 'himars123',
      nama: 'Super Admin',
      role: 'admin',
      department: 'Administrator',
      createdAt: new Date().toLocaleDateString('id-ID')
    },
    {
      id: 2,
      username: 'kharis@alishlah.sch.id',
      password: '2402070300',
      nama: 'Kharis Admin',
      role: 'admin',
      department: 'Administrator',
      createdAt: new Date().toLocaleDateString('id-ID')
    }
  ]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Force update super admin credentials and departments
        const updatedUsers = (parsed.users && parsed.users.length > 0 ? parsed.users : defaultData.users).map((u: any) => {
          let updated = { ...u };
          if (u.id === 1 || u.username === 'himars') {
            updated = { 
              ...updated, 
              username: 'himars', 
              password: 'himars123',
              department: 'Administrator' 
            };
          } else if (u.id === 2 || u.username === 'kharis@alishlah.sch.id') {
            updated = { 
              ...updated, 
              department: 'Administrator' 
            };
          }
          return updated;
        });

        // Merge saved data with defaultData to ensure new fields exist
        return {
          ...defaultData,
          ...parsed,
          aspirasi: parsed.aspirasi || [],
          alumni: parsed.alumni || [],
          voting: parsed.voting || [],
          activityLogs: parsed.activityLogs || [],
          notifications: parsed.notifications || [],
          users: updatedUsers,
          settings: {
            ...defaultData.settings,
            ...(parsed.settings || {})
          }
        };
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData(prevData => ({
            ...prevData,
            ...parsed,
            aspirasi: parsed.aspirasi || [],
            alumni: parsed.alumni || [],
            voting: parsed.voting || [],
            activityLogs: parsed.activityLogs || [],
            notifications: parsed.notifications || []
          }));
        } catch (error) {
          console.error('Failed to parse storage event data', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const generateUniqueCode = () => {
    const format = data.settings.memberIdFormat;
    const time = Date.now().toString();
    const rand = Math.random().toString(36).substr(2, 5).toUpperCase();
    const year = new Date().getFullYear().toString();
    
    return format
      .replace('{TIME}', time)
      .replace('{RAND}', rand)
      .replace('{YEAR}', year);
  };

  const addAnggota = (anggota: Omit<Anggota, 'id' | 'qrCode'>) => {
    const newAnggota: Anggota = {
      ...anggota,
      id: Date.now(),
      qrCode: generateUniqueCode(),
    };
    setData(prev => ({ ...prev, anggota: [newAnggota, ...prev.anggota] }));
  };

  const deleteAnggota = (id: number) => {
    setData(prev => ({ ...prev, anggota: prev.anggota.filter(a => a.id !== id) }));
  };

  const addKehadiran = (kehadiran: Omit<Kehadiran, 'id' | 'tanggal' | 'waktu'>) => {
    const now = new Date();
    const newKehadiran: Kehadiran = {
      ...kehadiran,
      id: Date.now(),
      tanggal: now.toLocaleDateString('id-ID'),
      waktu: now.toLocaleTimeString('id-ID'),
    };
    setData(prev => ({ ...prev, kehadiran: [newKehadiran, ...prev.kehadiran] }));
  };

  const addKeuangan = (keuangan: Omit<Keuangan, 'id' | 'tanggal'>) => {
    const newKeuangan: Keuangan = {
      ...keuangan,
      id: Date.now(),
      tanggal: new Date().toLocaleDateString('id-ID'),
    };
    setData(prev => ({ ...prev, keuangan: [newKeuangan, ...prev.keuangan] }));
  };

  const updateKasWajib = (kas: KasWajib) => {
    setData(prev => ({
      ...prev,
      kasWajib: prev.kasWajib.map(k => k.id === kas.id ? kas : k)
    }));
  };

  const generateMonthlyKas = (bulan: string, nominal: number) => {
    setData(prev => {
      const newKas: KasWajib[] = prev.anggota.map(a => ({
        id: Date.now() + Math.random(),
        anggotaId: a.id,
        bulan,
        status: 'belum',
        nominal
      }));
      return { ...prev, kasWajib: [...newKas, ...prev.kasWajib] };
    });
  };

  const addDokumen = (dokumen: Omit<Dokumen, 'id' | 'tanggal' | 'isPublic'>) => {
    const newDokumen: Dokumen = {
      ...dokumen,
      id: Date.now(),
      tanggal: new Date().toLocaleDateString('id-ID'),
      isPublic: false,
    };
    setData(prev => ({ ...prev, dokumen: [newDokumen, ...prev.dokumen] }));
  };

  const deleteDokumen = (id: number) => {
    setData(prev => ({ ...prev, dokumen: prev.dokumen.filter(d => d.id !== id) }));
  };

  const toggleDokumenPublic = (id: number) => {
    setData(prev => ({
      ...prev,
      dokumen: prev.dokumen.map(d => d.id === id ? { ...d, isPublic: !d.isPublic } : d)
    }));
  };

  const addNews = (news: Omit<News, 'id' | 'tanggal' | 'waktu' | 'qrCode'>) => {
    const now = new Date();
    const newNews: News = {
      ...news,
      id: Date.now(),
      tanggal: now.toLocaleDateString('id-ID'),
      waktu: now.toLocaleTimeString('id-ID'),
      qrCode: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    };
    setData(prev => ({ ...prev, news: [newNews, ...prev.news] }));
  };

  const deleteNews = (id: number) => {
    setData(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }));
  };

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const updateHomeSections = (sections: HomeSection[]) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, homeSections: sections }
    }));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('id-ID'),
    };
    setData(prev => ({ ...prev, users: [newUser, ...prev.users] }));
  };

  const deleteUser = (id: number) => {
    setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  };

  const updateUserRole = (id: number, role: 'admin' | 'member') => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, role } : u)
    }));
  };

  const updateUserDepartment = (id: number, department: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, department } : u)
    }));
  };

  const addDriveItem = (item: Omit<DriveItem, 'id' | 'createdAt' | 'updatedAt' | 'timestamp' | 'isTrashed' | 'permissions'>) => {
    const now = new Date();
    const newItem: DriveItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now.toLocaleString('id-ID'),
      updatedAt: now.toLocaleString('id-ID'),
      timestamp: now.getTime(),
      isTrashed: false,
      permissions: []
    };
    setData(prev => {
      const newUsed = prev.storageQuota.used + (item.size || 0);
      return { 
        ...prev, 
        drive: [newItem, ...prev.drive],
        storageQuota: {
          ...prev.storageQuota,
          used: newUsed
        }
      };
    });
    
    addActivityLog({
      userId: newItem.ownerId,
      username: newItem.createdBy,
      nama: newItem.createdBy,
      action: newItem.type === 'folder' ? 'Membuat Folder' : 'Upload File',
      details: `Membuat ${newItem.type === 'folder' ? 'folder' : 'file'} "${newItem.name}"`
    });
  };

  const trashDriveItem = (id: string) => {
    setData(prev => {
      const item = prev.drive.find(i => i.id === id);
      if (!item) return prev;
      
      const newDrive = prev.drive.map(i => {
        if (i.id === id) return { ...i, isTrashed: true, updatedAt: new Date().toLocaleString('id-ID') };
        return i;
      });

      return { ...prev, drive: newDrive };
    });
    
    const item = data.drive.find(i => i.id === id);
    if (item) {
      addActivityLog({
        userId: item.ownerId,
        username: item.createdBy,
        nama: item.createdBy,
        action: 'Hapus ke Sampah',
        details: `Memindahkan "${item.name}" ke sampah`
      });
    }
  };

  const restoreDriveItem = (id: string) => {
    setData(prev => ({
      ...prev,
      drive: prev.drive.map(i => i.id === id ? { ...i, isTrashed: false, updatedAt: new Date().toLocaleString('id-ID') } : i)
    }));
    
    const item = data.drive.find(i => i.id === id);
    if (item) {
      addActivityLog({
        userId: item.ownerId,
        username: item.createdBy,
        nama: item.createdBy,
        action: 'Memulihkan Item',
        details: `Memulihkan "${item.name}" dari sampah`
      });
    }
  };

  const permanentlyDeleteDriveItem = (id: string) => {
    setData(prev => {
      const item = prev.drive.find(i => i.id === id);
      if (!item) return prev;
      
      const toDelete = new Set([id]);
      const findChildren = (parentId: string) => {
        prev.drive.filter(i => i.parentId === parentId).forEach(child => {
          toDelete.add(child.id);
          if (child.type === 'folder') findChildren(child.id);
        });
      };
      if (item.type === 'folder') findChildren(id);
      
      const deletedSize = prev.drive
        .filter(i => toDelete.has(i.id) && i.type === 'file')
        .reduce((acc, curr) => acc + (curr.size || 0), 0);

      return { 
        ...prev, 
        drive: prev.drive.filter(i => !toDelete.has(i.id)),
        storageQuota: {
          ...prev.storageQuota,
          used: Math.max(0, prev.storageQuota.used - deletedSize)
        }
      };
    });
  };

  const deleteDriveItem = (id: string) => {
    trashDriveItem(id);
  };

  const renameDriveItem = (id: string, newName: string) => {
    setData(prev => {
      const item = prev.drive.find(i => i.id === id);
      if (item) {
        addActivityLog({
          userId: item.ownerId,
          username: item.createdBy,
          nama: item.createdBy,
          action: 'Ganti Nama',
          details: `Mengubah nama "${item.name}" menjadi "${newName}"`
        });
      }
      return {
        ...prev,
        drive: prev.drive.map(i => i.id === id ? { ...i, name: newName, updatedAt: new Date().toLocaleString('id-ID') } : i)
      };
    });
  };

  const moveDriveItem = (id: string, newParentId: string | null) => {
    setData(prev => {
      const item = prev.drive.find(i => i.id === id);
      const newParent = newParentId ? prev.drive.find(i => i.id === newParentId) : { name: 'Drive Saya' };
      
      if (item) {
        addActivityLog({
          userId: item.ownerId,
          username: item.createdBy,
          nama: item.createdBy,
          action: 'Pindahkan Item',
          details: `Memindahkan "${item.name}" ke "${newParent?.name || 'Drive Saya'}"`
        });
      }
      
      return {
        ...prev,
        drive: prev.drive.map(i => i.id === id ? { ...i, parentId: newParentId, updatedAt: new Date().toLocaleString('id-ID') } : i)
      };
    });
  };

  const shareDriveItem = (id: string, userId: number, role: 'viewer' | 'editor') => {
    setData(prev => {
      const item = prev.drive.find(i => i.id === id);
      const targetUser = prev.users.find(u => u.id === userId);
      
      if (item && targetUser) {
        addActivityLog({
          userId: item.ownerId,
          username: item.createdBy,
          nama: item.createdBy,
          action: 'Bagikan Item',
          details: `Membagikan "${item.name}" kepada ${targetUser.nama} sebagai ${role}`
        });
      }
      
      return {
        ...prev,
        drive: prev.drive.map(i => {
          if (i.id === id) {
            const newPermissions = [...i.permissions.filter(p => p.userId !== userId), { userId, role }];
            return { ...i, permissions: newPermissions, updatedAt: new Date().toLocaleString('id-ID') };
          }
          return i;
        })
      };
    });
  };

  const toggleDrivePublicLink = (id: string) => {
    setData(prev => ({
      ...prev,
      drive: prev.drive.map(i => i.id === id ? { ...i, isPublicLink: !i.isPublicLink, updatedAt: new Date().toLocaleString('id-ID') } : i)
    }));
  };

  const deleteMonthlyKas = (bulan: string) => {
    setData(prev => ({
      ...prev,
      kasWajib: prev.kasWajib.filter(k => k.bulan !== bulan)
    }));
  };

  const deleteKeuangan = (id: number) => {
    setData(prev => ({
      ...prev,
      keuangan: prev.keuangan.filter(k => k.id !== id)
    }));
  };

  const deleteKehadiran = (id: number) => {
    setData(prev => ({
      ...prev,
      kehadiran: prev.kehadiran.filter(k => k.id !== id)
    }));
  };

  const addInventaris = (item: Omit<Inventaris, 'id'>) => {
    setData(prev => ({ ...prev, inventaris: [{ ...item, id: Date.now() }, ...prev.inventaris] }));
  };

  const updateInventaris = (item: Inventaris) => {
    setData(prev => ({ ...prev, inventaris: prev.inventaris.map(i => i.id === item.id ? item : i) }));
  };

  const deleteInventaris = (id: number) => {
    setData(prev => ({ ...prev, inventaris: prev.inventaris.filter(i => i.id !== id) }));
  };

  const addPeminjaman = (item: Omit<Peminjaman, 'id'>) => {
    setData(prev => ({ ...prev, peminjaman: [{ ...item, id: Date.now() }, ...prev.peminjaman] }));
  };

  const updatePeminjamanStatus = (id: number, status: Peminjaman['status']) => {
    setData(prev => ({ ...prev, peminjaman: prev.peminjaman.map(p => p.id === id ? { ...p, status } : p) }));
  };

  const addSurat = (item: Omit<Surat, 'id'>) => {
    setData(prev => ({ ...prev, surat: [{ ...item, id: Date.now() }, ...prev.surat] }));
  };

  const updateSuratStatus = (id: number, status: Surat['status']) => {
    setData(prev => ({ ...prev, surat: prev.surat.map(s => s.id === id ? { ...s, status } : s) }));
  };

  const deleteSurat = (id: number) => {
    setData(prev => ({ ...prev, surat: prev.surat.filter(s => s.id !== id) }));
  };

  const addProker = useCallback((item: Omit<Proker, 'id'>) => {
    setData(prev => ({ ...prev, proker: [{ ...item, id: Date.now() }, ...prev.proker] }));
  }, []);

  const updateProkerStatus = useCallback((id: number, status: Proker['status'], realisasi?: number) => {
    setData(prev => ({ 
      ...prev, 
      proker: prev.proker.map(p => p.id === id ? { ...p, status, ...(realisasi !== undefined && { realisasi }) } : p) 
    }));
  }, []);

  const deleteProker = useCallback((id: number) => {
    setData(prev => ({ ...prev, proker: prev.proker.filter(p => p.id !== id) }));
  }, []);

  const updateProkerDates = useCallback((id: number, start: string, end: string, startTime?: string, endTime?: string) => {
    setData(prev => ({
      ...prev,
      proker: prev.proker.map(p => p.id === id ? { 
        ...p, 
        tanggalMulai: start, 
        tanggalSelesai: end,
        ...(startTime && { waktuMulai: startTime }),
        ...(endTime && { waktuSelesai: endTime })
      } : p)
    }));
  }, []);

  const updateProkerDetails = useCallback((id: number, details: Partial<Proker>) => {
    setData(prev => ({
      ...prev,
      proker: prev.proker.map(p => p.id === id ? { ...p, ...details } : p)
    }));
  }, []);

  const addInboxItem = useCallback((item: Omit<InboxItem, 'id' | 'timestamp' | 'processed'>) => {
    const newItem: InboxItem = {
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      processed: false
    };
    setData(prev => ({ ...prev, inbox: [newItem, ...prev.inbox] }));
  }, []);

  const processInboxItem = useCallback((id: number) => {
    setData(prev => ({
      ...prev,
      inbox: prev.inbox.map(item => item.id === id ? { ...item, processed: true } : item)
    }));
  }, []);

  const addAutomationRule = useCallback((rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = { ...rule, id: Date.now() };
    setData(prev => ({ ...prev, automations: [...prev.automations, newRule] }));
  }, []);

  const toggleAutomationRule = useCallback((id: number) => {
    setData(prev => ({
      ...prev,
      automations: prev.automations.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    }));
  }, []);

  const runAutomations = useCallback(() => {
    setData(prev => {
      let updatedProker = [...prev.proker];
      const now = new Date().toISOString().split('T')[0];

      prev.automations.forEach(rule => {
        if (!rule.enabled) return;

        if (rule.trigger === 'due_date_passed') {
          updatedProker = updatedProker.map(p => {
            if (p.status !== 'Selesai' && p.tanggalSelesai < now) {
              return { ...p, status: 'Overdue' };
            }
            return p;
          });
        }
      });

      return { ...prev, proker: updatedProker };
    });
  }, []);

  const addAspirasi = (item: Omit<Aspirasi, 'id' | 'tanggal' | 'status'>) => {
    setData(prev => ({ 
      ...prev, 
      aspirasi: [{ ...item, id: Date.now(), tanggal: new Date().toLocaleDateString('id-ID'), status: 'Menunggu' }, ...(prev.aspirasi || [])] 
    }));
  };

  const updateAspirasiStatus = (id: number, status: Aspirasi['status'], tanggapan?: string) => {
    setData(prev => ({ 
      ...prev, 
      aspirasi: (prev.aspirasi || []).map(a => a.id === id ? { ...a, status, ...(tanggapan !== undefined && { tanggapan }) } : a) 
    }));
  };

  const deleteAspirasi = (id: number) => {
    setData(prev => ({ ...prev, aspirasi: (prev.aspirasi || []).filter(a => a.id !== id) }));
  };

  const addAlumni = (item: Omit<Alumni, 'id'>) => {
    setData(prev => ({ ...prev, alumni: [{ ...item, id: Date.now() }, ...(prev.alumni || [])] }));
  };

  const updateAlumni = (item: Alumni) => {
    setData(prev => ({ ...prev, alumni: (prev.alumni || []).map(a => a.id === item.id ? item : a) }));
  };

  const deleteAlumni = (id: number) => {
    setData(prev => ({ ...prev, alumni: (prev.alumni || []).filter(a => a.id !== id) }));
  };

  const addVotingSession = (item: Omit<VotingSession, 'id' | 'nimSudahMemilih'>) => {
    setData(prev => ({ 
      ...prev, 
      voting: [{ ...item, id: Date.now(), nimSudahMemilih: [] }, ...(prev.voting || [])] 
    }));
  };

  const updateVotingStatus = (id: number, status: VotingSession['status']) => {
    setData(prev => ({ 
      ...prev, 
      voting: (prev.voting || []).map(v => v.id === id ? { ...v, status } : v) 
    }));
  };

  const deleteVotingSession = (id: number) => {
    setData(prev => ({ ...prev, voting: (prev.voting || []).filter(v => v.id !== id) }));
  };

  const castVote = (sessionId: number, kandidatId: number, nim: string) => {
    setData(prev => ({
      ...prev,
      voting: (prev.voting || []).map(v => {
        if (v.id === sessionId) {
          const terdaftar = v.nimTerdaftar || [];
          const sudahMemilih = v.nimSudahMemilih || [];
          
          if (!terdaftar.includes(nim)) return v; // Not registered
          if (sudahMemilih.includes(nim)) return v; // Already voted
          
          return {
            ...v,
            nimSudahMemilih: [...sudahMemilih, nim],
            kandidat: v.kandidat.map(k => k.id === kandidatId ? { ...k, jumlahSuara: k.jumlahSuara + 1 } : k)
          };
        }
        return v;
      })
    }));
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
    };
    setData(prev => ({ ...prev, activityLogs: [newLog, ...(prev.activityLogs || [])] }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      read: false,
    };
    setData(prev => ({ ...prev, notifications: [newNotification, ...(prev.notifications || [])] }));
  };

  const markNotificationRead = (id: number) => {
    setData(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const deleteNotification = (id: number) => {
    setData(prev => ({
      ...prev,
      notifications: (prev.notifications || []).filter(n => n.id !== id)
    }));
  };

  return (
    <DataContext.Provider value={{
      data, setData, addAnggota, deleteAnggota, addKehadiran, addKeuangan, updateKasWajib, generateMonthlyKas, addDokumen, deleteDokumen, toggleDokumenPublic, addNews, deleteNews, updateSettings, addUser, deleteUser, updateUserRole, updateHomeSections, updateUserDepartment, 
      addDriveItem, deleteDriveItem, trashDriveItem, restoreDriveItem, permanentlyDeleteDriveItem, renameDriveItem, moveDriveItem, shareDriveItem, toggleDrivePublicLink,
      deleteMonthlyKas, deleteKeuangan, deleteKehadiran,
      addInventaris, updateInventaris, deleteInventaris, addPeminjaman, updatePeminjamanStatus, addSurat, updateSuratStatus, deleteSurat, addProker, updateProkerStatus, deleteProker, updateProkerDates, updateProkerDetails, addInboxItem, processInboxItem, addAutomationRule, toggleAutomationRule, runAutomations,
      addAspirasi, updateAspirasiStatus, deleteAspirasi, addAlumni, updateAlumni, deleteAlumni, addVotingSession, updateVotingStatus, deleteVotingSession, castVote, addActivityLog,
      addNotification, markNotificationRead, deleteNotification
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
