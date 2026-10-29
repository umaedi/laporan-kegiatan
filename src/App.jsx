import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReportProvider } from './context/ReportContext';
import MobileAppShell from './components/layout/MobileAppShell';
import HomePage from './pages/HomePage';
import ReportListPage from './pages/ReportListPage';
import CreateReportPage from './pages/CreateReportPage';
import ReportDetailPage from './pages/ReportDetailPage';
import AppreciationPage from './pages/AppreciationPage';
import ProfilePage from './pages/ProfilePage';
import AdminAuditPage from './pages/admin/AdminAuditPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <ReportProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<MobileAppShell />}>
            <Route index element={<HomePage />} />
            <Route path="kegiatan" element={<ReportListPage />} />
            <Route path="buat-laporan" element={<CreateReportPage />} />
            <Route path="kegiatan/:id" element={<ReportDetailPage />} />
            <Route path="apresiasi" element={<AppreciationPage />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="audit-sistem" element={<AdminAuditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReportProvider>
  );
}
