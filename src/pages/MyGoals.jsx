import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { PlusCircle, Edit } from 'lucide-react';

// 백엔드 Enum과 매칭되는 객체 (화면 표시용)
const GOAL_TYPE_LABELS = {
  WEIGHT: "체중 관리",
  STRENGTH: "근력",
  ENDURANCE: "지구력",
  FREQUENCY: "운동 빈도",
  BODY_COMPOSITION: "체성분"
};

const GOAL_STATUS_LABELS = {
  ACTIVE: "진행중",
  DONE: "완료",
  PAUSED: "중단"
};

export default function MyGoals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);
  
  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/profile/goals');
      setGoals(response.data);
    } catch (err) {
      setError("목표를 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (goalId, newStatus) => {
    try {
      await api.patch(`/users/profile/goals/${goalId}/status?status=${newStatus}`);
      // 상태 변경 후 목록을 다시 불러와 화면을 갱신합니다.
      fetchGoals();
    } catch (err) {
      alert("상태 변경에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">나의 목표</h1>
        <Link to="/goals/new" className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700">
          <PlusCircle size={20} /> 새 목표 설정
        </Link>
      </div>
      
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${goal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {GOAL_STATUS_LABELS[goal.status]}
                  </span>
                  <h2 className="text-xl font-semibold mt-2">{GOAL_TYPE_LABELS[goal.type]} 목표</h2>
                  <p className="text-sm text-gray-500">{goal.startDt} ~ {goal.endDt}</p>
                  {/* 여기에 목표 상세 내용을 표시하는 로직을 추가할 수 있습니다. 예: */}
                  <p className="mt-2 text-gray-700">
                    {goal.type === 'WEIGHT' && `목표 체중: ${goal.targetWeightKg}kg`}
                    {goal.type === 'STRENGTH' && `목표 중량: ${goal.targetLiftWeightKg}kg`}
                    {/* ... 다른 목표 타입들 ... */}
                  </p>
                </div>
                <select 
                  value={goal.status} 
                  onChange={(e) => handleStatusChange(goal.id, e.target.value)}
                  className="text-sm border-gray-300 rounded-md"
                >
                  <option value="ACTIVE">진행중</option>
                  <option value="DONE">완료</option>
                  <option value="PAUSED">중단</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">설정된 목표가 없습니다.</p>
          <p className="mt-1">새로운 목표를 설정하고 동기를 부여받으세요!</p>
        </div>
      )}
    </div>
  );
}