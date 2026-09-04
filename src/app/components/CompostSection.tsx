import { SectionCard } from './SectionCard';
import { Trash2, CheckSquare } from 'lucide-react';
import { useState } from 'react';

export function CompostSection() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Inbox 未用内容 → 直接丢 Compost', checked: false },
    { id: 2, text: '只保留：真正用过的 3–5 个', checked: false },
    { id: 3, text: 'Core 只留"可复制版本"', checked: false },
    { id: 4, text: '给本周的 1 个主题命名', checked: false },
    { id: 5, text: '写一句 Anchor：Incompressible', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <SectionCard title="F. Compost" color="bg-gradient-to-r from-slate-600 to-slate-700" width="w-80" instructions={['每周五花 5 分钟清理', '不要留恋未使用的内容', '保持系统轻量，才能持续运转']}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600 font-medium">清理区：每周 5 分钟</p>
        <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-5 h-5 text-slate-700" />
            <span className="font-bold text-slate-900">每周清理 Checklist</span>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={item.checked} onChange={() => toggleCheck(item.id)} className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                <span className={`text-sm flex-1 ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.text}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl p-4">
          <p className="text-xs font-semibold opacity-75 mb-2">本周主题示例</p>
          <div className="space-y-2">
            <div className="bg-white/10 rounded px-3 py-2 text-sm">Minimal Luxury</div>
            <div className="bg-white/10 rounded px-3 py-2 text-sm">Prayer Silence</div>
            <div className="bg-white/10 rounded px-3 py-2 text-sm">Editorial Gaze</div>
          </div>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-xs font-bold text-amber-900 mb-1">核心准则</p>
          <p className="text-lg font-bold text-amber-800">Incompressible</p>
          <p className="text-xs text-amber-700 mt-1">只保留最不可压缩的部分</p>
        </div>
        <div className="flex justify-center pt-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-slate-500" />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
