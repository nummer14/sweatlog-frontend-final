import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';

// 백엔드 Enum과 동일한 값
const goalTypes = [
  { value: 'WEIGHT', label: '체중 관리' },
  { value: 'STRENGTH', label: '근력 (중량/횟수)' },
  { value: 'ENDURANCE', label: '지구력 (거리/시간)' },
  { value: 'FREQUENCY', label: '운동 빈도 (주 n회)' },
  { value: 'BODY_COMPOSITION', label: '체성분 (체지방/근육량)' },
];

export default function GoalEditor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDt: new Date().toISOString().split("T")[0],
    endDt: '',
    type: 'WEIGHT',
    targetWeightKg: '',
    targetLiftWeightKg: '',
    // ... 다른 필드 초기화
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 필수 값 검증
    if (!formData.endDt) {
      setError("목표 종료일을 설정해주세요.");
      return;
    }

    try {
      await api.post('/users/profile/goals', formData);
      alert("새로운 목표가 설정되었습니다.");
      navigate('/goals');
    } catch (err) {
      setError(err.response?.data?.message || "목표 설정에 실패했습니다.");
    }
  };
  
  // 선택된 목표 유형에 따라 다른 입력 필드를 보여주는 함수
  const renderTargetFields = () => {
    switch (formData.type) {
      case 'WEIGHT':
        return <input type="number" name="targetWeightKg" placeholder="목표 체중(kg)" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />;
      case 'STRENGTH':
        return <input type="number" name="targetLiftWeightKg" placeholder="목표 중량(kg)" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300" />;
      // ... 다른 목표 유형에 대한 입력 필드를 추가할 수 있습니다.
      default:
        return <p className="text-sm text-gray-500">이 목표 유형은 세부 설정이 필요 없습니다.</p>;
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">새 목표 설정</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium">시작일</label><input type="date" name="startDt" value={formData.startDt} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
          <div><label className="block text-sm font-medium">종료일</label><input type="date" name="endDt" value={formData.endDt} onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300"/></div>
        </div>
        
        <div>
          <label className="block text-sm font-medium">목표 유형</label>
          <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300">
            {goalTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">세부 목표</label>
          {renderTargetFields()}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="text-right"><button type="submit" className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700">목표 설정하기</button></div>
      </form>
    </div>
  );
}