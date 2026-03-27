import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';

import { ProkerStage } from '../components/ProkerStepper';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'email' | 'tel' | 'file';
  options?: string[]; // For select/radio
  required: boolean;
}

export interface FormAttachment {
  id: string;
  name: string;
  dataUrl: string;
}

export interface FormSettings {
  isActive: boolean;
  eventCategory?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  interviewStartDate?: string;
  interviewEndDate?: string;
  announcementDate?: string;
  teksPengumuman: string;
  fields: FormField[];
  attachments?: FormAttachment[];
}

export interface Pendaftaran {
  id: number;
  namaLengkap: string;
  nim: string;
  angkatan: string;
  noHp: string;
  semester?: string;
  motivasi?: string;
  bidangMinat?: string;
  alasanBidang?: string;
  email?: string;
  password?: string;
  foto?: string;
  suratPernyataan?: string;
  buktiFollow?: string;
  tanggalDaftar: string;
  tahap: 'Berkas' | 'Wawancara' | 'Pengumuman' | 'Selesai';
  status: 'Menunggu Berkas' | 'Menuju Wawancara' | 'Menunggu Pengumuman' | 'Diterima' | 'Tidak Lulus';
  formDataDinamis?: Record<string, any>;
  fileUploads?: { label: string; url: string }[];
  eventCategory?: string;
}

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

export interface Presensi {
  idPresensi: string;
  idAcara: string;
  idAnggota: string;
  waktuPresensi: string;
  status?: "HADIR" | "TERLAMBAT" | "IZIN";
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

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  status: 'Akan Datang' | 'Berlangsung' | 'Selesai';
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
  // Workflow fields
  tahapSaatIni?: ProkerStage;
  tanggalPengajuan?: string;
  tanggalPersetujuan?: string;
  tanggalSelesaiTahap?: string;
  idPenanggungJawab?: number;
  evaluasi?: {
    apaYangBerhasil: string;
    yangPerluDiperbaiki: string;
    rekomendasiTahunDepan: string;
  };
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
  angkatan: string;
  tahunLulus: string;
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
  role: 'admin' | 'member' | 'anggota';
  department?: string;
  nim?: string;
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

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  date: string;
  category: string;
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

export interface JadwalPendaftaran {
  bukaPendaftaran: string;
  tutupPendaftaran: string;
  mulaiSeleksi: string;
  selesaiSeleksi: string;
  mulaiWawancara: string;
  selesaiWawancara: string;
  pengumumanResmi: string;
  teksPengumuman: string;
}

interface DataState {
  pendaftaran: Pendaftaran[];
  anggota: Anggota[];
  kehadiran: Kehadiran[];
  presensi: Presensi[];
  keuangan: Keuangan[];
  kasWajib: KasWajib[];
  dokumen: Dokumen[];
  events: Event[];
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
  gallery: GalleryItem[];
  settings: WebsiteSettings;
  users: User[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  storageQuota: {
    used: number;
    limit: number;
  };
  jadwalPendaftaran: JadwalPendaftaran | null;
  formSettings: FormSettings;
}

interface DataContextType {
  data: DataState;
  setData: React.Dispatch<React.SetStateAction<DataState>>;
  updateJadwalPendaftaran: (jadwal: JadwalPendaftaran) => void;
  updateFormSettings: (settings: FormSettings) => void;
  addPendaftaran: (pendaftaran: Omit<Pendaftaran, 'id' | 'tanggalDaftar' | 'status' | 'tahap'>) => void;
  updatePendaftaranStatus: (id: number, status: Pendaftaran['status'], tahap: Pendaftaran['tahap']) => void;
  deletePendaftaran: (id: number) => void;
  addAnggota: (anggota: Omit<Anggota, 'id' | 'qrCode'>) => void;
  deleteAnggota: (id: number) => void;
  addKehadiran: (kehadiran: Omit<Kehadiran, 'id' | 'tanggal' | 'waktu'>) => void;
  addPresensi: (presensi: Omit<Presensi, 'idPresensi' | 'waktuPresensi'>) => void;
  deletePresensi: (idPresensi: string) => void;
  addKeuangan: (keuangan: Omit<Keuangan, 'id' | 'tanggal'>) => void;
  updateKasWajib: (kas: KasWajib) => void;
  generateMonthlyKas: (bulan: string, nominal: number) => void;
  addDokumen: (dokumen: Omit<Dokumen, 'id' | 'tanggal' | 'isPublic'>) => void;
  deleteDokumen: (id: number) => void;
  toggleDokumenPublic: (id: number) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
  addNews: (news: Omit<News, 'id' | 'qrCode'> & { tanggal?: string, waktu?: string }) => void;
  deleteNews: (id: number) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  deleteGalleryItem: (id: number) => void;
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  updateHomeSections: (sections: HomeSection[]) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (id: number) => void;
  updateUserRole: (id: number, role: 'admin' | 'member' | 'anggota') => void;
  updateUserDepartment: (id: number, department: string) => void;
  resetUserPassword: (id: number, newPassword?: string) => void;
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
  updateTahapProker: (id: number, tahapBaru: Proker['tahapSaatIni'], evaluasi?: Proker['evaluasi']) => void;
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
  pendaftaran: [],
  anggota: [],
  kehadiran: [],
  presensi: [],
  keuangan: [],
  kasWajib: [],
  dokumen: [],
  events: [],
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
  gallery: [
    {
      id: 1,
      title: 'Seminar Nasional ARS 2025',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      date: '2025-10-15',
      category: 'Kegiatan'
    },
    {
      id: 2,
      title: 'Bakti Sosial Kesehatan',
      imageUrl: 'https://images.unsplash.com/photo-1593113563332-f144318182b8?auto=format&fit=crop&w=800&q=80',
      date: '2025-08-20',
      category: 'Pengmas'
    }
  ],
  activityLogs: [],
  notifications: [],
  storageQuota: {
    used: 2400000, // Initial size of Logo HIMARS HighRes.png
    limit: 1024 * 1024 * 1024 * 1024, // 1 TB
  },
  jadwalPendaftaran: null,
  formSettings: {
    isActive: true,
    eventCategory: 'Open Recruitment Pengurus HIMARS',
    title: 'Open Recruitment Pengurus HIMARS 2026',
    description: 'Silakan isi formulir di bawah ini dengan data yang sebenar-benarnya.',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    interviewStartDate: '',
    interviewEndDate: '',
    announcementDate: '',
    teksPengumuman: 'Saat ini tidak ada pendaftaran yang sedang berlangsung.',
    fields: [
      { id: 'f1', label: 'Angkatan', type: 'select', options: ['2023', '2024', '2025'], required: true },
      { id: 'f2', label: 'Motivasi Bergabung', type: 'textarea', required: true },
      { id: 'f3', label: 'Pilihan Departemen', type: 'select', options: ['BPH', 'Medkom', 'PSDM', 'Litbang', 'Kewirausahaan'], required: true }
    ]
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
    privacyPolicy: 'Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit (HIMARS) Universitas Muhammadiyah Lamongan menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan HIMARS Workspace.\n\n1. Informasi yang Kami Kumpulkan\nKami mengumpulkan informasi yang Anda berikan secara langsung melalui sistem kami, termasuk namun tidak terbatas pada:\n- Identitas Pribadi: Nama lengkap, Nomor Induk Mahasiswa (NIM), program studi, dan angkatan.\n- Informasi Kontak: Alamat email, nomor telepon, dan tautan media sosial.\n- Data Pendaftaran: Berkas unggahan (foto profil, surat kesanggupan, portofolio, dll) yang disubmit melalui form pendaftaran kegiatan atau kepanitiaan.\n- Data Kehadiran: Rekam jejak presensi melalui pemindaian QR Code pada setiap acara HIMARS.\n- Data Aktivitas: Interaksi di Forum Internal, riwayat pengajuan Program Kerja (Proker), dan partisipasi kepanitiaan.\n\n2. Penggunaan Informasi\nInformasi yang dikumpulkan digunakan secara eksklusif untuk keperluan organisasi, meliputi:\n- Verifikasi identitas anggota dan alumni HIMARS.\n- Pengelolaan administrasi, termasuk E-Arsip Surat dan Database Alumni.\n- Perekaman presensi kegiatan secara real-time dan akurat.\n- Proses seleksi pendaftaran kepanitiaan atau acara melalui evaluasi berkas yang diunggah.\n- Pelaporan otomatis (Laporan Kegiatan, Keuangan, dan Proker) untuk transparansi organisasi.\n- Komunikasi internal dan penyebaran informasi melalui Forum Internal.\n\n3. Keamanan dan Penyimpanan Data\nKami menerapkan standar keamanan yang ketat untuk melindungi data Anda:\n- Akses Terbatas: Data sensitif hanya dapat diakses oleh pengurus HIMARS yang memiliki wewenang (Admin, BPH, Kadiv) melalui sistem login terenkripsi.\n- Penyimpanan Lokal & Cloud: Data disimpan secara aman menggunakan teknologi penyimpanan modern dengan enkripsi standar industri.\n- Retensi Data: Dokumen pendaftaran dan arsip akan disimpan selama masa kepengurusan dan diarsipkan sesuai pedoman administrasi HIMARS.\n\n4. Berbagi Informasi\nKami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga di luar Universitas Muhammadiyah Lamongan tanpa persetujuan eksplisit Anda, kecuali diwajibkan oleh hukum atau peraturan akademik universitas.\n\n5. Hak Pengguna\nSebagai pengguna HIMARS Workspace, Anda berhak untuk:\n- Mengakses dan memperbarui profil serta data pribadi Anda.\n- Meminta penghapusan berkas pendaftaran setelah periode kegiatan berakhir (dengan menghubungi administrator).\n- Mengontrol visibilitas informasi tertentu di Forum Internal.\n\n6. Perubahan Kebijakan\nKebijakan Privasi ini dapat diperbarui secara berkala untuk menyesuaikan dengan penambahan fitur baru di HIMARS Workspace. Setiap perubahan signifikan akan diinformasikan melalui dashboard utama atau email.\n\n7. Hubungi Kami\nJika Anda memiliki pertanyaan terkait privasi dan keamanan data, silakan hubungi kami melalui email di himars@umla.ac.id atau melalui fitur "Lapor Bug" di dalam sistem.',
    termsConditions: 'Selamat datang di HIMARS Workspace, platform digital resmi Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit (HIMARS) Universitas Muhammadiyah Lamongan. Dengan mengakses dan menggunakan sistem ini, Anda menyetujui Syarat dan Ketentuan berikut.\n\n1. Ketentuan Penggunaan Platform\n- HIMARS Workspace adalah platform internal yang ditujukan untuk pengurus, anggota, dan alumni HIMARS UMLA.\n- Akses ke fitur administratif (E-Arsip, Keuangan, Inventaris, Tracking Proker) dibatasi sesuai dengan peran dan divisi masing-masing pengguna (Role-Based Access Control).\n- Pengguna wajib menjaga kerahasiaan kredensial login dan bertanggung jawab atas semua aktivitas yang terjadi di bawah akun mereka.\n\n2. Pendaftaran dan Pengunggahan Berkas\n- Saat menggunakan fitur Pendaftaran, pengguna setuju untuk memberikan informasi yang akurat, terkini, dan lengkap.\n- Pengguna bertanggung jawab penuh atas legalitas dan kebenaran berkas yang diunggah (foto, surat pernyataan, dokumen PDF, dll).\n- HIMARS berhak menolak pendaftaran atau menghapus berkas yang mengandung unsur SARA, pornografi, malware, atau melanggar norma akademik.\n\n3. Presensi QR dan Kehadiran\n- Fitur Presensi QR digunakan untuk mencatat kehadiran resmi dalam acara HIMARS.\n- Penyalahgunaan sistem presensi (seperti memindai QR code untuk orang lain yang tidak hadir) merupakan pelanggaran kode etik organisasi dan dapat dikenakan sanksi administratif.\n\n4. Forum Internal dan Komunikasi\n- Forum Internal disediakan untuk diskusi konstruktif, berbagi ide, dan koordinasi kepanitiaan.\n- Pengguna dilarang melakukan spamming, ujaran kebencian, perundungan (bullying), atau menyebarkan informasi rahasia organisasi ke pihak luar.\n- Administrator berhak memoderasi, mengedit, atau menghapus postingan yang melanggar ketentuan ini.\n\n5. Hak Kekayaan Intelektual\n- Seluruh struktur sistem, desain antarmuka, logo, dan alur kerja (workflow) HIMARS Workspace adalah hak milik intelektual HIMARS UMLA.\n- Dokumen arsip, proposal proker, dan laporan keuangan yang dihasilkan melalui sistem ini adalah dokumen rahasia milik organisasi dan tidak boleh disebarluaskan tanpa izin tertulis dari Ketua Himpunan.\n\n6. Ketersediaan Layanan dan Pemeliharaan\n- Kami berusaha menjaga HIMARS Workspace beroperasi 24/7, namun tidak menjamin bahwa sistem akan selalu bebas dari gangguan atau error.\n- Pemeliharaan sistem (maintenance) dapat dilakukan sewaktu-waktu untuk peningkatan fitur, yang mungkin menyebabkan penghentian layanan sementara.\n\n7. Batasan Tanggung Jawab\n- HIMARS UMLA tidak bertanggung jawab atas kehilangan data yang disebabkan oleh kelalaian pengguna, kegagalan perangkat keras pengguna, atau serangan siber di luar kendali wajar kami.\n- Segala keputusan organisasi yang diambil berdasarkan data dari Laporan Otomatis sistem adalah tanggung jawab penuh pengurus yang menjabat.\n\n8. Perubahan Syarat dan Ketentuan\nHIMARS berhak memodifikasi Syarat dan Ketentuan ini kapan saja. Penggunaan berkelanjutan atas HIMARS Workspace setelah perubahan menandakan persetujuan Anda terhadap ketentuan yang direvisi.\n\n9. Hukum yang Berlaku\nSyarat dan Ketentuan ini tunduk pada peraturan akademik Universitas Muhammadiyah Lamongan dan hukum yang berlaku di Republik Indonesia.'
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
  const [data, setData] = useState<DataState>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await localforage.getItem<DataState>(STORAGE_KEY);
        if (saved) {
          // Force update super admin credentials and departments
          const updatedUsers = (saved.users && saved.users.length > 0 ? saved.users : defaultData.users).map((u: any) => {
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

          setData({
            ...defaultData,
            ...saved,
            settings: {
              ...defaultData.settings,
              ...(saved.settings || {})
            },
            pendaftaran: saved.pendaftaran || [],
            anggota: saved.anggota || [],
            kehadiran: saved.kehadiran || [],
            presensi: saved.presensi || [],
            keuangan: saved.keuangan || [],
            kasWajib: saved.kasWajib || [],
            dokumen: saved.dokumen || [],
            news: saved.news || [],
            drive: saved.drive || [],
            inventaris: saved.inventaris || [],
            peminjaman: saved.peminjaman || [],
            surat: saved.surat || [],
            proker: saved.proker || [],
            inbox: saved.inbox || [],
            automations: saved.automations || [],
            aspirasi: saved.aspirasi || [],
            alumni: saved.alumni || [],
            voting: saved.voting || [],
            gallery: saved.gallery || [],
            activityLogs: saved.activityLogs || [],
            notifications: saved.notifications || [],
            users: updatedUsers,
            jadwalPendaftaran: saved.jadwalPendaftaran || null
          });
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localforage.setItem(STORAGE_KEY, data).catch(err => console.error('Failed to save data', err));
    }
  }, [data, isLoaded]);

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

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;
  }

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

  const updateJadwalPendaftaran = (jadwal: JadwalPendaftaran) => {
    setData(prev => ({ ...prev, jadwalPendaftaran: jadwal }));
  };

  const updateFormSettings = (settings: FormSettings) => {
    setData(prev => ({ ...prev, formSettings: settings }));
  };

  const addPendaftaran = (pendaftaran: Omit<Pendaftaran, 'id' | 'tanggalDaftar' | 'status' | 'tahap'>) => {
    const newPendaftaran: Pendaftaran = {
      ...pendaftaran,
      id: Date.now(),
      tanggalDaftar: new Date().toISOString(),
      tahap: 'Berkas',
      status: 'Menunggu Berkas',
    };
    setData(prev => ({ ...prev, pendaftaran: [newPendaftaran, ...(prev.pendaftaran || [])] }));
  };

  const updatePendaftaranStatus = (id: number, status: Pendaftaran['status'], tahap: Pendaftaran['tahap']) => {
    setData(prev => ({
      ...prev,
      pendaftaran: (prev.pendaftaran || []).map(p => p.id === id ? { ...p, status, tahap } : p)
    }));
  };

  const deletePendaftaran = (id: number) => {
    setData(prev => ({ ...prev, pendaftaran: (prev.pendaftaran || []).filter(p => p.id !== id) }));
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

  const addPresensi = (presensi: Omit<Presensi, 'idPresensi' | 'waktuPresensi'>) => {
    const now = new Date();
    const newPresensi: Presensi = {
      ...presensi,
      idPresensi: Date.now().toString(),
      waktuPresensi: now.toISOString(),
      status: presensi.status || 'HADIR'
    };
    setData(prev => ({ ...prev, presensi: [newPresensi, ...prev.presensi] }));
  };

  const deletePresensi = (idPresensi: string) => {
    setData(prev => ({
      ...prev,
      presensi: prev.presensi.filter(p => p.idPresensi !== idPresensi)
    }));
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

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now(),
    };
    setData(prev => ({ ...prev, events: [newEvent, ...prev.events] }));
  };

  const updateEvent = (event: Event) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === event.id ? event : e)
    }));
  };

  const deleteEvent = (id: number) => {
    setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  };

  const addNews = (news: Omit<News, 'id' | 'qrCode'> & { tanggal?: string, waktu?: string }) => {
    const now = new Date();
    const newNews: News = {
      ...news,
      id: Date.now(),
      tanggal: news.tanggal || now.toLocaleDateString('id-ID'),
      waktu: news.waktu || now.toLocaleTimeString('id-ID'),
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

  const updateUserRole = (id: number, role: 'admin' | 'member' | 'anggota') => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, role } : u)
    }));
  };

  const resetUserPassword = (id: number, newPassword?: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => {
        if (u.id === id) {
          return { ...u, password: newPassword || u.nim || u.username };
        }
        return u;
      })
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
    setData(prev => {
      // Decrease stock
      const newInventaris = prev.inventaris.map(inv => {
        if (inv.id === item.inventarisId) {
          return { ...inv, jumlah: Math.max(0, inv.jumlah - 1) };
        }
        return inv;
      });
      return { 
        ...prev, 
        peminjaman: [{ ...item, id: Date.now() }, ...prev.peminjaman],
        inventaris: newInventaris
      };
    });
  };

  const updatePeminjamanStatus = (id: number, status: Peminjaman['status']) => {
    setData(prev => {
      const peminjaman = prev.peminjaman.find(p => p.id === id);
      if (!peminjaman) return prev;

      let newInventaris = prev.inventaris;
      
      // If returning, increase stock
      if (status === 'Dikembalikan' && peminjaman.status !== 'Dikembalikan') {
        newInventaris = prev.inventaris.map(inv => {
          if (inv.id === peminjaman.inventarisId) {
            return { ...inv, jumlah: inv.jumlah + 1 };
          }
          return inv;
        });
      } else if (status !== 'Dikembalikan' && peminjaman.status === 'Dikembalikan') {
        // If changing from returned to something else, decrease stock
        newInventaris = prev.inventaris.map(inv => {
          if (inv.id === peminjaman.inventarisId) {
            return { ...inv, jumlah: Math.max(0, inv.jumlah - 1) };
          }
          return inv;
        });
      }

      return { 
        ...prev, 
        peminjaman: prev.peminjaman.map(p => p.id === id ? { ...p, status } : p),
        inventaris: newInventaris
      };
    });
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

  const addProker = (item: Omit<Proker, 'id'>) => {
    setData(prev => ({ ...prev, proker: [{ ...item, id: Date.now() }, ...prev.proker] }));
  };

  const updateProkerStatus = (id: number, status: Proker['status'], realisasi?: number) => {
    setData(prev => ({ 
      ...prev, 
      proker: prev.proker.map(p => p.id === id ? { ...p, status, ...(realisasi !== undefined && { realisasi }) } : p) 
    }));
  };

  const updateTahapProker = (id: number, tahapBaru: Proker['tahapSaatIni'], evaluasi?: Proker['evaluasi']) => {
    setData(prev => ({
      ...prev,
      proker: prev.proker.map(p => {
        if (p.id === id) {
          const now = new Date().toISOString();
          let updates: Partial<Proker> = { tahapSaatIni: tahapBaru };
          
          if (tahapBaru === ProkerStage.PENGAJUAN) updates.tanggalPengajuan = now;
          if (tahapBaru === ProkerStage.DISETUJUI) updates.tanggalPersetujuan = now;
          if (tahapBaru === ProkerStage.SELESAI) updates.tanggalSelesaiTahap = now;
          if (evaluasi) updates.evaluasi = evaluasi;

          return { ...p, ...updates };
        }
        return p;
      })
    }));
  };

  const deleteProker = (id: number) => {
    setData(prev => ({ ...prev, proker: prev.proker.filter(p => p.id !== id) }));
  };

  const updateProkerDates = (id: number, start: string, end: string, startTime?: string, endTime?: string) => {
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
  };

  const updateProkerDetails = (id: number, details: Partial<Proker>) => {
    setData(prev => ({
      ...prev,
      proker: prev.proker.map(p => p.id === id ? { ...p, ...details } : p)
    }));
  };

  const addInboxItem = (item: Omit<InboxItem, 'id' | 'timestamp' | 'processed'>) => {
    const newItem: InboxItem = {
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      processed: false
    };
    setData(prev => ({ ...prev, inbox: [newItem, ...prev.inbox] }));
  };

  const processInboxItem = (id: number) => {
    setData(prev => ({
      ...prev,
      inbox: prev.inbox.map(item => item.id === id ? { ...item, processed: true } : item)
    }));
  };

  const addAutomationRule = (rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = { ...rule, id: Date.now() };
    setData(prev => ({ ...prev, automations: [...prev.automations, newRule] }));
  };

  const toggleAutomationRule = (id: number) => {
    setData(prev => ({
      ...prev,
      automations: prev.automations.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    }));
  };

  const runAutomations = () => {
    setData(prev => {
      let updatedProker = [...prev.proker];
      let hasChanges = false;
      const now = new Date().toISOString().split('T')[0];

      prev.automations.forEach(rule => {
        if (!rule.enabled) return;

        if (rule.trigger === 'due_date_passed') {
          updatedProker = updatedProker.map(p => {
            if (p.status !== 'Selesai' && p.tanggalSelesai < now && p.status !== 'Overdue') {
              hasChanges = true;
              return { ...p, status: 'Overdue' };
            }
            return p;
          });
        }
      });

      if (!hasChanges) return prev;
      return { ...prev, proker: updatedProker };
    });
  };

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

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    setData(prev => ({
      ...prev,
      gallery: [{ ...item, id: Date.now(), date: new Date().toLocaleDateString('id-ID') }, ...(prev.gallery || [])]
    }));
  };

  const deleteGalleryItem = (id: number) => {
    setData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter(g => g.id !== id)
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
      data, setData, updateJadwalPendaftaran, updateFormSettings, addPendaftaran, updatePendaftaranStatus, deletePendaftaran, addAnggota, deleteAnggota, addKehadiran, addPresensi, deletePresensi, addKeuangan, updateKasWajib, generateMonthlyKas, addDokumen, deleteDokumen, toggleDokumenPublic, addEvent, updateEvent, deleteEvent, addNews, deleteNews, addGalleryItem, deleteGalleryItem, updateSettings, addUser, deleteUser, updateUserRole, resetUserPassword, updateHomeSections, updateUserDepartment, 
      addDriveItem, deleteDriveItem, trashDriveItem, restoreDriveItem, permanentlyDeleteDriveItem, renameDriveItem, moveDriveItem, shareDriveItem, toggleDrivePublicLink,
      deleteMonthlyKas, deleteKeuangan, deleteKehadiran,
      addInventaris, updateInventaris, deleteInventaris, addPeminjaman, updatePeminjamanStatus, addSurat, updateSuratStatus, deleteSurat, addProker, updateProkerStatus, updateTahapProker, deleteProker, updateProkerDates, updateProkerDetails, addInboxItem, processInboxItem, addAutomationRule, toggleAutomationRule, runAutomations,
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
