// Waktu relatif ala media sosial: "baru saja", "5 mnt", "2 jam", "kemarin", "3 hari", lalu tanggal absolut
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'baru saja';
  if (diffMinutes < 60) return `${diffMinutes} mnt`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'kemarin';
  if (diffDays < 7) return `${diffDays} hari`;

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Tanggal hari ini (YYYY-MM-DD) menurut WIB, untuk dibandingkan dengan `report.date`
export function getTodayKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

// Tanggal hari ini lengkap, mis. "Minggu, 1 November 2026"
export function formatTodayLong() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  });
}
