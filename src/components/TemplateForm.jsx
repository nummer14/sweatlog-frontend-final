import React, { useEffect, useMemo, useState } from "react";

const createDetailRow = () => ({ name: "", time: "", rep: "", set: "" });

export default function TemplateForm({
  initialValue,
  onCancel,
  onSubmit,
  submitting = false,
}) {
  const [purposeName, setPurposeName] = useState(initialValue?.purposeName ?? "");
  const [rows, setRows] = useState(
    initialValue?.details?.length
      ? initialValue.details.map((d) => ({
          name: d.name ?? "",
          time: d.time ?? "",
          rep: d.rep ?? "",
          set: d.set ?? "",
        }))
      : [createDetailRow()]
  );

  useEffect(() => {
    if (!initialValue) return;
    setPurposeName(initialValue.purposeName ?? "");
    setRows(
      initialValue.details?.length
        ? initialValue.details.map((d) => ({
            name: d.name ?? "",
            time: d.time ?? "",
            rep: d.rep ?? "",
            set: d.set ?? "",
          }))
        : [createDetailRow()]
    );
  }, [initialValue]);

  const addRow = () => setRows((p) => [...p, createDetailRow()]);
  const removeRow = (idx) => setRows((p) => p.filter((_, i) => i !== idx));
  const changeRow = (idx, key, val) =>
    setRows((p) => {
      const copy = [...p];
      copy[idx] = { ...copy[idx], [key]: val };
      return copy;
    });

  const invalid = useMemo(() => {
    if (!purposeName.trim()) return "템플릿 이름을 입력해주세요.";
    if (rows.length === 0) return "운동 항목을 최소 1개 추가해주세요.";
    for (const r of rows) {
      if (!r.name?.trim()) return "각 운동의 이름을 입력해주세요.";
      const timeOk = r.time !== "" && Number(r.time) > 0;
      const weightOk = r.rep !== "" && Number(r.rep) > 0 && r.set !== "" && Number(r.set) > 0;
      if (!timeOk && !weightOk) return "각 운동은 '시간(분)' 또는 '횟수+세트' 중 하나는 입력해야 합니다.";
    }
    return null;
  }, [purposeName, rows]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invalid) return alert(invalid);

    const details = rows.map((r, idx) => ({
      name: r.name.trim(),
      orderNumber: idx + 1,
      time: r.time === "" ? null : Number(r.time),
      rep:  r.rep  === "" ? null : Number(r.rep),
      set:  r.set  === "" ? null : Number(r.set),
    }));

    const payload = { purposeName, details };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900">템플릿 이름</label>
        <input
          type="text"
          value={purposeName}
          onChange={(e) => setPurposeName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="예: 하체 루틴, 아침 러닝"
        />
      </div>

      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-5 rounded-md border border-gray-200 p-4">
            <input
              type="text"
              value={row.name}
              onChange={(e) => changeRow(idx, "name", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
              placeholder="운동명 (예: 스쿼트/러닝/요가)"
            />
            <input
              type="number"
              value={row.time}
              onChange={(e) => changeRow(idx, "time", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
              placeholder="시간(분)"
            />
            <input
              type="number"
              value={row.rep}
              onChange={(e) => changeRow(idx, "rep", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
              placeholder="횟수"
            />
            <input
              type="number"
              value={row.set}
              onChange={(e) => changeRow(idx, "set", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
              placeholder="세트"
            />
            <div className="flex items-center justify-end">
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="px-3 rounded-md border text-xs text-gray-600 hover:bg-gray-50"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="w-full rounded-md border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          + 운동 항목 추가
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 text-sm text-gray-700">
          취소
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:bg-gray-400">
          {submitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
