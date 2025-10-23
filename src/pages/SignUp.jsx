import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

export default function SignUp() {
  const { setTokens } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/register", formData);
      const { accessToken, refreshToken, user } = response.data;
      setTokens({ accessToken, refreshToken, user });
      navigate("/"); // 회원가입 후 자동 로그인 및 메인 페이지로 이동
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="flex items-center justify-center pt-16">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          회원가입
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <input name="username" type="text" required className="w-full rounded-md border p-2" placeholder="사용자 이름" value={formData.username} onChange={handleChange} />
            <input name="email" type="email" required className="w-full rounded-md border p-2" placeholder="이메일 주소" value={formData.email} onChange={handleChange} />
            <input name="password" type="password" required className="w-full rounded-md border p-2" placeholder="비밀번호" value={formData.password} onChange={handleChange} />
            <input name="fullName" type="text" required className="w-full rounded-md border p-2" placeholder="전체 이름" value={formData.fullName} onChange={handleChange} />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div><button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"> {isSubmitting ? "가입하기" : "가입하기"} </button></div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">이미 계정이 있으신가요? 로그인</Link>
        </div>
      </div>
    </div>
  );
}