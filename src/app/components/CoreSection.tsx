import { SectionCard } from './SectionCard';
import { FileText, Layers, Package, Rocket } from 'lucide-react';

export function CoreSection() {
  const coreTypes = [
    {
      title: 'Prompt Templates',
      icon: FileText,
      color: 'bg-purple-500',
      examples: [
        { title: '生图：Minimal Luxury 风格', scenario: '需要极简高级感视觉', input: '情绪词 + 色调 + 元素', output: '统一风格的视觉方案', nextAction: '在 Gemini 中测试 3 张' },
        { title: '音乐：Contemplative Ambient', scenario: '需要冥想/专注背景音乐', input: 'BPM + 乐器 + 情绪关键词', output: '可复用的音乐框架', nextAction: '导出到 Spotify 参考列表' },
      ],
    },
    {
      title: 'Frameworks',
      icon: Layers,
      color: 'bg-blue-500',
      examples: [
        { title: 'Incompressible 决策法', scenario: '需要做重要选择', input: '选项 + 价值观 + 限制条件', output: '清晰的优先级排序', nextAction: '写下最不可压缩的 1 件事' },
      ],
    },
    {
      title: 'Reference Packs',
      icon: Package,
      color: 'bg-green-500',
      examples: [
        { title: '天主教美学参考包', scenario: '需要宗教主题设计', input: '主题词（如 Silence, Prayer）', output: '配色 + 构图 + 字体组合', nextAction: '保存到 Pinterest Board' },
      ],
    },
    {
      title: 'Project Seeds',
      icon: Rocket,
      color: 'bg-orange-500',
      examples: [
        { title: 'Editorial Gaze 系列', scenario: '本周主题创作', input: '1 个核心概念', output: '3 个 30 分钟可完成的子任务', nextAction: '选择 1 个立刻开始' },
      ],
    },
  ];

  return (
    <SectionCard title="D. Core" color="bg-gradient-to-r from-violet-500 to-purple-600" width="w-[520px]" instructions={['只保存真正用过且有效的模板', '每个模板必须可以在 10 分钟内复用', '定期更新，删除不再使用的内容']}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600 font-medium">可复制资产库</p>
        {coreTypes.map((type, typeIndex) => {
          const Icon = type.icon;
          return (
            <div key={typeIndex} className="border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className={`${type.color} text-white px-4 py-2 flex items-center gap-2`}>
                <Icon className="w-4 h-4" />
                <span className="font-bold text-sm">{type.title}</span>
              </div>
              <div className="p-3 space-y-3 bg-white">
                {type.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                    <p className="font-bold text-slate-900 mb-2">{example.title}</p>
                    <div className="space-y-1 text-slate-600">
                      <p><span className="font-semibold">适用场景：</span>{example.scenario}</p>
                      <p><span className="font-semibold">输入：</span>{example.input}</p>
                      <p><span className="font-semibold">输出：</span>{example.output}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-300">
                      <p className="text-violet-700 font-semibold">→ {example.nextAction}</p>
                    </div>
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
