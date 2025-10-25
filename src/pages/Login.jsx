import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import Logo from "@/components/Logo.jsx";
import GoogleLogo from "@/assets/google-logo.svg"; // Google 로고 import

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      const { user, access_token } = response.data;

      if (!user || !access_token) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }

      login(user, access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      alert(`${user.fullName || user.username}님, 환영합니다!`);
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-10 shadow-lg">
        <div className="flex justify-center">
          <Logo size="5xl" />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border p-3 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="이메일 주소"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border p-3 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            계정이 없으신가요? 회원가입
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
        </div>

        <div>
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || ""}/api/oauth2/authorization/google`}
            className="w-full flex justify-center items-center py-2 px-4 border rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <img className="h-5 w-5 mr-2" src={GoogleLogo} alt="Google logo" />
            Google 계정으로 로그인
          </a>
        </div>
      </div>
    </div>
  );
}