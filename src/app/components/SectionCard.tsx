import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  index?: string;
  width?: string;
  children: ReactNode;
  instructions?: string[];
  color?: string;
}

export function SectionCard({ title, index, children, instructions }: SectionCardProps) {
  return (
    <section className="w-full border border-line bg-elev">
      <header className="border-b border-line px-5 py-4">
        {index ? <p className="os-label mb-1">{index}</p> : null}
        <h2 className="text-sm font-medium">{title}</h2>
      </header>
      <div className="px-5 py-5">{children}</div>
      {instructions ? (
        <footer className="border-t border-line px-5 py-4">
          <p className="os-label mb-2">How to use</p>
          <ul className="space-y-1.5">
            {instructions.map((instruction) => (
              <li key={instruction} className="text-xs leading-relaxed text-mute">
                {instruction}
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </section>
  );
}
