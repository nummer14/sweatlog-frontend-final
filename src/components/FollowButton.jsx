import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

export default function FollowButton({ userId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await api.get(`/users/${userId}/follow-status`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("팔로우 상태 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFollowStatus();
  }, [userId]);

  const handleToggleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users/${userId}/follow`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("팔로우 토글 실패:", error);
      alert("요청에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } disabled:bg-gray-300`}
    >
      {isLoading ? '로딩...' : isFollowing ? '언팔로우' : '팔로우'}
    </button>
  );
}