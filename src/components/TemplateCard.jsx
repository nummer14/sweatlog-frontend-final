import React from "react";

export default function TemplateCard({ template, onEdit, onDelete, onApplyToRoutine }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{template.purposeName}</h3>
        <div className="flex gap-2">
          <button onClick={onEdit} className="rounded-md border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">
            수정
          </button>
          <button onClick={onDelete} className="rounded-md border px-3 py-1 text-xs text-red-600 hover:bg-red-50">
            삭제
          </button>
        </div>
      </div>

      <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {(template.details ?? []).map((d) => (
          <li key={d.id ?? d.orderNumber}>
            <span className="font-medium">{d.orderNumber}. {d.name}</span>{" "}
            {d.time ? <span>· {d.time}분</span> : null}
            {d.rep ? <span> · {d.rep}회</span> : null}
            {d.set ? <span> × {d.set}세트</span> : null}
          </li>
        ))}
      </ul>

      <button
        onClick={onApplyToRoutine}
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        이 템플릿으로 루틴 만들기
      </button>
    </div>
  );
}
