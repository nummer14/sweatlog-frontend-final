import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

// 이 컴포넌트는 실제로 UserProfile 페이지로 리디렉션하는 역할을 합니다.
// 이렇게 하면 MyProfile과 UserProfile의 UI/로직을 하나로 통일할 수 있습니다.
export default function MyProfile() {
  const { user } = useAuthStore();

  if (!user) {
    // 혹시 모를 예외 상황 (user 정보가 스토어에 없는 경우)
    return <Navigate to="/login" replace />;
  }

  // 자신의 UserProfile 페이지로 이동시킵니다.
  return <Navigate to={`/profile/${user.id}`} replace />;
}