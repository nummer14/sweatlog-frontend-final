import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";
import { Camera } from "lucide-react"; // 카메라 아이콘 import

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  // 👇 login 함수 대신 user 정보와 logout 함수를 가져옵니다.
  const { user: currentUser, login } = useAuthStore();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // 이미지 업로드 상태
  const [error, setError] = useState(null);

  // 👇 1. 숨겨진 파일 입력(input)에 접근하기 위한 ref 생성
  const fileInputRef = useRef(null);

  // 현재 보고 있는 프로필이 내 프로필인지 확인하는 변수
  const isMyProfile = currentUser?.id.toString() === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // [수정] 백엔드에 단일 유저 조회 API가 있으므로 /users/{userId}를 사용합니다.
        const userResponse = await api.get(`/users/${userId}`);
        setProfileUser(userResponse.data);

        const postsResponse = await api.get(`/posts/user/${userId}`);
        setUserPosts(postsResponse.data.content);
      } catch (err) {
        setError("프로필 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  // 👇 2. 파일이 선택되었을 때 실행될 이미지 변경 핸들러 함수
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file); // 백엔드에서 'image'라는 이름으로 받음
    
    try {
      // Step 1: 이미지 업로드 API 호출
      const uploadResponse = await api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { imageUrl } = uploadResponse.data;

      // Step 2: 업로드된 URL로 프로필 정보 업데이트 API 호출
      // [수정] 백엔드는 PUT /users/profile 에서 Body로 받습니다.
      const profileUpdatePayload = {
        username: profileUser.username,
        fullName: profileUser.fullName,
        bio: profileUser.bio,
        profileImageUrl: imageUrl,
      };
      await api.put("/users/profile", profileUpdatePayload);
      
      // Step 3: 프론트엔드 상태 실시간 업데이트
      const updatedUser = { ...profileUser, profileImageUrl: imageUrl };
      setProfileUser(updatedUser);
      if (isMyProfile) {
        // Zustand 스토어의 user 정보도 업데이트하여 Header 등 다른 곳에도 반영
        login({ ...currentUser, profileImageUrl: imageUrl }, useAuthStore.getState().accessToken);
      }
      alert("프로필 이미지가 변경되었습니다.");

    } catch (err) {
      alert("이미지 업로드 또는 프로필 업데이트에 실패했습니다.");
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts(prev => prev.filter(p => p.id !== deletedPostId));
  }

  if (isLoading) return <div className="text-center p-8">로딩 중...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!profileUser) return <div className="text-center p-8">사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 👇 3. 숨겨진 파일 input 태그를 렌더링합니다. */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading}/>
      
      {/* --- 프로필 헤더 (레이아웃은 두 번째 코드, 이미지 부분은 첫 번째 코드 UI) --- */}
      <header className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center gap-8">
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32">
          {/* 👇 4. 이미지와 버튼 UI를 첫 번째 코드의 방식으로 교체 */}
          <button
            onClick={() => isMyProfile && fileInputRef.current?.click()}
            disabled={!isMyProfile || isUploading}
            className={`relative w-full h-full rounded-full group ${isMyProfile ? "cursor-pointer" : "cursor-default"}`}
          >
            <img
              src={profileUser.profileImageUrl || `https://ui-avatars.com/api/?name=${profileUser.username}&background=random`}
              alt={profileUser.username}
              className="w-full h-full object-cover rounded-full border-2 border-gray-200"
            />
            {/* 내 프로필일 때만 마우스 올리면 카메라 아이콘 표시 */}
            {isMyProfile && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
              </div>
            )}
            {/* 업로드 중일 때 로딩 스피너 표시 */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
        
        {/* --- 프로필 정보 및 액션 버튼 (두 번째 코드와 동일) --- */}
        <section className="flex-grow space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            {isMyProfile ? (
              <button onClick={() => navigate('/profile/edit')} className="border rounded-md px-3 py-1 text-sm font-semibold hover:bg-gray-100">
                프로필 편집
              </button>
            ) : (
              <FollowButton userId={userId} />
            )}
          </div>
          <div className="flex gap-6 text-sm">
            <span>게시물 <span className="font-semibold">{userPosts.length}</span></span>
            <span>팔로워 <span className="font-semibold">{profileUser.followerCount || 0}</span></span>
            <span>팔로잉 <span className="font-semibold">{profileUser.followingCount || 0}</span></span>
          </div>
          <div>
            <p className="font-semibold">{profileUser.fullName}</p>
            <p className="text-gray-600 text-sm">{profileUser.bio || "자기소개가 없습니다."}</p>
          </div>
        </section>
      </header>

      {/* --- 작성한 게시물 목록 (두 번째 코드와 동일) --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">작성한 게시물</h2>
        {userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />)
        ) : (
          <p className="text-center text-gray-500 py-10">아직 작성한 게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}