import { useState } from 'react';
import { Rocket, X } from 'lucide-react';

export function QuickStart() {
  const [isOpen, setIsOpen] = useState(false);
  const steps = [
    '打开 → 只收 3 条进 Inbox',
    '选 1 条走分流',
    '生成 1 个小产出',
    '把可复制的写进 Core',
    '每周五清理 Compost',
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
      >
        <Rocket className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <h3 className="font-bold">今天我怎么用这张板</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-200">
            <p className="text-xs text-slate-600 text-center">5 步闭环，每天只需 15 分钟</p>
          </div>
        </div>
      )}
    </>
  );
}
