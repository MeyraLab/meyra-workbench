export type AppCategory = '外网' | '建造' | '自制' | '设计' | '资料';

export type AppEntry = {
  name: string;
  category: AppCategory;
  url: string;
  icon: import('./BrandIcon').BrandId;
};

export const CATEGORIES: AppCategory[] = ['外网', '建造', '自制', '设计', '资料'];

export const APPS: AppEntry[] = [
  { name: 'X', icon: 'x', category: '外网', url: 'https://x.com' },
  { name: 'Grok', icon: 'grok', category: '外网', url: 'https://grok.com' },
  { name: 'Lovable', icon: 'lovable', category: '外网', url: 'https://lovable.dev' },
  { name: 'GitHub', icon: 'github', category: '外网', url: 'https://github.com' },
  { name: 'Reddit', icon: 'reddit', category: '外网', url: 'https://reddit.com' },
  { name: 'Substack', icon: 'substack', category: '外网', url: 'https://substack.com' },
  { name: 'Hozana', icon: 'hozana', category: '外网', url: 'https://hozana.org' },
  { name: 'Google 文档', icon: 'docs', category: '外网', url: 'https://docs.google.com' },
  { name: 'NotebookLM', icon: 'notebooklm', category: '外网', url: 'https://notebooklm.google.com' },
  { name: 'ChatGPT', icon: 'chatgpt', category: '外网', url: 'https://chatgpt.com' },
  { name: 'Gemini', icon: 'gemini', category: '外网', url: 'https://gemini.google.com' },
  { name: 'YouTube', icon: 'youtube', category: '外网', url: 'https://youtube.com' },
  { name: 'Figma', icon: 'figma', category: '外网', url: 'https://figma.com' },
  { name: 'Pinterest', icon: 'pinterest', category: '外网', url: 'https://pinterest.com' },
  { name: 'Suno', icon: 'suno', category: '外网', url: 'https://suno.com' },
  { name: 'Canva', icon: 'canva', category: '外网', url: 'https://canva.com' },
  { name: 'Cursor', icon: 'cursor', category: '建造', url: 'https://cursor.com' },
  { name: 'Vercel', icon: 'vercel', category: '建造', url: 'https://vercel.com' },
  { name: 'Cloudflare', icon: 'cloudflare', category: '建造', url: 'https://dash.cloudflare.com' },
  { name: 'Supabase', icon: 'supabase', category: '建造', url: 'https://supabase.com' },
  { name: 'Manus', icon: 'link', category: '建造', url: 'https://manus.im' },
  { name: 'DeepSeek', icon: 'deepseek', category: '建造', url: 'https://platform.deepseek.com' },
  { name: '公众号', icon: 'wechat', category: '建造', url: 'https://mp.weixin.qq.com' },
  { name: '墨排后台', icon: 'cloudflare', category: '建造', url: 'https://dash.cloudflare.com' },
  { name: '书摘卡片', icon: 'link', category: '自制', url: 'https://github.com/MeyraLab' },
  { name: '图片书摘', icon: 'link', category: '自制', url: 'https://github.com/MeyraLab' },
  { name: '墨排编辑器', icon: 'wechat', category: '自制', url: 'https://dash.cloudflare.com' },
  { name: '墨排管理', icon: 'cloudflare', category: '自制', url: 'https://dash.cloudflare.com' },
  { name: "Meyra's 工作台", icon: 'link', category: '自制', url: '/' },
  { name: 'Component Gallery', icon: 'link', category: '设计', url: 'https://component.gallery' },
  { name: 'Curations', icon: 'link', category: '设计', url: 'https://www.curations.supply' },
  { name: 'Flowbite', icon: 'link', category: '设计', url: 'https://flowbite.com' },
  { name: 'Material', icon: 'link', category: '设计', url: 'https://m3.material.io' },
  { name: 'Apple HIG', icon: 'apple', category: '设计', url: 'https://developer.apple.com/design/human-interface-guidelines' },
  { name: 'TOOOLS', icon: 'link', category: '设计', url: 'https://www.toools.design' },
  { name: 'Mobbin', icon: 'link', category: '设计', url: 'https://mobbin.com' },
  { name: 'OpenAI API', icon: 'chatgpt', category: '资料', url: 'https://platform.openai.com' },
  { name: '微信读书', icon: 'weread', category: '资料', url: 'https://weread.qq.com' },
  { name: 'Perplexity', icon: 'perplexity', category: '资料', url: 'https://perplexity.ai' },
  { name: 'Telegram', icon: 'telegram', category: '资料', url: 'https://web.telegram.org' },
  { name: 'Spotify', icon: 'spotify', category: '资料', url: 'https://open.spotify.com' },
  { name: 'Google Drive', icon: 'drive', category: '资料', url: 'https://drive.google.com' },
  { name: 'Obsidian', icon: 'obsidian', category: '资料', url: 'obsidian://open' },
];
