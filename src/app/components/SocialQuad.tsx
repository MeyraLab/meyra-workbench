import { BrandIcon, type BrandId } from '../BrandIcon';

const ITEMS: Array<{
  name: string;
  href: string;
  icon: BrandId;
  card: 'card1' | 'card2' | 'card3' | 'card4';
  mark: string;
}> = [
  { name: 'X', href: 'https://x.com', icon: 'x', card: 'card1', mark: 'instagram' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube', card: 'card2', mark: 'twitter' },
  { name: '微信读书', href: 'https://weread.qq.com', icon: 'weread', card: 'card3', mark: 'github' },
  { name: 'Grok', href: 'https://grok.com', icon: 'grok', card: 'card4', mark: 'discord' },
];

export function SocialQuad() {
  return (
    <div className="meyra-quad" aria-label="快捷入口">
      <div className="main">
        <div className="up">
          <QuadCard item={ITEMS[0]} />
          <QuadCard item={ITEMS[1]} />
        </div>
        <div className="down">
          <QuadCard item={ITEMS[2]} />
          <QuadCard item={ITEMS[3]} />
        </div>
      </div>
    </div>
  );
}

function QuadCard({ item }: { item: (typeof ITEMS)[number] }) {
  return (
    <a
      className={item.card}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
      title={item.name}
    >
      <span className={item.mark}>
        <BrandIcon id={item.icon} className="h-7 w-7" />
      </span>
    </a>
  );
}
