import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export default function HomeRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // 소셜 로그인은 user 정보 없이 토큰만 반환하므로, 우선 토큰만 저장합니다.
      setTokens({ accessToken, refreshToken });
      navigate('/', { replace: true });
    } else {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      navigate('/login', { replace: true });
    }
  }, [location, navigate, setTokens]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>로그인 중입니다...</p>
    </div>
  );
};