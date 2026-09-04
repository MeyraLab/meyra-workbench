import { SectionCard } from './SectionCard';
import { Image, FileText, Music, AlertCircle } from 'lucide-react';

export function OutputSection() {
  const pipelines = [
    { type: '视觉', icon: Image, color: 'from-pink-500 to-rose-500', steps: ['Pinterest/Telegram', 'Gemini(Nano Banana Pro)', '选片', '存入 Drive', 'Obsidian Core（可复制 Prompt）'], blockages: ['输入太多', '只收不做'] },
    { type: '内容', icon: FileText, color: 'from-blue-500 to-indigo-500', steps: ['Substack/YouTube/X', 'Perplexity/Grok', 'ChatGPT 结构化', 'NotebookLM 讲义化', 'Obsidian Core（提炼要点）'], blockages: ['信息过载', '做了不沉淀'] },
    { type: '音乐', icon: Music, color: 'from-green-500 to-emerald-500', steps: ['灵感文字/氛围', 'ChatGPT 结构', 'Spotify 参考', '生成与迭代', 'Core（结构模板 + 情绪词库）'], blockages: ['输入太多', '只收不做'] },
  ];

  return (
    <SectionCard title="E. Output" color="bg-gradient-to-r from-emerald-500 to-teal-600" width="w-[480px]" instructions={['每条流水线都要走到最后一步（沉淀进 Core）', '注意卡点，避免只收集不产出', '产出后立刻提炼可复用部分']}>
      <div className="space-y-6">
        <p className="text-sm text-slate-600 font-medium">产出区：把信息变作品</p>
        {pipelines.map((pipeline, index) => {
          const Icon = pipeline.icon;
          return (
            <div key={index} className="border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className={`bg-gradient-to-r ${pipeline.color} text-white px-4 py-2 flex items-center gap-2`}>
                <Icon className="w-4 h-4" />
                <span className="font-bold">{pipeline.type}流水线</span>
              </div>
              <div className="p-4 bg-white">
                <div className="space-y-2">
                  {pipeline.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{stepIndex + 1}</div>
                      <div className="flex-1 bg-slate-50 px-3 py-2 rounded text-xs text-slate-800">{step}</div>
                      {stepIndex < pipeline.steps.length - 1 && <div className="text-slate-400">→</div>}
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-900">常见卡点</span>
                  </div>
                  <div className="flex gap-2">
                    {pipeline.blockages.map((blockage, i) => (
                      <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{blockage}</span>
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
