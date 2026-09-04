import { SectionCard } from './SectionCard';
import { ArrowDown, Coffee, Lightbulb, GraduationCap, Zap } from 'lucide-react';

export function TriageSection() {
  const rules = ['看到就先进 Inbox', '不在当下整理', '用过才进 Core', '一周扫进 Compost', 'Core 必须可复制'];
  const triageFlow = [
    { type: '放松型', icon: Coffee, color: 'from-amber-400 to-amber-500', action: '只消费不沉淀', channels: ['Spotify', 'ASMR', '随便刷'], destination: '无需保存' },
    { type: '灵感型', icon: Lightbulb, color: 'from-pink-400 to-pink-500', action: '收集但不立刻做', channels: ['X', 'Pinterest', 'Telegram'], destination: '→ Inbox' },
    { type: '学习型', icon: GraduationCap, color: 'from-blue-400 to-blue-500', action: '需要提炼', channels: ['微信读书', 'Substack', 'YouTube 大V'], destination: '→ NotebookLM' },
    { type: '生成型', icon: Zap, color: 'from-green-400 to-green-500', action: '要出东西', channels: ['ChatGPT', 'Gemini', 'Perplexity', 'Grok'], destination: '→ 产出区' },
  ];

  return (
    <SectionCard title="C. Triage" color="bg-gradient-to-r from-orange-500 to-red-500" width="w-96" instructions={['看完内容立刻判断类型', '不同类型走不同流程', '放松型无需记录，直接享受']}>
      <div className="space-y-6">
        <p className="text-sm text-slate-600 font-medium">分流规则：看完下一步去哪</p>
        <div className="space-y-4">
          {triageFlow.map((flow, index) => {
            const Icon = flow.icon;
            return (
              <div key={index}>
                <div className={`bg-gradient-to-r ${flow.color} rounded-xl p-4 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold">{flow.type}</span>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{flow.action}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {flow.channels.map((channel, i) => (
                      <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded">{channel}</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold">{flow.destination}</p>
                </div>
                {index < triageFlow.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <p className="text-xs font-bold text-orange-900 mb-2">5 条简单规则</p>
          <div className="space-y-1">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">{index + 1}</div>
                <span className="text-xs text-orange-900">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
