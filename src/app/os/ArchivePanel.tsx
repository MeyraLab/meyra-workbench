import { useEffect } from "react";
import { X } from "lucide-react";
import { ChannelsMap } from "../components/ChannelsMap";
import { CompostSection } from "../components/CompostSection";
import { CoreSection } from "../components/CoreSection";
import { InboxSection } from "../components/InboxSection";
import { OutputSection } from "../components/OutputSection";
import { TriageSection } from "../components/TriageSection";

type Props = {
  onClose: () => void;
};

export function ArchivePanel({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="os-overlay" role="dialog" aria-modal="true" aria-labelledby="archive-title">
      <button type="button" className="os-overlay-scrim" aria-label="Close archive" onClick={onClose} />
      <aside className="os-sheet os-archive">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="os-label">Archive</p>
            <h2 id="archive-title" className="mt-1 text-sm font-medium">
              Inbox / Core / Output
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center"
            style={{ background: "var(--chip)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          <p className="text-sm leading-6 text-mute">
            Capture, sort, reuse, then compost. Hidden from the workspace so the home screen stays a system, not a board.
          </p>
          <InboxSection />
          <ChannelsMap />
          <TriageSection />
          <CoreSection />
          <OutputSection />
          <CompostSection />
        </div>
      </aside>
    </div>
  );
}
