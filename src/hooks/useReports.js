import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReport,
  deleteReport,
  fetchFeed,
  fetchReport,
  likeReport,
  rateReport,
  reviewReport,
  unlikeReport,
  updateReport
} from '../api/laporan';

const nextPage = (lastPage) =>
  lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined;

export function useFeed(filter = 'semua') {
  return useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: ({ pageParam }) => fetchFeed({ filter, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage
  });
}

export function useReport(id) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReport(id),
    enabled: Boolean(id)
  });
}

// Terapkan perubahan ke laporan yang sama di semua cache (feed, daftar admin, detail)
function patchReportInCaches(queryClient, id, patch) {
  const apply = (report) => (report.id === id ? { ...report, ...patch(report) } : report);

  queryClient.setQueriesData({ queryKey: ['feed'] }, (data) =>
    data ? { ...data, pages: data.pages.map(page => ({ ...page, items: page.items.map(apply) })) } : data
  );
  queryClient.setQueryData(['report', id], (report) => (report ? apply(report) : report));
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked }) => (liked ? unlikeReport(id) : likeReport(id)),
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['report', id] });
      const snapshot = {
        feeds: queryClient.getQueriesData({ queryKey: ['feed'] }),
        report: queryClient.getQueryData(['report', id])
      };
      patchReportInCaches(queryClient, id, (r) => ({
        liked_by_me: !liked,
        like_count: Math.max(0, r.like_count + (liked ? -1 : 1))
      }));
      return snapshot;
    },
    onError: (_error, { id }, snapshot) => {
      snapshot?.feeds.forEach(([key, data]) => queryClient.setQueryData(key, data));
      queryClient.setQueryData(['report', id], snapshot?.report);
    },
    onSuccess: (result, { id }) => {
      patchReportInCaches(queryClient, id, () => result);
    }
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: (report) => {
      queryClient.setQueryData(['report', report.id], report);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    }
  });
}

export function useUpdateReport(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateReport(id, data),
    onSuccess: (report) => {
      queryClient.setQueryData(['report', id], report);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: ['report', id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    }
  });
}

export function useRateReport(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating) => rateReport(id, rating),
    onSuccess: ({ rating }) => {
      patchReportInCaches(queryClient, id, () => ({ rating }));
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    }
  });
}

export function useReviewReport(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review) => reviewReport(id, review),
    onSuccess: ({ status }) => {
      patchReportInCaches(queryClient, id, (r) => ({ status, comment_count: r.comment_count + 1 }));
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    }
  });
}
