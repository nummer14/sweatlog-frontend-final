import React, { useEffect, useState } from "react";
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  applyTemplateToRoutine,
} from "@/api/templates";
import TemplateForm from "@/components/TemplateForm.jsx";
import TemplateCard from "@/components/TemplateCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Templates() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async (p = 0) => {
    try {
      setLoading(true);
      const res = await fetchTemplates(p, size);
      setData(res.data);
      setPage(p);
    } catch (e) {
      console.error(e);
      setError("템플릿을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
  }, []);

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      await createTemplate(payload);
      setShowForm(false);
      setEditing(null);
      await load(0);
    } catch (e) {
      console.error(e);
      alert("템플릿 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      setSubmitting(true);
      await updateTemplate(id, payload);
      setShowForm(false);
      setEditing(null);
      await load(page);
    } catch (e) {
      console.error(e);
      alert("템플릿 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("이 템플릿을 삭제할까요?")) return;
    try {
      await deleteTemplate(id);
      await load(page);
    } catch (e) {
      console.error(e);
      alert("템플릿 삭제에 실패했습니다.");
    }
  };

  const handleApply = async (id) => {
    try {
      await applyTemplateToRoutine(id);
      alert("루틴이 생성되었습니다.");
      navigate("/my-routines");
    } catch (e) {
      console.error(e);
      alert("루틴으로 변환에 실패했습니다.");
    }
  };

  const totalPages = data?.totalPages ?? 0;
  const content = data?.content ?? [];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">템플릿</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm((v) => !v);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + 새 템플릿 만들기
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? "템플릿 수정" : "새 템플릿"}
          </h2>
          <TemplateForm
            initialValue={editing}
            submitting={submitting}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSubmit={(payload) =>
              editing ? handleUpdate(editing.id, payload) : handleCreate(payload)
            }
          />
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-gray-500">불러오는 중...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-600">{error}</div>
      ) : content.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center text-gray-600">
          아직 저장된 템플릿이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onEdit={() => {
                  setEditing(tpl);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(tpl.id)}
                onApplyToRoutine={() => handleApply(tpl.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={page <= 0}
                className="rounded-md border px-3 py-1 text-sm disabled:text-gray-400"
                onClick={() => load(page - 1)}
              >
                이전
              </button>
              <span className="text-sm text-gray-600">
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                className="rounded-md border px-3 py-1 text-sm disabled:text-gray-400"
                onClick={() => load(page + 1)}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
