import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, UNAUTHORIZED_EVENT, clearToken, getToken, setToken } from '../api/client';
import { fetchMe, login as loginRequest, logout as logoutRequest } from '../api/laporan';

const AuthContext = createContext();

/**
 * Sesi pengguna: token JWT SIAPTUBA (POST /api/login) + profil modul (GET /api/laporan-kegiatan/me).
 * user = { id, nama, nip, email, jabatan, role: 'pegawai' | 'kepala_opd', opd, kepala_opd }
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  // 'checking' selama token tersimpan sedang diverifikasi saat aplikasi dibuka
  const [status, setStatus] = useState(() => (getToken() ? 'checking' : 'ready'));

  const resetSession = useCallback(() => {
    clearToken();
    queryClient.clear();
    setUser(null);
  }, [queryClient]);

  useEffect(() => {
    if (!getToken()) return;

    fetchMe()
      .then(setUser)
      .catch(() => resetSession())
      .finally(() => setStatus('ready'));
  }, [resetSession]);

  // Token kedaluwarsa / dicabut di tengah sesi → kembali ke halaman login
  useEffect(() => {
    const onUnauthorized = () => {
      queryClient.clear();
      setUser(null);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [queryClient]);

  const login = async (email, password) => {
    const result = await loginRequest(email, password);
    if (!result?.token) {
      throw new ApiError('Respons login dari server tidak berisi token. Hubungi administrator SIAPTUBA.');
    }
    setToken(result.token);

    try {
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch (error) {
      // Mis. akun belum terhubung ke OPD: jangan biarkan token tersisa
      clearToken();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Token tetap dihapus di perangkat walaupun server gagal mencabutnya
      console.warn('Gagal mencabut token di server saat logout:', error);
    }
    resetSession();
  };

  return <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
