import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import Logo from "@/components/Logo.jsx"; // Logo 컴포넌트 import 추가

export default function SignUp() {
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
      await api.post("/auth/register", formData);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 --- 여기가 수정될 부분입니다 --- 👇
  return (
    // [핵심 수정] 최상위 div의 클래스를 Login.jsx와 완전히 동일하게 맞춰줍니다.
    <div className="flex items-center justify-center pt-16">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-10 shadow-lg">
        {/* [추가] 일관성을 위해 회원가입 페이지에도 로고를 추가합니다. */}
        <div className="flex justify-center">
            <Logo size="5xl" />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <input name="username" type="text" required className="w-full rounded-md border p-3 border-gray-300" placeholder="사용자 이름 (닉네임)" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <input name="fullName" type="text" required className="w-full rounded-md border p-3 border-gray-300" placeholder="실명" value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <input name="email" type="email" required className="w-full rounded-md border p-3 border-gray-300" placeholder="이메일 주소" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <input name="password" type="password" required className="w-full rounded-md border p-3 border-gray-300" placeholder="비밀번호" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "가입 중..." : "가입하기"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}  