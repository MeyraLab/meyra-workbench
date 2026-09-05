import { HOZANA } from './icons/hozana';
import { LOVABLE } from './icons/lovable';

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const svgIcon = (body: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`)}`;

// Prefer official brand assets when the brand publishes them. For reference directories
// and personal projects without a dedicated brand mark, use their own favicon or a
// neutral semantic mark instead of incorrectly reusing another brand's logo.
// Shared API mark: white background, black rounded frame, black "API" lettering.
const API_ICON = svgIcon('<rect x="2.5" y="5" width="19" height="14" rx="3" fill="#000"/><rect x="5.2" y="8.2" width="13.6" height="7.6" fill="#fff"/><text x="12" y="13.65" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="5.2" font-weight="700" fill="#000">API</text>');

export const APP_IMAGES: Record<string, string> = {
  // Canva's official UI guidance specifies its icon logo for surfaces below 50px.
  Canva: 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg',

  // Manus publishes an official standalone glyph for compact brand marks.
  Manus: 'https://files.manuscdn.com/assets/image/brand/image/Manus-Glyph-Black.svg',

  Hozana: HOZANA,
  Lovable: LOVABLE,
  DeepSeek: favicon('deepseek.com'),

  // All API services in Explore use exactly the same API mark.
  'OpenAI API': API_ICON,
  'DeepSeek API': API_ICON,
  'Cheaper Inference': API_ICON,

  'Component Gallery': favicon('component.gallery'),
  Curations: favicon('curations.supply'),
  Flowbite: favicon('flowbite.com'),
  Material: favicon('m3.material.io'),
  'Apple HIG': favicon('developer.apple.com'),
  TOOOLS: favicon('toools.design'),
  Mobbin: favicon('mobbin.com'),

  // Use the official WeChat public-account favicon rather than a cropped local asset.
  '公众号': favicon('mp.weixin.qq.com'),
  InkPai: svgIcon('<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><path d="M8 8h8v2H8zm0 4h5v2H8z" fill="white"/>'),
  'InkPai (Admin)': svgIcon('<rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><path d="M8 8h8v2H8zm0 4h5v2H8z" fill="white"/>'),
  'Design Engineer Tools': favicon('designengineer.tools'),
};
