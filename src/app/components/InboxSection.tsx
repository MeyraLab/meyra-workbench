import { SectionCard } from './SectionCard';
import { Sparkles } from 'lucide-react';

export function InboxSection() {
  const sampleCards = [
    { platform: 'X', capture: 'AI 生成音乐的情绪设计框架', useFor: '音乐' },
    { platform: 'Pinterest', capture: '极简主义天主教艺术风格参考', useFor: '视觉' },
    { platform: 'YouTube', capture: 'Lectio Divina 祈祷法教学', useFor: '灵修' },
  ];

  return (
    <SectionCard
      title="A. Inbox"
      color="bg-gradient-to-r from-purple-500 to-purple-600"
      instructions={[
        '看到任何有价值的内容，立刻捕获进来',
        '不需要整理分类，只记录关键信息',
        '每天最多收集 3-5 条，保持轻量'
      ]}
    >
      <div className="space-y-4">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            先收再说，不做判断
          </p>
          <p className="text-xs text-purple-700 mt-1">10 秒捕获区</p>
        </div>
        {sampleCards.map((card, index) => (
          <div key={index} className="bg-white border-2 border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">{card.platform}</span>
              <span className="text-xs text-slate-500">{card.useFor}</span>
            </div>
            <p className="text-sm text-slate-800 font-medium mb-3">{card.capture}</p>
            <div className="h-20 bg-slate-100 rounded border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-xs text-slate-400">截图/链接占位</span>
            </div>
          </div>
        ))}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4">
          <div className="space-y-2 text-xs text-slate-400">
            <div>• 来源平台：_______</div>
            <div>• 一句话抓点：_______</div>
            <div>• 用在哪：音乐/视觉/写作/工作/灵修</div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
