export type AppRole = 'now' | 'backup' | 'explore' | 'design' | 'rest';

export type AppEntry = {
  name: string;
  role: AppRole;
  url: string;
  icon: import('./BrandIcon').BrandId;
};

export const ROLES: AppRole[] = ['now', 'backup', 'explore', 'design', 'rest'];

export const ROLE_LABELS: Record<AppRole, string> = {
  now: 'NOW',
  backup: 'BACKUP',
  explore: 'EXPLORE',
  design: '设计 / 资源',
  rest: 'REST',
};

export const APPS: AppEntry[] = [
  { name: 'Grok', icon: 'grok', role: 'now', url: 'https://grok.com' },
  { name: 'Cursor', icon: 'cursor', role: 'now', url: 'https://cursor.com' },
  { name: 'GitHub', icon: 'github', role: 'now', url: 'https://github.com/MeyraLab/inkpai' },
  { name: 'Vercel', icon: 'vercel', role: 'now', url: 'https://vercel.com' },
  { name: 'InkPai', icon: 'wechat', role: 'now', url: 'https://inkpai.hongmeichen1219.workers.dev' },
  { name: 'InkPai (Admin)', icon: 'wechat', role: 'now', url: 'https://inkpai.hongmeichen1219.workers.dev/admin' },
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
  { name: 'DeepSeek', icon: 'deepseek', role: 'explore', url: 'https://chat.deepseek.com' },
  { name: 'Supabase', icon: 'supabase', role: 'explore', url: 'https://supabase.com' },
  { name: 'Perplexity', icon: 'perplexity', role: 'explore', url: 'https://perplexity.ai' },
  { name: 'Telegram', icon: 'telegram', role: 'explore', url: 'https://web.telegram.org' },
  { name: '微信读书', icon: 'weread', role: 'explore', url: 'https://weread.qq.com' },
  { name: 'Google Drive', icon: 'drive', role: 'explore', url: 'https://drive.google.com' },
  { name: 'Obsidian', icon: 'obsidian', role: 'explore', url: 'obsidian://open' },

  { name: 'Design Engineer Tools', icon: 'figma', role: 'design', url: 'https://designengineer.tools' },

  { name: 'Spotify', icon: 'spotify', role: 'rest', url: 'https://open.spotify.com' },
  { name: 'Hozana', icon: 'hozana', role: 'rest', url: 'https://hozana.org' },
];
