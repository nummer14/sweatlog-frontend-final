import React, { useEffect, useState, useRef } from "react";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import { Camera } from "lucide-react"; // 아이콘 라이브러리 (없으면 npm install lucide-react)

export default function MyProfile() {
  // Zustand 스토어에서 user 정보와 login 함수(업데이트용)를 가져옵니다.
  const { user: authUser, login } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  // 숨겨진 파일 input에 접근하기 위한 ref
  const fileInputRef = useRef(null);

useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const meRes = await api.get("/users/me");
        const me = meRes.data;
        setProfile(me);

        const [postsRes, goalsRes] = await Promise.all([
          api.get(`/posts/user/${me.id}?page=0&size=20`),
          api.get("/users/profile/goals"),
        ]);
        
        // posts 데이터 처리 (기존의 안전한 방식)
        setMyPosts(postsRes?.data?.content ?? postsRes?.data ?? []);

        // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
        // 핵심 수정 부분
        const goalsData = goalsRes?.data;
        // goalsData가 배열이면 그대로 사용하고, 배열이 아니면(null, {}, 등) 빈 배열[]을 사용합니다.
        setGoals(Array.isArray(goalsData) ? goalsData : []);
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      } catch (err) {
        console.error("프로필 데이터를 불러오는 데 실패했습니다:", err);
        setErrMsg("데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // 프로필 이미지 변경 핸들러
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    // 백엔드에서 받는 key 이름이 'file' 또는 'image'일 수 있습니다. 확인이 필요합니다.
    formData.append('file', file);

    try {
      // Step 1: 이미지 업로드 API 호출 (2번 코드 참고)
      const uploadRes = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadRes.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("이미지 URL을 받지 못했습니다.");
      }
      
      // Step 2: 업로드된 URL로 프로필 정보 업데이트 API 호출
      const payload = { ...(profile || {}), profileImageUrl: imageUrl };
      await api.put("/users/profile/setting", payload);

      // Step 3: 프론트엔드 상태 실시간 업데이트
      setProfile((p) => ({ ...(p || {}), profileImageUrl: imageUrl }));
      
      // (선택사항이지만 강력 추천) Zustand 스토어의 user 정보도 업데이트
      // 이렇게 하면 Header 등 다른 곳의 프로필 이미지도 즉시 바뀝니다.
      login({ ...authUser, profileImageUrl: imageUrl }, useAuthStore.getState().accessToken);
      
      alert("프로필 이미지가 성공적으로 변경되었습니다.");

    } catch (err) {
      console.error("프로필 이미지 업데이트 실패:", err);
      alert("이미지 업로드 또는 프로필 업데이트에 실패했습니다.");
    } finally {
      setIsUploading(false);
      // 같은 파일을 다시 업로드할 수 있도록 input 값을 초기화합니다.
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <div className="p-6 text-center">프로필을 불러오는 중…</div>;
  if (errMsg) return <div className="p-6 text-center text-red-600">{errMsg}</div>;
  if (!profile) return <div className="p-6 text-center">프로필 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto max-w-4xl p-4">
      {/* 숨겨진 파일 input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={isUploading}
      />

      {/* --- 프로필 헤더 --- */}
      <header className="flex items-center gap-8 p-6 mb-8 bg-white rounded-lg shadow-sm">
        {/* 프로필 이미지 섹션 */}
        <div className="flex-shrink-0 w-32 h-32">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="relative w-full h-full rounded-full group cursor-pointer"
          >
            <img
              src={profile.profileImageUrl || `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=128`}
              alt="프로필"
              className="w-full h-full object-cover rounded-full border-2 border-gray-200"
            />
            {/* 마우스 올리면 나타나는 카메라 아이콘 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity">
              <Camera className="w-10 h-10 text-white opacity-0 group-hover:opacity-100" />
            </div>
            {/* 업로드 중일 때 로딩 스피너 */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>

        {/* 프로필 정보 섹션 */}
        <section className="flex-grow space-y-3">
          <h1 className="text-3xl font-bold">{profile.fullName || profile.username}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <div className="flex gap-6 text-md">
            <span>게시물 <span className="font-semibold">{myPosts.length}</span></span>
            <span>목표 <span className="font-semibold">{goals.length}</span></span>
          </div>
        </section>
      </header>

      {/* --- 나의 목표 --- */}
      <div className="rounded-lg border p-4 mb-6 bg-white">
        <h2 className="mb-3 text-xl font-semibold">나의 목표</h2>
        {goals.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {goals.map((g) => (
              <li key={g.id}>{g.title || g.name}</li>
            ))}
          </ul>
        ) : <p className="text-gray-500">아직 설정된 목표가 없습니다.</p>}
      </div>

      {/* --- 나의 게시물 --- */}
      <div className="rounded-lg border p-4 bg-white">
        <h2 className="mb-3 text-xl font-semibold">나의 게시물</h2>
        {myPosts.length > 0 ? (
          <ul className="space-y-3">
            {myPosts.map((p) => (
              <li key={p.id} className="rounded border p-3 hover:shadow-md transition-shadow">
                <div className="font-medium">
                  {p.memo || p.title || `(내용 없음)`}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {p.date} {p.startTime}~{p.endTime}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">아직 작성한 게시물이 없습니다.</p>}
      </div>
    </div>
  );
}