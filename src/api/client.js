// Klien HTTP ke backend SIAPTUBA. Komponen tidak memanggil fetch langsung.

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'laporan_kegiatan_token';

export const UNAUTHORIZED_EVENT = 'laporan-kegiatan:unauthorized';

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // Error validasi per field dari backend (422): { field: [pesan, ...] }
    this.errors = errors;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage tidak tersedia: sesi hanya bertahan sampai halaman dimuat ulang
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // abaikan
  }
}

/**
 * @param {string} path Path diawali '/api/...'
 * @param {{ method?: string, body?: object|FormData, query?: object, auth?: boolean }} options
 */
export async function apiRequest(path, { method = 'GET', body, query, auth = true } = {}) {
  if (!API_URL) {
    throw new ApiError(
      'VITE_API_URL belum diatur. Salin .env.example menjadi .env, isi URL backend SIAPTUBA, lalu jalankan ulang npm run dev.'
    );
  }

  const url = new URL(API_URL.replace(/\/$/, '') + path);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const isFormData = body instanceof FormData;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
    });
  } catch {
    throw new ApiError(`Tidak dapat terhubung ke server (${API_URL}). Periksa koneksi internet Anda.`);
  }

  const payload = await response.json().catch(() => null);

  if (response.ok) return payload;

  if (response.status === 401 && auth) {
    clearToken();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  // Format modul: { success:false, message, errors? }. Login SIAPTUBA mengembalikan error validasi mentah: { field: [...] }
  const isModuleFormat = payload && typeof payload === 'object' && 'success' in payload;
  const errors = isModuleFormat ? payload.errors ?? null : response.status === 422 ? payload : null;
  const message =
    (isModuleFormat && payload.message) ||
    (errors && Object.values(errors).flat()[0]) ||
    `Terjadi kesalahan pada server (HTTP ${response.status}).`;

  throw new ApiError(message, { status: response.status, errors });
}

/**
 * Ambil berkas (mis. foto laporan) dari endpoint stream backend dengan header Bearer.
 * <img src> tidak dapat mengirim token, jadi hasilnya ditampilkan sebagai blob URL.
 *
 * @param {string} path Path relatif dari server, mis. '/api/laporan-kegiatan/stream/12'
 * @returns {Promise<Blob>}
 */
export async function apiBlob(path) {
  if (!API_URL) {
    throw new ApiError('VITE_API_URL belum diatur. Salin .env.example menjadi .env lalu jalankan ulang npm run dev.');
  }
  if (!path.startsWith('/')) {
    // Token hanya boleh dikirim ke backend SIAPTUBA, bukan ke URL absolut dari sumber lain
    throw new ApiError(`Path berkas tidak valid: "${path}". Server harus mengirim path relatif.`);
  }

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(API_URL.replace(/\/$/, '') + path, { headers });
  } catch {
    throw new ApiError(`Tidak dapat terhubung ke server (${API_URL}).`);
  }

  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  if (!response.ok) {
    throw new ApiError(`Gagal memuat berkas (HTTP ${response.status}).`, { status: response.status });
  }

  return response.blob();
}
