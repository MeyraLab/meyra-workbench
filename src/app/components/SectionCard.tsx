import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  color: string;
  width?: string;
  children: ReactNode;
  instructions?: string[];
}

export function SectionCard({ title, color, width = 'w-96', children, instructions }: SectionCardProps) {
  return (
    <div className={`${width} flex-shrink-0`}>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-full flex flex-col">
        <div className={`${color} rounded-t-2xl px-6 py-4`}>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
        {instructions && (
          <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">如何使用：</p>
            <ul className="space-y-1">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-xs text-slate-600 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
