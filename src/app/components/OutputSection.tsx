import { AlertCircle, FileText, Image, Music } from "lucide-react";
import { SectionCard } from "./SectionCard";

export function OutputSection() {
  const pipelines = [
    { type: "视觉", icon: Image, steps: ["Pinterest/Telegram", "Gemini(Nano Banana Pro)", "选片", "存入 Drive", "Obsidian Core（可复制 Prompt）"], blockages: ["输入太多", "只收不做"] },
    { type: "内容", icon: FileText, steps: ["Substack/YouTube/X", "Perplexity/Grok", "ChatGPT 结构化", "NotebookLM 讲义化", "Obsidian Core（提炼要点）"], blockages: ["信息过载", "做了不沉淀"] },
    { type: "音乐", icon: Music, steps: ["灵感文字/氛围", "ChatGPT 结构", "Spotify 参考", "生成与迭代", "Core（结构模板 + 情绪词库）"], blockages: ["输入太多", "只收不做"] },
  ];

  return (
    <SectionCard
      title="E. Output"
      instructions={["每条流水线都要走到最后一步（沉淀进 Core）", "注意卡点，避免只收集不产出", "产出后立刻提炼可复用部分"]}
    >
      <div className="space-y-5">
        <p className="os-label">Turn information into work</p>
        {pipelines.map((pipeline) => {
          const Icon = pipeline.icon;
          return (
            <div key={pipeline.type} className="border border-line">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{pipeline.type}流水线</span>
              </div>
              <div className="p-4">
                <ol className="space-y-2">
                  {pipeline.steps.map((step, stepIndex) => (
                    <li key={step} className="flex items-center gap-2 text-xs">
                      <span className="os-label w-5">{String(stepIndex + 1).padStart(2, "0")}</span>
                      <span className="flex-1 px-3 py-2" style={{ background: "var(--chip)" }}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 border border-line px-3 py-3">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="os-label" style={{ color: "var(--text)" }}>
                      Blockers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pipeline.blockages.map((blockage) => (
                      <span key={blockage} className="os-label px-2 py-1" style={{ background: "var(--chip)" }}>
                        {blockage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
