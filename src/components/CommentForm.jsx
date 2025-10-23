import React, { useState } from 'react';
import api from '@/api/axios';

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/comments/posts/${postId}`, { content });
      onCommentAdded(response.data); // 부모 컴포넌트로 새 댓글 데이터 전달
      setContent(''); // 입력창 비우기
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-grow rounded-md border-gray-300 shadow-sm"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isSubmitting ? '등록중...' : '등록'}
      </button>
    </form>
  );
}