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
import TermsConditions from './pages/public/TermsConditions';
import Aspirasi from './pages/public/Aspirasi';
import Voting from './pages/public/Voting';
import Pendaftaran from './pages/public/Pendaftaran';
import Gallery from './pages/public/Gallery';
import Calendar from './pages/public/Calendar';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Anggota from './pages/admin/Anggota';
import Kehadiran from './pages/admin/Kehadiran';
import Keuangan from './pages/admin/Keuangan';
import DokumenAdmin from './pages/admin/DokumenAdmin';
import NewsAdmin from './pages/admin/NewsAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
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

// Public Layout
import PublicLayout from './components/PublicLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
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
            <Route path="gallery" element={<Gallery />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="aspirasi" element={<Aspirasi />} />
            <Route path="voting" element={<Voting />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsConditions />} />
          </Route>

          {/* Admin Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="drive" element={<DriveAdmin />} />
            <Route path="anggota" element={<Anggota />} />
            <Route path="kehadiran" element={<Kehadiran />} />
            <Route path="keuangan" element={<Keuangan />} />
            <Route path="dokumen" element={<DokumenAdmin />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="inventaris" element={<InventarisAdmin />} />
            <Route path="surat" element={<SuratAdmin />} />
            <Route path="proker" element={<ProkerAdmin />} />
            <Route path="aspirasi" element={<AspirasiAdmin />} />
            <Route path="alumni" element={<AlumniAdmin />} />
            <Route path="voting" element={<VotingAdmin />} />
            <Route path="forum" element={<Forum />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}
