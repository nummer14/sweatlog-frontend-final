import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/Logo.jsx";

export default function Header() {
  const { accessToken, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo size="3xl" />{" "}
          {/* 원하는 크기로 조절. 헤더에는 3xl 정도가 적당할 수 있습니다. */}
        </Link>

        <div>
          {accessToken ? (
            // 로그인 상태일 때 보여줄 메뉴
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                피드
              </Link>
              <Link
                to="/profile/me"
                className="text-gray-600 hover:text-indigo-600"
              >
                마이페이지
              </Link>
              <Link
                to="/routines"
                className="text-gray-600 hover:text-indigo-600"
              >
                내 루틴
              </Link>
              <Link to="/goals" className="text-gray-600 hover:text-indigo-600">
                내 목표
              </Link>
              <span className="text-gray-700">
                {user?.username || "사용자"}님
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그아웃 상태일 때 보여줄 메뉴
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
