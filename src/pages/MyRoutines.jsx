import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function MyRoutines() {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await api.get('/routine');
        setRoutines(response.data.content);
      } catch (err) {
        setError("루틴을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleDelete = async (routineId) => {
    if (window.confirm("정말로 이 루틴을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/routine/${routineId}`);
        setRoutines(prev => prev.filter(r => r.id !== routineId));
      } catch (err) {
        alert("루틴 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">나의 루틴</h1>
        <Link to="/routines/new" className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700">
          <PlusCircle size={20} /> 새 루틴 만들기
        </Link>
      </div>
      
      {routines.length > 0 ? (
        <div className="space-y-4">
          {routines.map(routine => (
            <div key={routine.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{routine.routineName}</h2>
                <ul className="mt-2 text-gray-600 list-decimal list-inside">
                  {routine.details.map(detail => (
                    <li key={detail.id}>{detail.name} ({detail.set}세트, {detail.rep}회)</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Link to={`/routines/edit/${routine.id}`} state={{ routineData: routine }} className="p-2 text-blue-500 hover:text-blue-700"><Edit size={18}/></Link>
                <button onClick={() => handleDelete(routine.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">생성된 루틴이 없습니다.</p>
          <p className="mt-1">첫 번째 루틴을 만들어보세요!</p>
        </div>
      )}
    </div>
  );
}