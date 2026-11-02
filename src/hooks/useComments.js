import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment, deleteComment, fetchComments } from '../api/laporan';
import { useAuth } from '../context/AuthContext';
import { ROLE } from '../shared/enums';

export function useComments(reportId) {
  return useQuery({
    queryKey: ['comments', reportId],
    queryFn: () => fetchComments(reportId),
    enabled: Boolean(reportId)
  });
}

// Setelah komentar berubah, jumlah & pratinjau komentar di feed/detail ikut diperbarui
function refreshAfterComment(queryClient, reportId) {
  queryClient.invalidateQueries({ queryKey: ['comments', reportId] });
  queryClient.invalidateQueries({ queryKey: ['report', reportId] });
  queryClient.invalidateQueries({ queryKey: ['feed'] });
}

export function useAddComment(reportId) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ body, parentId }) => addComment(reportId, { body, parentId }),
    // Komentar langsung tampil (optimistic); dikembalikan bila gagal terkirim
    onMutate: async ({ body, parentId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', reportId] });
      const previous = queryClient.getQueryData(['comments', reportId]);

      const temp = {
        id: `temp-${Date.now()}`,
        parent_id: parentId ?? null,
        deleted: false,
        body,
        review_action: null,
        author: { id: user.id, nama: user.nama, jabatan: user.jabatan, is_kepala_opd: user.role === ROLE.KEPALA_OPD, avatar_url: user.avatar_url },
        created_at: new Date().toISOString(),
        can_delete: false,
        pending: true,
        replies: []
      };

      queryClient.setQueryData(['comments', reportId], (items = []) =>
        parentId
          ? items.map(c => (c.id === parentId ? { ...c, replies: [...c.replies, temp] } : c))
          : [...items, temp]
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(['comments', reportId], context?.previous);
    },
    onSettled: () => refreshAfterComment(queryClient, reportId)
  });
}

export function useDeleteComment(reportId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSettled: () => refreshAfterComment(queryClient, reportId)
  });
}
