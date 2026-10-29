import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import { DEPARTMENT_USERS } from '../data/seedData';
import { Waves, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_USER = {
  name: 'Dr. Dedy Palwadi Ap. Mm',
  nip: '19720819 199803 1 005',
  role: 'Kepala Dinas Perikanan',
  initials: 'DP',
  email: 'kepala@dinasperikanan.go.id',
  type: 'admin',
};

// Ikon Google (SVG resmi 4 warna)
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

export default function LoginPage() {
  const { setCurrentUser } = useReports();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cocokkan email dengan data pegawai / kepala dinas.
  // Catatan: ini masih mode demo (password tidak diverifikasi ke server).
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const normalized = email.trim().toLowerCase();

    if (!normalized || !password) {
      setErrorMsg('Email dan kata sandi wajib diisi.');
      return;
    }

    if (normalized === ADMIN_USER.email) {
      setCurrentUser(ADMIN_USER);
      navigate('/');
      return;
    }

    const foundUser = DEPARTMENT_USERS.find(
      (u) => (u.email || '').toLowerCase() === normalized
    );

    if (!foundUser) {
      setErrorMsg('Email tidak terdaftar. Periksa kembali atau gunakan akun Google.');
      return;
    }

    setCurrentUser({ ...foundUser, type: 'pegawai' });
    navigate('/');
  };

  // Ganti dengan Google OAuth sungguhan (mis. Firebase Auth / @react-oauth/google).
  const handleGoogleLogin = () => {
    setCurrentUser({
      ...DEPARTMENT_USERS[0],
      type: 'pegawai',
    });
    navigate('/');
  };

  const inputBase =
    'w-full h-11 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 ' +
    'focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-4">
            <Waves size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sistem Laporan Kegiatan Pegawai, Dinas Perikanan
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition cursor-pointer"
          >
            <GoogleIcon />
            Masuk dengan Google
          </button>

          {/* Pemisah */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">atau dengan email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@dinasperikanan.go.id"
                  className={`${inputBase} pl-9 pr-3`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Kata sandi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={`${inputBase} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/40 transition cursor-pointer"
            >
              Masuk
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; 2026 Dinas Kelautan dan Perikanan
        </p>
      </div>
    </div>
  );
}