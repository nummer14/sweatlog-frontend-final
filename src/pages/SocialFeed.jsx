import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import PostCard from '@/components/PostCard';

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 백엔드의 전체 게시물 조회 API 호출
        const response = await api.get('/posts');
        setPosts(response.data.content || []);
      } catch (err) {
        setError("피드를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = (deletedPostId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
  };

  if (isLoading) {
    return <div className="text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-right mb-4">
        <Link
          to="/post/new"
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          새 운동 기록하기
        </Link>
      </div>
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
        ))
      ) : (
        <div className="text-center text-gray-500">
          <p>아직 게시물이 없습니다.</p>
          <p>첫 운동을 기록해보세요!</p>
        </div>
      )}
    </div>
  );
}