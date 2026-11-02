import { apiRequest } from './client';

// Kontrak lengkap: siaptuba/docs/laporan-kegiatan/API.md
const BASE = '/api/laporan-kegiatan';

// ─── Autentikasi (endpoint SIAPTUBA yang sudah ada) ─────────────────────────
export const login = (email, password) =>
  apiRequest('/api/login', { method: 'POST', body: { email, password }, auth: false });

export const logout = () => apiRequest('/api/logout', { method: 'POST' });

export const fetchMe = () => apiRequest(`${BASE}/me`).then(res => res.data);

// Foto wajah terbaru user login, diproksikan backend dari layanan Face Recognition (tampilkan dengan AuthImage)
export const AVATAR_PATH = `${BASE}/me/avatar`;

// ─── Laporan ────────────────────────────────────────────────────────────────
export const fetchFeed = ({ filter = 'semua', page = 1, perPage = 10 } = {}) =>
  apiRequest(`${BASE}/feed`, { query: { filter, page, per_page: perPage } }).then(res => res.data);

export const fetchReport = (id) => apiRequest(`${BASE}/reports/${id}`).then(res => res.data);

/** @param {FormData} formData title, description, activity_type, activity_date, activity_time, location, visibility, photos[] */
export const createReport = (formData) =>
  apiRequest(`${BASE}/reports`, { method: 'POST', body: formData }).then(res => res.data);

export const updateReport = (id, data) =>
  apiRequest(`${BASE}/reports/${id}`, { method: 'PATCH', body: data }).then(res => res.data);

export const deleteReport = (id) => apiRequest(`${BASE}/reports/${id}`, { method: 'DELETE' });

// ─── Interaksi ──────────────────────────────────────────────────────────────
export const fetchComments = (reportId) =>
  apiRequest(`${BASE}/reports/${reportId}/comments`).then(res => res.data.items);

export const addComment = (reportId, { body, parentId }) =>
  apiRequest(`${BASE}/reports/${reportId}/comments`, {
    method: 'POST',
    body: { body, parent_id: parentId ?? null }
  }).then(res => res.data);

export const deleteComment = (commentId) => apiRequest(`${BASE}/comments/${commentId}`, { method: 'DELETE' });

export const likeReport = (id) => apiRequest(`${BASE}/reports/${id}/like`, { method: 'PUT' }).then(res => res.data);

export const unlikeReport = (id) => apiRequest(`${BASE}/reports/${id}/like`, { method: 'DELETE' }).then(res => res.data);

export const reviewReport = (id, { action, body }) =>
  apiRequest(`${BASE}/reports/${id}/review`, { method: 'POST', body: { action, body } }).then(res => res.data);

export const rateReport = (id, rating) =>
  apiRequest(`${BASE}/reports/${id}/rating`, { method: 'PUT', body: { rating } }).then(res => res.data);

// ─── Panel Kepala OPD ───────────────────────────────────────────────────────
export const fetchAdminDashboard = () => apiRequest(`${BASE}/admin/dashboard`).then(res => res.data);

export const fetchReviewQueue = ({ page = 1, perPage = 10 } = {}) =>
  apiRequest(`${BASE}/admin/review-queue`, { query: { page, per_page: perPage } }).then(res => res.data);

export const fetchAdminReports = ({ status = 'semua', userId, page = 1, perPage = 10 } = {}) =>
  apiRequest(`${BASE}/admin/reports`, { query: { status, user_id: userId, page, per_page: perPage } }).then(res => res.data);

export const fetchEmployees = () => apiRequest(`${BASE}/admin/employees`).then(res => res.data.items);
