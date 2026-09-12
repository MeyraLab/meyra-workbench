import { FileText, Layers, Package, Rocket } from "lucide-react";
import { SectionCard } from "./SectionCard";

export function CoreSection() {
  const coreTypes = [
    {
      title: "Prompt Templates",
      icon: FileText,
      examples: [
        { title: "生图：Minimal Luxury 风格", scenario: "需要极简高级感视觉", input: "情绪词 + 色调 + 元素", output: "统一风格的视觉方案", nextAction: "在 Gemini 中测试 3 张" },
        { title: "音乐：Contemplative Ambient", scenario: "需要冥想/专注背景音乐", input: "BPM + 乐器 + 情绪关键词", output: "可复用的音乐框架", nextAction: "导出到 Spotify 参考列表" },
      ],
    },
    {
      title: "Frameworks",
      icon: Layers,
      examples: [
        { title: "Incompressible 决策法", scenario: "需要做重要选择", input: "选项 + 价值观 + 限制条件", output: "清晰的优先级排序", nextAction: "写下最不可压缩的 1 件事" },
      ],
    },
    {
      title: "Reference Packs",
      icon: Package,
      examples: [
        { title: "天主教美学参考包", scenario: "需要宗教主题设计", input: "主题词（如 Silence, Prayer）", output: "配色 + 构图 + 字体组合", nextAction: "保存到 Pinterest Board" },
      ],
    },
    {
      title: "Project Seeds",
      icon: Rocket,
      examples: [
        { title: "Editorial Gaze 系列", scenario: "本周主题创作", input: "1 个核心概念", output: "3 个 30 分钟可完成的子任务", nextAction: "选择 1 个立刻开始" },
      ],
    },
  ];

  return (
    <SectionCard
      title="D. Core"
      instructions={["只保存真正用过且有效的模板", "每个模板必须可以在 10 分钟内复用", "定期更新，删除不再使用的内容"]}
    >
      <div className="space-y-4">
        <p className="os-label">Reusable assets</p>
        {coreTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.title} className="border border-line">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{type.title}</span>
              </div>
              <div className="space-y-3 p-3">
                {type.examples.map((example) => (
                  <div key={example.title} className="border border-line px-3 py-3 text-xs">
                    <p className="mb-2 font-medium">{example.title}</p>
                    <div className="space-y-1 text-mute">
                      <p>适用场景：{example.scenario}</p>
                      <p>输入：{example.input}</p>
                      <p>输出：{example.output}</p>
                    </div>
                    <p className="mt-2 border-t border-line pt-2 text-ink">→ {example.nextAction}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
