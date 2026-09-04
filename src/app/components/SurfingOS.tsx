import { InboxSection } from './InboxSection';
import { ChannelsMap } from './ChannelsMap';
import { TriageSection } from './TriageSection';
import { CoreSection } from './CoreSection';
import { OutputSection } from './OutputSection';
import { CompostSection } from './CompostSection';
import { QuickStart } from './QuickStart';

const stages = ['Inbox', 'Channels', 'Triage', 'Core', 'Output', 'Compost'];

export function SurfingOS() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f4f4f5]">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0b0c]/80 backdrop-blur-xl">
        <div className="px-5 md:px-8 py-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#71717a] mb-1">MeyraLab</p>
            <h1 className="text-[28px] md:text-[34px] leading-none text-[#ece7dc]" style={{ fontFamily: 'Instrument Serif, serif' }}>
              Meyra's 工作台
            </h1>
          </div>
          <p className="hidden sm:block text-sm text-[#a1a1aa] pb-1">信息流 → 灵感 → 产出</p>
        </div>
        <nav className="px-5 md:px-8 pb-3 flex gap-2 overflow-x-auto" aria-label="工作流分区">
          {stages.map((stage) => (
            <span key={stage} className="shrink-0 text-xs text-[#a1a1aa] border border-white/8 rounded-full px-3 py-1.5">{stage}</span>
          ))}
        </nav>
      </header>
      <main className="md:overflow-x-auto">
        <div className="flex flex-col md:flex-row md:inline-flex gap-5 p-5 md:p-8 min-h-[calc(100vh-116px)]">
          <InboxSection />
          <ChannelsMap />
          <TriageSection />
          <CoreSection />
          <OutputSection />
          <CompostSection />
        </div>
      </main>
      <QuickStart />
    </div>
  );
}
