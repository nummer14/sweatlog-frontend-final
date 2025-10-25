import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '@/api/axios';

export default function RoutineEditor() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(routineId);

  const [routineName, setRoutineName] = useState('');
  const [details, setDetails] = useState([{ orderNumber: 1, name: '', set: 0, rep: 0, time: 0 }]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && location.state?.routineData) {
      const { routineName, details } = location.state.routineData;
      setRoutineName(routineName);
      setDetails(details);
    } else if (isEditing) {
      // 수정 모드인데 데이터 없이 URL로 직접 접근한 경우
      // (백엔드에 단일 루틴 조회 API가 없으므로 목록 페이지로 보냄)
      alert("잘못된 접근입니다.");
      navigate("/routines");
    }
  }, [isEditing, routineId, navigate, location.state]);

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newDetails = [...details];
    const numericFields = ['set', 'rep', 'time', 'orderNumber'];
    newDetails[index][name] = numericFields.includes(name) ? parseInt(value, 10) || 0 : value;
    setDetails(newDetails);
  };

  const addDetail = () => {
    setDetails(prev => [...prev, { orderNumber: prev.length + 1, name: '', set: 0, rep: 0, time: 0 }]);
  };

  const removeDetail = (index) => {
    if (details.length > 1) {
      setDetails(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routineName.trim()) {
      setError("루틴 이름을 입력해주세요.");
      return;
    }
    
    // 👇 [수정] 백엔드 DTO에 맞게 details -> routineDetails로 필드명을 변경합니다.
    const payload = { routineName, routineDetails: details };
    
    try {
      if (isEditing) {
        await api.put(`/routine/${routineId}`, payload);
        alert("루틴이 수정되었습니다.");
      } else {
        await api.post('/routine', payload);
        alert("새 루틴이 생성되었습니다.");
      }
      navigate('/routines');
    } catch (err) {
      setError(err.response?.data?.message || "요청에 실패했습니다.");
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{isEditing ? '루틴 수정' : '새 루틴 만들기'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="routineName" className="block text-sm font-medium text-gray-700">루틴 이름</label>
          <input type="text" id="routineName" value={routineName} onChange={e => setRoutineName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300"/>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">운동 상세</h2>
          {details.map((detail, index) => (
            <div key={index} className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-3 p-3 border rounded-md bg-gray-50 items-center">
              <input type="number" name="orderNumber" placeholder="순서" value={detail.orderNumber} onChange={e => handleDetailChange(index, e)} className="sm:col-span-1 rounded-md border-gray-300" />
              <input type="text" name="name" placeholder="운동 이름" value={detail.name} onChange={e => handleDetailChange(index, e)} required className="col-span-2 sm:col-span-3 rounded-md border-gray-300" />
              <input type="number" name="set" placeholder="세트" value={detail.set} onChange={e => handleDetailChange(index, e)} className="rounded-md border-gray-300" />
              <div className="flex items-center"><input type="number" name="rep" placeholder="횟수" value={detail.rep} onChange={e => handleDetailChange(index, e)} className="w-full rounded-md border-gray-300" />{details.length > 1 && <button type="button" onClick={() => removeDetail(index)} className="ml-2 text-red-500 p-1">&times;</button>}</div>
            </div>
          ))}
          <button type="button" onClick={addDetail} className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">+ 운동 추가</button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="text-right"><button type="submit" className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700">{isEditing ? '수정 완료' : '생성하기'}</button></div>
      </form>
    </div>
  );
}