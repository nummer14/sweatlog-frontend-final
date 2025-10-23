import React from 'react';
import api from '@/api/axios';
import useAuthStore from '@/store/authStore';

export default function CommentList({ comments, onCommentDeleted }) {
  const { user: currentUser } = useAuthStore();

  const handleDelete = async (commentId) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/comments/${commentId}`);
        onCommentDeleted(commentId); // 부모 컴포넌트로 삭제된 댓글 ID 전달
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment.id} className="flex items-start gap-3">
            <img
              src={comment.user.profileImageUrl || `https://ui-avatars.com/api/?name=${comment.user.username}&background=random`}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-grow bg-gray-100 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{comment.user.username}</span>
                {currentUser?.id === comment.user.id && (
                  <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-500 hover:text-red-700">삭제</button>
                )}
              </div>
              <p className="text-gray-800 mt-1">{comment.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">아직 댓글이 없습니다.</p>
      )}
    </div>
  );
}