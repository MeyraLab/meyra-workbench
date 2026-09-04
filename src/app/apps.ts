export type AppCategory = '信息' | '灵感' | '生成' | '学习' | '存储' | '放松';

export type AppEntry = {
  name: string;
  category: AppCategory;
  purpose: string;
  url: string;
  icon: 'x' | 'youtube' | 'chat' | 'spark' | 'book' | 'file' | 'cloud' | 'send' | 'music' | 'folder';
};

export const CATEGORIES: Array<'全部' | AppCategory> = ['全部', '信息', '灵感', '生成', '学习', '存储', '放松'];

export const APPS: AppEntry[] = [
  { name: 'X', icon: 'x', category: '信息', purpose: '刷推文放松 + 前沿高质量信息', url: 'https://x.com' },
  { name: 'YouTube', icon: 'youtube', category: '灵感', purpose: 'ASMR / 沉浸音乐 / 阅读祈祷冥想', url: 'https://youtube.com' },
  { name: 'ChatGPT', icon: 'chat', category: '生成', purpose: '框架构建、理解、设计助力', url: 'https://chatgpt.com' },
  { name: 'Gemini', icon: 'spark', category: '生成', purpose: '生图 + 框架助力', url: 'https://gemini.google.com' },
  { name: 'Grok', icon: 'chat', category: '生成', purpose: '最新搜索 + 理解助力', url: 'https://grok.com' },
  { name: 'Perplexity', icon: 'chat', category: '学习', purpose: '整合性搜索 + 多模型对比', url: 'https://perplexity.ai' },
  { name: 'NotebookLM', icon: 'book', category: '学习', purpose: '聚焦式学习 + 幻灯片 / 思维导图', url: 'https://notebooklm.google.com' },
  { name: 'Pinterest', icon: 'spark', category: '灵感', purpose: '灵感图 + 美学放松', url: 'https://pinterest.com' },
  { name: '微信读书', icon: 'book', category: '学习', purpose: '天主教 / 哲学 / 心理学', url: 'https://weread.qq.com' },
  { name: 'Substack', icon: 'file', category: '学习', purpose: '外网深度思考内容', url: 'https://substack.com' },
  { name: 'Google Drive', icon: 'cloud', category: '存储', purpose: '云档存储', url: 'https://drive.google.com' },
  { name: 'Telegram', icon: 'send', category: '信息', purpose: '设计与 AI 信息流', url: 'https://web.telegram.org' },
  { name: 'Spotify', icon: 'music', category: '放松', purpose: '纯音乐沉浸 + 天主教音乐', url: 'https://open.spotify.com' },
  { name: 'Obsidian', icon: 'folder', category: '存储', purpose: '本地主仓', url: 'obsidian://open' },
];
