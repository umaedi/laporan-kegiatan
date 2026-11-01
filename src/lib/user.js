// Inisial 2 huruf dari nama (gelar setelah koma diabaikan), untuk avatar
export function getInitials(name = '') {
  return name
    .split(',')[0]
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}
