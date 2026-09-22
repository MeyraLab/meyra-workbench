import { SectionCard } from "./SectionCard";

export function InboxSection() {
  const sampleCards = [
    { platform: "X", capture: "AI 音乐情绪框架", useFor: "音乐" },
    { platform: "Pinterest", capture: "极简天主教艺术", useFor: "视觉" },
    { platform: "YouTube", capture: "Lectio Divina 教学", useFor: "灵修" },
  ];

  return (
    <SectionCard
      title="A. Inbox"
      instructions={["看到就记", "先记，不分类", "每天最多 3–5 条"]}
    >
      <div className="space-y-3">
        <p className="os-label">Capture first.</p>
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
