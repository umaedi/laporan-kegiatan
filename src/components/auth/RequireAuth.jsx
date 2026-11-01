import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../ui/LoadingState';

// Penjaga rute di sisi klien (hanya UX; keamanan sebenarnya di server SIAPTUBA)
export default function RequireAuth({ role, children }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return <LoadingState fullScreen label="Memeriksa sesi…" />;
  }
  if (!user) {
    return <Navigate to="/masuk" replace state={{ from: location }} />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
