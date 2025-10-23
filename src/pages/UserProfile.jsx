import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import useAuthStore from '@/store/authStore';
import PostCard from '@/components/PostCard';
import FollowButton from '@/components/FollowButton';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMyProfile = currentUser?.id.toString() === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 백엔드에 단일 유저 조회 API가 없으므로, 전체 유저 목록에서 찾습니다.
        // (주의: 이 또한 백엔드에 GET /api/users/{userId} API 추가를 권장합니다.)
        const usersResponse = await api.get('/users');
        const foundUser = usersResponse.data.content.find(u => u.id.toString() === userId);
        
        if (!foundUser) throw new Error("사용자를 찾을 수 없습니다.");
        setProfileUser(foundUser);

        // 해당 사용자가 작성한 게시물 목록 조회
        const postsResponse = await api.get(`/posts/user/${userId}`);
        setUserPosts(postsResponse.data.content);
      } catch (err) {
        setError("프로필 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);
  
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prev => prev.filter(p => p.id !== deletedPostId));
  }

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!profileUser) return <div className="text-center">사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center gap-8">
        <img
          src={profileUser.profileImageUrl || `https://ui-avatars.com/api/?name=${profileUser.username}&background=random`}
          alt={profileUser.username}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{profileUser.username}</h1>
          <p className="text-gray-600 mt-1">{profileUser.fullName}</p>
          <p className="text-gray-500 mt-2">{profileUser.bio || "자기소개가 없습니다."}</p>
          <div className="mt-4">
            {!isMyProfile && <FollowButton userId={userId} />}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">작성한 게시물</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />)
        ) : (
          <p className="text-center text-gray-500">아직 작성한 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}