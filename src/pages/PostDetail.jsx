import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import PostCard from '@/components/PostCard'; // PostCard를 재사용하여 일관성 유지
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // 백엔드에 단일 게시물 조회 API가 없으므로, 우선 전체 목록에서 찾습니다.
        // (주의: 이 방식은 게시물이 많아지면 비효율적이므로, 백엔드에 GET /api/posts/{postId} API 추가를 권장합니다.)
        const postsResponse = await api.get('/posts');
        const foundPost = postsResponse.data.content.find(p => p.id.toString() === postId);
        
        if (!foundPost) {
          throw new Error("게시물을 찾을 수 없습니다.");
        }
        setPost(foundPost);

        // 댓글 목록 조회 API 호출
        const commentsResponse = await api.get(`/comments/posts/${postId}`);
        setComments(commentsResponse.data.content);

      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(prevComments => prevComments.filter(c => c.id !== deletedCommentId));
  };
  
  const handlePostDeleted = () => {
    // PostCard에서 삭제가 일어나면 피드로 이동
    window.location.href = '/';
  }

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {post && <PostCard post={post} onDelete={handlePostDeleted} />}
      
      <div className="bg-white border rounded-lg shadow-sm p-4 mt-6">
        <h2 className="text-lg font-bold mb-4">댓글 ({comments.length})</h2>
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
      </div>
    </div>
  );
}