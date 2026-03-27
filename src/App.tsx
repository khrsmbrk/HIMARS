/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './store/DataContext';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/public/Home';
import Struktur from './pages/public/Struktur';
import Blog from './pages/public/Blog';
import Dokumen from './pages/public/Dokumen';
import ProfilProdi from './pages/public/ProfilProdi';
import Presensi from './pages/public/Presensi';
import DepartmentDetail from './pages/public/DepartmentDetail';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsConditions from './pages/Legal';
import Aspirasi from './pages/public/Aspirasi';
import Voting from './pages/public/Voting';
import Pendaftaran from './pages/public/Pendaftaran';
import Calendar from './pages/public/Calendar';

// Anggota Pages
import ProfilAnggota from './pages/anggota/Profil';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Anggota from './pages/admin/Anggota';
import PendaftaranAdmin from './pages/admin/PendaftaranAdmin';
import PresensiQRAdmin from './pages/admin/PresensiQRAdmin';
import Keuangan from './pages/admin/Keuangan';
import DokumenAdmin from './pages/admin/DokumenAdmin';
import NewsAdmin from './pages/admin/NewsAdmin';
import DriveAdmin from './pages/admin/DriveAdmin';
import Settings from './pages/admin/Settings';
import Register from './pages/admin/Register';
import UserManagement from './pages/admin/UserManagement';
import InventarisAdmin from './pages/admin/InventarisAdmin';
import SuratAdmin from './pages/admin/SuratAdmin';
import ProkerAdmin from './pages/admin/ProkerAdmin';
import AspirasiAdmin from './pages/admin/AspirasiAdmin';
import AlumniAdmin from './pages/admin/AlumniAdmin';
import VotingAdmin from './pages/admin/VotingAdmin';
import Forum from './pages/admin/Forum';
import Reports from './pages/admin/Reports';
import Panduan from './pages/admin/Panduan';
import BackupRestore from './pages/admin/BackupRestore';

// Public Layout
import PublicLayout from './components/PublicLayout';

import MemberProfile from './pages/member/Profile';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="profil" element={<ProfilProdi />} />
            <Route path="struktur" element={<Struktur />} />
            <Route path="struktur/:id" element={<DepartmentDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="dokumen" element={<Dokumen />} />
            <Route path="presensi" element={<Presensi />} />
            <Route path="pendaftaran" element={<Pendaftaran />} />
            <Route path="daftar" element={<Navigate to="/pendaftaran" replace />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="aspirasi" element={<Aspirasi />} />
            <Route path="voting" element={<Voting />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsConditions />} />
          </Route>

          {/* Admin Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member Route */}
          <Route path="/anggota/profil" element={<ProtectedRoute allowedRoles={['anggota', 'admin', 'superadmin']}><PublicLayout /></ProtectedRoute>}>
            <Route index element={<ProfilAnggota />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="drive" element={<DriveAdmin />} />
            <Route path="anggota" element={<Anggota />} />
            <Route path="pendaftaran" element={<PendaftaranAdmin />} />
            <Route path="presensi-qr" element={<PresensiQRAdmin />} />
            <Route path="keuangan" element={<Keuangan />} />
            <Route path="dokumen" element={<DokumenAdmin />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="inventaris" element={<InventarisAdmin />} />
            <Route path="surat" element={<SuratAdmin />} />
            <Route path="proker" element={<ProkerAdmin />} />
            <Route path="aspirasi" element={<AspirasiAdmin />} />
            <Route path="alumni" element={<AlumniAdmin />} />
            <Route path="voting" element={<VotingAdmin />} />
            <Route path="forum" element={<Forum />} />
            <Route path="reports" element={<Reports />} />
            <Route path="panduan" element={<Panduan />} />
            <Route path="backup" element={<BackupRestore />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}
