import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import LoginPage from "./pages/LoginPage";
import MobileAppShell from "./components/layout/MobileAppShell";
import HomePage from "./pages/HomePage";
import CreateReportPage from "./pages/CreateReportPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import AppreciationPage from "./pages/AppreciationPage";
import ProfilePage from "./pages/ProfilePage";
import AdminShell from "./components/admin/AdminShell";
import { ROLE } from "./shared/enums";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminReviewQueuePage from "./pages/admin/AdminReviewQueuePage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminReportDetailPage from "./pages/admin/AdminReportDetailPage";
import AdminEmployeesPage from "./pages/admin/AdminEmployeesPage";

// Data server (laporan, komentar, panel admin) dikelola TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => error?.status === undefined || error.status >= 500 ? failureCount < 2 : false,
    },
  },
});

// Foto laporan disimpan di cache sebagai blob URL (lihat AuthImage); cabut saat query dibuang agar memori lepas
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "removed" && event.query.queryKey[0] === "photo" && event.query.state.data) {
    URL.revokeObjectURL(event.query.state.data);
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/masuk" element={<LoginPage />} />
  
            <Route
              path="/"
              element={
                <RequireAuth>
                  <MobileAppShell />
                </RequireAuth>
              }
            >
              <Route index element={<HomePage />} />
                <Route path="buat-laporan" element={<CreateReportPage />} />
              <Route path="kegiatan/:id" element={<ReportDetailPage />} />
              <Route path="apresiasi" element={<AppreciationPage />} />
              <Route path="profil" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
  
            {/* Panel Kepala Dinas: semua URL diawali /admin */}
            <Route
              path="/admin"
              element={
                <RequireAuth role={ROLE.KEPALA_OPD}>
                  <AdminShell />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="tinjau" element={<AdminReviewQueuePage />} />
              <Route path="laporan" element={<AdminReportsPage />} />
              <Route path="laporan/:id" element={<AdminReportDetailPage />} />
              <Route path="pegawai" element={<AdminEmployeesPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
