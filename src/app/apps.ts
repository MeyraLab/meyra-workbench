export type AppRole = 'now' | 'backup' | 'explore' | 'rest';

export type AppEntry = {
  name: string;
  role: AppRole;
  url: string;
  icon: import('./BrandIcon').BrandId;
};

export const ROLES: AppRole[] = ['now', 'backup', 'explore', 'rest'];

export const ROLE_LABELS: Record<AppRole, string> = {
  now: 'NOW',
  backup: 'BACKUP',
  explore: 'EXPLORE',
  rest: 'REST',
};

export const APPS: AppEntry[] = [
  { name: 'Grok', icon: 'grok', role: 'now', url: 'https://grok.com' },
  { name: 'Cursor', icon: 'cursor', role: 'now', url: 'https://cursor.com' },
  { name: 'GitHub', icon: 'github', role: 'now', url: 'https://github.com/MeyraLab/inkpai' },
  { name: 'Vercel', icon: 'vercel', role: 'now', url: 'https://vercel.com' },
  { name: 'InkPai', icon: 'wechat', role: 'now', url: 'https://inkpai.lovable.app' },
  { name: '公众号', icon: 'wechat', role: 'now', url: 'https://mp.weixin.qq.com' },

  { name: 'ChatGPT', icon: 'chatgpt', role: 'backup', url: 'https://chatgpt.com' },
  { name: 'Cloudflare', icon: 'cloudflare', role: 'backup', url: 'https://dash.cloudflare.com' },
  { name: 'Figma', icon: 'figma', role: 'backup', url: 'https://figma.com' },
  { name: 'Google 文档', icon: 'docs', role: 'backup', url: 'https://docs.google.com' },

  { name: 'X', icon: 'x', role: 'explore', url: 'https://x.com' },
  { name: 'Lovable', icon: 'lovable', role: 'explore', url: 'https://lovable.dev' },
  { name: 'Reddit', icon: 'reddit', role: 'explore', url: 'https://reddit.com' },
  { name: 'Substack', icon: 'substack', role: 'explore', url: 'https://substack.com' },
  { name: 'NotebookLM', icon: 'notebooklm', role: 'explore', url: 'https://notebooklm.google.com' },
  { name: 'Gemini', icon: 'gemini', role: 'explore', url: 'https://gemini.google.com' },
  { name: 'YouTube', icon: 'youtube', role: 'explore', url: 'https://youtube.com' },
  { name: 'Pinterest', icon: 'pinterest', role: 'explore', url: 'https://pinterest.com' },
  { name: 'Suno', icon: 'suno', role: 'explore', url: 'https://suno.com' },
  { name: 'Canva', icon: 'canva', role: 'explore', url: 'https://canva.com' },
  { name: 'Manus', icon: 'cursor', role: 'explore', url: 'https://manus.im' },
  { name: 'DeepSeek', icon: 'deepseek', role: 'explore', url: 'https://platform.deepseek.com' },
  { name: 'Supabase', icon: 'supabase', role: 'explore', url: 'https://supabase.com' },
  { name: 'OpenAI API', icon: 'chatgpt', role: 'explore', url: 'https://platform.openai.com' },
  { name: 'Perplexity', icon: 'perplexity', role: 'explore', url: 'https://perplexity.ai' },
  { name: 'Telegram', icon: 'telegram', role: 'explore', url: 'https://web.telegram.org' },
  { name: '微信读书', icon: 'weread', role: 'explore', url: 'https://weread.qq.com' },
  { name: 'Google Drive', icon: 'drive', role: 'explore', url: 'https://drive.google.com' },
  { name: 'Obsidian', icon: 'obsidian', role: 'explore', url: 'obsidian://open' },
  { name: 'Component Gallery', icon: 'figma', role: 'explore', url: 'https://component.gallery' },
  { name: 'Curations', icon: 'figma', role: 'explore', url: 'https://www.curations.supply' },
  { name: 'Flowbite', icon: 'figma', role: 'explore', url: 'https://flowbite.com' },
  { name: 'Material', icon: 'figma', role: 'explore', url: 'https://m3.material.io' },
  { name: 'Apple HIG', icon: 'figma', role: 'explore', url: 'https://developer.apple.com/design/human-interface-guidelines' },
  { name: 'TOOOLS', icon: 'figma', role: 'explore', url: 'https://www.toools.design' },
  { name: 'Mobbin', icon: 'figma', role: 'explore', url: 'https://mobbin.com' },
  { name: '墨排', icon: 'wechat', role: 'explore', url: 'https://inkpai.lovable.app' },
  { name: '书摘卡片', icon: 'docs', role: 'explore', url: 'https://github.com/MeyraLab' },
  { name: '图片书摘', icon: 'pinterest', role: 'explore', url: 'https://github.com/MeyraLab' },

  { name: 'Spotify', icon: 'spotify', role: 'rest', url: 'https://open.spotify.com' },
  { name: 'Hozana', icon: 'hozana', role: 'rest', url: 'https://hozana.org' },
];
