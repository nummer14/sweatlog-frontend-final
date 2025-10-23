import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    // 로그인되지 않았으면 로그인 페이지로 리디렉션
    // 현재 위치를 state로 전달하여 로그인 후 돌아올 수 있도록 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;