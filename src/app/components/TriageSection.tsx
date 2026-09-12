import { Coffee, GraduationCap, Lightbulb, Zap } from "lucide-react";
import { SectionCard } from "./SectionCard";

export function TriageSection() {
  const rules = ["看到就先进 Inbox", "不在当下整理", "用过才进 Core", "一周扫进 Compost", "Core 必须可复制"];
  const triageFlow = [
    { type: "放松型", icon: Coffee, action: "只消费不沉淀", channels: ["Spotify", "ASMR", "随便刷"], destination: "无需保存" },
    { type: "灵感型", icon: Lightbulb, action: "收集但不立刻做", channels: ["X", "Pinterest", "Telegram"], destination: "→ Inbox" },
    { type: "学习型", icon: GraduationCap, action: "需要提炼", channels: ["微信读书", "Substack", "YouTube 大V"], destination: "→ NotebookLM" },
    { type: "生成型", icon: Zap, action: "要出东西", channels: ["ChatGPT", "Gemini", "Perplexity", "Grok"], destination: "→ 产出区" },
  ];

  return (
    <SectionCard
      title="C. Triage"
      instructions={["看完内容立刻判断类型", "不同类型走不同流程", "放松型无需记录，直接享受"]}
    >
      <div className="space-y-4">
        <p className="os-label">Where it goes next</p>
        {triageFlow.map((flow) => {
          const Icon = flow.icon;
          return (
            <div key={flow.type} className="border border-line px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{flow.type}</span>
              </div>
              <p className="mb-2 text-sm text-mute">{flow.action}</p>
              <div className="mb-2 flex flex-wrap gap-1">
                {flow.channels.map((channel) => (
                  <span key={channel} className="os-label px-2 py-1" style={{ background: "var(--chip)" }}>
                    {channel}
                  </span>
                ))}
              </div>
              <p className="os-label" style={{ color: "var(--text)" }}>
                {flow.destination}
              </p>
            </div>
          );
        })}
        <div className="border border-line px-4 py-3">
          <p className="os-label mb-2">Five rules</p>
          <div className="space-y-1">
            {rules.map((rule, index) => (
              <p key={rule} className="text-xs text-mute">
                {String(index + 1).padStart(2, "0")} {rule}
              </p>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
