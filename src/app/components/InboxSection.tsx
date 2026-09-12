import { SectionCard } from "./SectionCard";

export function InboxSection() {
  const sampleCards = [
    { platform: "X", capture: "AI 生成音乐的情绪设计框架", useFor: "音乐" },
    { platform: "Pinterest", capture: "极简主义天主教艺术风格参考", useFor: "视觉" },
    { platform: "YouTube", capture: "Lectio Divina 祈祷法教学", useFor: "灵修" },
  ];

  return (
    <SectionCard
      title="A. Inbox"
      instructions={[
        "看到任何有价值的内容，立刻捕获进来",
        "不需要整理分类，只记录关键信息",
        "每天最多收集 3-5 条，保持轻量",
      ]}
    >
      <div className="space-y-3">
        <p className="os-label">Capture first. No judgement.</p>
        {sampleCards.map((card) => (
          <div key={card.capture} className="border border-line px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="os-label" style={{ color: "var(--text)" }}>
                {card.platform}
              </span>
              <span className="text-xs text-mute">{card.useFor}</span>
            </div>
            <p className="text-sm font-medium">{card.capture}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
