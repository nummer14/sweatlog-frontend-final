import React, { useState } from 'react';
import api from '@/api/axios';

export default function ImageUploader({ onUpload, initialImageUrl }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialImageUrl || null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 형식 및 크기 검사 (예시)
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      setError('5MB 이하의 파일만 업로드할 수 있습니다.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 일반 api 인스턴스와 다르게 Content-Type을 multipart/form-data로 설정
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { imageUrl } = response.data;
      setPreview(imageUrl);
      onUpload(imageUrl); // 부모 컴포넌트로 URL 전달

    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mt-1 flex items-center">
        {preview ? (
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <label htmlFor="file-upload" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          {uploading ? '업로드 중...' : '사진 선택'}
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={uploading} accept="image/*" />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}  