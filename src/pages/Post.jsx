import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios";
import ImageUploader from "@/components/ImageUploader";

const exerciseCategories = [
  { value: "WEIGHT_TRAINING", label: "웨이트 트레이닝" },
  { value: "YOGA", label: "요가" },
  { value: "CARDIO", label: "유산소" },
  { value: "PILATES", label: "필라테스" },
];

export default function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(postId);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    category: "WEIGHT_TRAINING",
    memo: "",
    imageUrl: "",
    details: [{ name: "", weight: 0, reps: 0, sets: 0 }],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && location.state?.postData) {
      const post = location.state.postData;
      setFormData({ ...post });
    } else if (isEditing) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, [isEditing, postId, navigate, location.state]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newDetails = [...formData.details];
    const numericFields = ["weight", "reps", "sets"];
    newDetails[index][name] = numericFields.includes(name)
      ? parseInt(value, 10) || 0
      : value;
    setFormData((prev) => ({ ...prev, details: newDetails }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { name: "", weight: 0, reps: 0, sets: 0 }],
    }));
  };

  const removeDetail = (index) => {
    if (formData.details.length > 1) {
      setFormData((prev) => ({
        ...prev,
        details: prev.details.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = (imageUrl) =>
    setFormData((prev) => ({ ...prev, imageUrl }));

  // src/pages/Post.jsx 의 handleSubmit 함수 전체

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👇 [생략되었던 부분 1] 요청 전에 이전 에러 메시지를 초기화합니다.
    setError(null);

    // 👇 [생략되었던 부분 2] 운동 상세 내역에 이름이 비어있는지 유효성 검사를 합니다.
    if (formData.details.some((d) => !d.name.trim())) {
      setError("운동 이름을 입력해주세요.");
      return;
    }

    try {
      // [핵심 수정] 백엔드 DTO에 맞게 details -> postDetails로 필드명을 변경합니다.
      const payload = {
        date: formData.date,
        category: formData.category,
        memo: formData.memo,
        imageUrl: formData.imageUrl,
        postDetails: formData.details, // 필드명 변경
      };

      if (isEditing) {
        await api.put(`/posts/${postId}`, payload);
        alert("기록이 수정되었습니다.");
      } else {
        await api.post("/posts", payload);
        alert("기록이 작성되었습니다.");
      }
      navigate("/"); // 성공 시 피드 페이지로 이동
    } catch (err) {
      setError(err.response?.data?.message || "요청에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditing ? "운동 기록 수정" : "새 운동 기록"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              날짜
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              운동 종류
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border-gray-300"
            >
              {exerciseCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            운동 상세 내역
          </h2>
          {formData.details.map((detail, index) => (
            <div
              key={index}
              className="grid sm:grid-cols-5 gap-2 mb-3 p-3 border rounded-md bg-gray-50 items-center"
            >
              <input
                type="text"
                name="name"
                placeholder="운동 이름"
                value={detail.name}
                onChange={(e) => handleDetailChange(index, e)}
                required
                className="sm:col-span-2 rounded-md border-gray-300"
              />
              <input
                type="number"
                name="weight"
                placeholder="무게(kg)"
                value={detail.weight}
                onChange={(e) => handleDetailChange(index, e)}
                className="rounded-md border-gray-300"
              />
              <input
                type="number"
                name="reps"
                placeholder="횟수"
                value={detail.reps}
                onChange={(e) => handleDetailChange(index, e)}
                className="rounded-md border-gray-300"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  name="sets"
                  placeholder="세트"
                  value={detail.sets}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border-gray-300"
                />
                {formData.details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="ml-2 text-red-500 p-1"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDetail}
            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            + 운동 추가
          </button>
        </div>
        <div>
          <label
            htmlFor="memo"
            className="block text-sm font-medium text-gray-700"
          >
            메모
          </label>
          <textarea
            id="memo"
            name="memo"
            rows="4"
            value={formData.memo}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            운동 사진
          </label>
          <ImageUploader
            onUpload={handleImageUpload}
            initialImageUrl={formData.imageUrl}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            {isEditing ? "수정하기" : "작성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
