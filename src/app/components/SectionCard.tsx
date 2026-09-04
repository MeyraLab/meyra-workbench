import { ReactNode } from 'react';
interface SectionCardProps {
  title: string;
  index?: string;
  width?: string;
  children: ReactNode;
  instructions?: string[];
  color?: string;
}
export function SectionCard({ title, index, width = 'w-[22rem]', children, instructions }: SectionCardProps) {
  return (
    <section className={`${width} max-w-[92vw] flex-shrink-0`}>
      <div className="h-full flex flex-col rounded-[28px] border border-white/8 bg-[#141416] transition-colors duration-200 hover:border-white/16">
        <header className="px-6 pt-6 pb-4 border-b border-white/8">
          {index && <p className="text-[11px] tracking-[0.18em] uppercase text-[#71717a] mb-2">{index}</p>}
          <h2 className="text-[22px] leading-tight text-[#f4f4f5]" style={{ fontFamily: 'Instrument Serif, serif' }}>{title}</h2>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
        {instructions && (
          <footer className="px-6 py-4 border-t border-white/8">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#71717a] mb-2">How to use</p>
            <ul className="space-y-1.5">{instructions.map((instruction, i) => (<li key={i} className="text-xs text-[#a1a1aa] leading-relaxed">{instruction}</li>))}</ul>
          </footer>
        )}
      </div>
    </section>
  );
}
