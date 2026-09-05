import { HOZANA } from './icons/hozana';
import { LOVABLE } from './icons/lovable';

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const svgIcon = (body: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`)}`;

// Prefer official brand assets when the brand publishes them. For reference directories
// and personal projects without a dedicated brand mark, use their own favicon or a
// neutral semantic mark instead of incorrectly reusing another brand's logo.
export const APP_IMAGES: Record<string, string> = {
  // Canva's official UI guidance specifies its icon logo for surfaces below 50px.
  Canva: 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg',

  // Manus publishes an official standalone glyph for compact brand marks.
  Manus: 'https://files.manuscdn.com/assets/image/brand/image/Manus-Glyph-Black.svg',

  Hozana: HOZANA,
  Lovable: LOVABLE,
  DeepSeek: favicon('deepseek.com'),
  'Cheaper Inference': favicon('cheaperinference.com'),

  'Component Gallery': favicon('component.gallery'),
  Curations: favicon('curations.supply'),
  Flowbite: favicon('flowbite.com'),
  Material: favicon('m3.material.io'),
  'Apple HIG': favicon('developer.apple.com'),
  TOOOLS: favicon('toools.design'),
  Mobbin: favicon('mobbin.com'),

  // Use the exact logo image supplied by the user for the WeChat public-account assistant.
  InkPai: svgIcon('<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><path d="M8 8h8v2H8zm0 4h5v2H8z" fill="white"/>'),
  '公众号': '/wechat-official-logo.png',
  '墨排': svgIcon('<path d="M6 4h12v3H9v3h7v3H9v4h9v3H6z" fill="currentColor"/>'),
  '书摘卡片': svgIcon('<path d="M6 3h10a3 3 0 0 1 3 3v15H8a2 2 0 0 1-2-2z" fill="currentColor"/><path d="M8 5v14c0-.55.45-1 1-1h8V6a1 1 0 0 0-1-1z" fill="white" opacity=".9"/><path d="M10 8h5v1.5h-5zm0 3h5v1.5h-5z" fill="currentColor"/>'),
  '图片书摘': svgIcon('<rect x="3" y="4" width="18" height="16" rx="2.5" fill="currentColor"/><circle cx="8.5" cy="9" r="1.5" fill="white"/><path d="m5 18 4.5-4.5 3 3 2.5-2.5L19 18z" fill="white"/>'),
};
