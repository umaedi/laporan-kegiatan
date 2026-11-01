import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard, fetchAdminReports, fetchEmployees, fetchReviewQueue } from '../api/laporan';

// Semua query panel Kepala OPD berawalan ['admin'] agar mudah di-invalidate setelah review/rating
const nextPage = (lastPage) =>
  lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined;

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAdminDashboard
  });
}

export function useReviewQueue() {
  return useInfiniteQuery({
    queryKey: ['admin', 'review-queue'],
    queryFn: ({ pageParam }) => fetchReviewQueue({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage
  });
}

export function useAdminReports({ status, userId }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'reports', status, userId ?? null],
    queryFn: ({ pageParam }) => fetchAdminReports({ status, userId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: ['admin', 'employees'],
    queryFn: fetchEmployees
  });
}
