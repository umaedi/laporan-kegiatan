import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REPORTS } from '../data/seedData';

const ReportContext = createContext();

export const STORAGE_KEY = 'laporan_kegiatan_dinas_perikanan_v4';

export function ReportProvider({ children }) {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
    return INITIAL_REPORTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [reports]);

  // Cap tanggal hari ini (YYYY-MM-DD)
  const todayString = new Date().toISOString().split('T')[0];

  const todayCount = reports.filter(r => r.date === todayString).length;
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'pending' || !r.comments || r.comments.length === 0).length;
  const reviewedCount = reports.filter(r => r.status === 'reviewed' && r.comments && r.comments.length > 0).length;
  const luarKantorCount = reports.filter(r => r.activityType === 'luar_kantor').length;
  const dalamKantorCount = reports.filter(r => r.activityType === 'dalam_kantor').length;

  // Tambah laporan kegiatan baru oleh pegawai
  const addReport = (newReportData) => {
    const newReport = {
      id: `LAP-DKP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      comments: [],
      reporterName: 'Bayu Pratama, S.Pi.',
      reporterNip: '19930415 202012 1 002',
      activityType: newReportData.activityType || 'luar_kantor',
      ...newReportData
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  // Tambah komentar/evaluasi oleh atasan
  const addSupervisorComment = (reportId, commentData) => {
    const newComment = {
      id: `c-${Date.now()}`,
      date: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      author: commentData.author || 'Dr. DEDY PALWADI AP. MM',
      role: 'Kepala Dinas Perikanan',
      text: commentData.text,
      action: commentData.action || 'approved'
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const updatedComments = [...(r.comments || []), newComment];
          return {
            ...r,
            comments: updatedComments,
            status: commentData.action === 'revision' ? 'revision' : 'reviewed'
          };
        }
        return r;
      })
    );
  };

  // Status user login (bisa simpan user object atau role)
  const [currentUser, setCurrentUser] = useState(() => {
    return {
      name: 'Bayu Pratama, S.Pi.',
      nip: '19930415 202012 1 002',
      role: 'Pengawas Perikanan / Pelaksana Teknis',
      initials: 'BP',
      type: 'pegawai'
    };
  });

  const currentUserRole = currentUser?.type === 'admin' ? 'admin' : 'pegawai';

  const toggleUserRole = () => {
    setCurrentUser(prev => {
      if (prev?.type === 'admin') {
        return {
          name: 'Bayu Pratama, S.Pi.',
          nip: '19930415 202012 1 002',
          role: 'Pengawas Perikanan / Pelaksana Teknis',
          initials: 'BP',
          type: 'pegawai'
        };
      } else {
        return {
          name: 'Dr. Dedy Palwadi Ap. Mm',
          nip: '19720819 199803 1 005',
          role: 'Kepala Dinas Perikanan',
          initials: 'DP',
          type: 'admin'
        };
      }
    });
  };

  // Hapus laporan
  const deleteReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Reset data ke default perikanan
  const resetToDefault = () => {
    setReports(INITIAL_REPORTS);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        addSupervisorComment,
        deleteReport,
        resetToDefault,
        currentUser,
        setCurrentUser,
        currentUserRole,
        toggleUserRole,
        todayCount,
        totalCount,
        pendingCount,
        reviewedCount,
        luarKantorCount,
        dalamKantorCount,
        todayString
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}
