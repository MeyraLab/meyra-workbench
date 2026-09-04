import { InboxSection } from './InboxSection';
import { ChannelsMap } from './ChannelsMap';
import { TriageSection } from './TriageSection';
import { CoreSection } from './CoreSection';
import { OutputSection } from './OutputSection';
import { CompostSection } from './CompostSection';
import { QuickStart } from './QuickStart';
import { ArrowRight } from 'lucide-react';

export function SurfingOS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Meyra's 工作台</h1>
          <p className="text-sm text-slate-600 mt-1">信息流 → 灵感 → 产出</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-8 p-8 min-h-[calc(100vh-80px)]">
          <InboxSection />
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-400" />
          </div>
          <ChannelsMap />
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-400" />
          </div>
          <TriageSection />
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-400" />
          </div>
          <CoreSection />
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-400" />
          </div>
          <OutputSection />
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-400" />
          </div>
          <CompostSection />
        </div>
      </div>

      <QuickStart />
    </div>
  );
}
