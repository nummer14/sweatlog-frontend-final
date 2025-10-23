import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import api from '@/api/axios';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

export default function PostCard({ post, onDelete }) {
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthor = currentUser?.id === post.user?.id;

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/posts/${post.id}`);
        if (onDelete) onDelete(post.id);
      } catch (error) {
        alert("게시물 삭제에 실패했습니다.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/post/edit/${post.id}`, { state: { postData: post } });
  };

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      const response = await api.post(`/posts/${post.id}/like`);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      setIsLiked(isLiked); // 실패 시 원상 복구
      setLikeCount(likeCount);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-6">
      <div className="p-4 flex justify-between items-center">
        <Link to={`/profile/${post.user.id}`} className="flex items-center">
          <img src={post.user.profileImageUrl || `https://ui-avatars.com/api/?name=${post.user.username}&background=random`} alt={post.user.username} className="w-10 h-10 rounded-full mr-3"/>
          <div>
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        </Link>
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} onBlur={() => setTimeout(() => setMenuOpen(false), 100)} className="p-2 rounded-full hover:bg-gray-100"><MoreHorizontal size={20} /></button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border">
                <button onClick={handleEdit} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">수정하기</button>
                <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">삭제하기</button>
              </div>
            )}
          </div>
        )}
      </div>
      {post.imageUrl && <Link to={`/post/${post.id}`}><img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover"/></Link>}
      <div className="p-4">
        <p className="mb-4 text-gray-800 whitespace-pre-wrap">{post.memo}</p>
        <div className="font-semibold text-sm mb-2 text-gray-600">운동 상세 내역</div>
        <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md border">
          {post.details?.map((detail) => (
            <li key={detail.id} className="text-gray-700">{detail.name}: {detail.weight || 0}kg, {detail.reps || 0}회, {detail.sets || 0}세트</li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-2 border-t flex items-center text-gray-500">
        <button onClick={handleLike} className={`flex items-center mr-4 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
          <Heart size={20} className={`mr-1 ${isLiked ? 'fill-current' : ''}`} /><span>{likeCount}</span>
        </button>
        <Link to={`/post/${post.id}`} className="flex items-center hover:text-blue-500">
          <MessageCircle size={20} className="mr-1" /><span>{post.commentCount || 0}</span>
        </Link>
      </div>
    </div>
  );
}