import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE } from '../shared/enums';

// Halaman awal sesuai peran: Kepala Dinas ke Panel Admin, pegawai ke Beranda
const homeFor = (user) => (user.role === ROLE.KEPALA_OPD ? '/admin' : '/');

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const loggedIn = await login(email.trim(), password);
      // Kembali ke halaman yang tadi dituju, kecuali pegawai yang mencoba membuka /admin
      const from = location.state?.from?.pathname;
      const canGoBack = from && (loggedIn.role === ROLE.KEPALA_OPD || !from.startsWith('/admin'));
      navigate(canGoBack ? from : homeFor(loggedIn), { replace: true });
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError('');

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col px-6 pt-16 pb-8">
        {/* Identitas aplikasi */}
        <div className="flex flex-col items-center text-center mb-10">
          <img src="/logo.png" alt="Logo Kabupaten Tulang Bawang" className="h-24 w-auto object-contain mb-4" />
          <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight">SI KERANG KAMPAK</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xs">
            Sistem Informasi Kehadiran, Evaluasi, Rekapitulasi dan Kinerja Pegawai yang Akuntabel
          </p>
          <p className="text-sm text-slate-500 mt-3">Masuk dengan akun SIAP TUBA Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                placeholder="nama@email.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
                className="w-full h-12 pl-11 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-base text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                placeholder="Masukkan kata sandi"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-base text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p id="login-error" role="alert" className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl p-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!email.trim() || !password || isSubmitting}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 text-white text-base font-semibold hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
            {isSubmitting ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Lupa kata sandi? Atur ulang lewat aplikasi SIAP TUBA atau hubungi operator OPD Anda.
        </p>

        <p className="mt-auto pt-8 text-center text-xs text-slate-400">SiLapor • Versi 1.2.0</p>
      </div>
    </div>
  );
}
