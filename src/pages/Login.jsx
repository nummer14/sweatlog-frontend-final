import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import GoogleLogo from "@/assets/google-logo.svg";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/Logo.jsx";

export default function Login() {
  const { setTokens } = useAuthStore(); // Zustand 스토어 액션
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    console.log(`입력 필드: ${e.target.name}, 입력 값: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇👇👇 이 handleSubmit 함수를 사용하세요 👇👇👇
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
      };

      // 1. 백엔드로 로그인 요청
      const response = await api.post("/api/auth/login", requestData);

      // 2. 응답 '바디(Body)'에서 accessToken과 refreshToken을 직접 추출 (response.data)
      const { accessToken, refreshToken, user } = response.data; // user 정보도 함께 받을 수 있습니다.

      if (!accessToken) {
        throw new Error("로그인 응답에 Access Token이 없습니다.");
      }

      // 3. Zustand 스토어에 토큰과 유저 정보를 저장
      // "Bearer " 접두사는 백엔드에서 붙여주지 않으므로, axios 인터셉터 등에서 붙여주는 것이 좋습니다.
      // 여기서는 일단 토큰 값 자체만 저장합니다.
      setTokens({ accessToken, refreshToken, user });

      // 4. 앞으로의 모든 api 요청 헤더에 인증 토큰을 자동으로 포함
      // 백엔드는 "Bearer " 접두사를 요구하므로 여기서 붙여줍니다.
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      alert("로그인에 성공했습니다!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="w-full max-w-md space-y- rounded-lg bg-white p-10 shadow-lg">
        <div>
          {/* 👇 2. [핵심 수정] 기존 h2 텍스트를 Logo 컴포넌트로 교체합니다. */}
          <Logo size="5xl" />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border p-2"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border p-2"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {" "}
              {isSubmitting ? "로그인 중..." : "로그인"}{" "}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            계정이 없으신가요? 회원가입
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div>
          <a
            href={`${
              import.meta.env.VITE_API_BASE_URL || ""
            }/oauth2/authorization/google`}
            className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <img className="h-5 w-5 mr-2" src={GoogleLogo} alt="Google logo" />
            Google 계정으로 로그인
          </a>
        </div>
      </div>
    </div>
  );
}
