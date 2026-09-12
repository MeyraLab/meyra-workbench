import { useState } from "react";
import { SectionCard } from "./SectionCard";

export function CompostSection() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Inbox 未用内容 → 直接丢 Compost", checked: false },
    { id: 2, text: "只保留：真正用过的 3–5 个", checked: false },
    { id: 3, text: "Core 只留可复制版本", checked: false },
    { id: 4, text: "给本周的 1 个主题命名", checked: false },
    { id: 5, text: "写一句 Anchor：Incompressible", checked: false },
  ]);

  return (
    <SectionCard
      title="F. Compost"
      instructions={["每周五花 5 分钟清理", "不要留恋未使用的内容", "保持系统轻量，才能持续运转"]}
    >
      <div className="space-y-4">
        <p className="os-label">Weekly 5-minute clear</p>
        <div className="space-y-2">
          {checklist.map((item) => (
            <label key={item.id} className="flex min-h-11 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  setChecklist((prev) =>
                    prev.map((row) => (row.id === item.id ? { ...row, checked: !row.checked } : row)),
                  )
                }
                className="mt-1 h-4 w-4"
              />
              <span className={`text-sm ${item.checked ? "text-dim line-through" : ""}`}>{item.text}</span>
            </label>
          ))}
        </div>
        <div className="border border-line px-4 py-3">
          <p className="os-label mb-2">This week</p>
          <div className="space-y-1 text-sm">
            <p>Minimal Luxury</p>
            <p>Prayer Silence</p>
            <p>Editorial Gaze</p>
          </div>
        </div>
        <p className="text-sm">
          Incompressible
          <span className="mt-1 block text-xs text-mute">只保留最不可压缩的部分</span>
        </p>
      </div>
    </SectionCard>
  );
}
