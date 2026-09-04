export type AppCategory = '输入' | '生成' | '灵感' | '仓库' | '建造';

export type AppEntry = {
  name: string;
  category: AppCategory;
  purpose: string;
  url: string;
  icon: import('./BrandIcon').BrandId;
};

export const CATEGORIES: Array<'全部' | AppCategory> = ['全部', '输入', '生成', '灵感', '仓库', '建造'];

export const APPS: AppEntry[] = [
  { name: 'X', icon: 'x', category: '输入', purpose: '前沿信息 + 短内容', url: 'https://x.com' },
  { name: 'Reddit', icon: 'reddit', category: '输入', purpose: '外网讨论与线索', url: 'https://reddit.com' },
  { name: 'Substack', icon: 'substack', category: '输入', purpose: '长文与深度订阅', url: 'https://substack.com' },
  { name: 'Telegram', icon: 'telegram', category: '输入', purpose: '设计与 AI 信息流', url: 'https://web.telegram.org' },
  { name: '微信读书', icon: 'weread', category: '输入', purpose: '天主教 / 哲学 / 心理学', url: 'https://weread.qq.com' },
  { name: 'Perplexity', icon: 'perplexity', category: '输入', purpose: '检索 + 多模型对照', url: 'https://perplexity.ai' },
  { name: 'Hozana', icon: 'hozana', category: '输入', purpose: '祈祷与灵修团体', url: 'https://hozana.org' },
  { name: 'Grok', icon: 'grok', category: '生成', purpose: '搜索 + 理解 + 写作', url: 'https://grok.com' },
  { name: 'ChatGPT', icon: 'chatgpt', category: '生成', purpose: '框架、理解、设计助力', url: 'https://chatgpt.com' },
  { name: 'Gemini', icon: 'gemini', category: '生成', purpose: '生图 + 框架', url: 'https://gemini.google.com' },
  { name: 'NotebookLM', icon: 'notebooklm', category: '生成', purpose: '材料提纯 / 幻灯片 / 导图', url: 'https://notebooklm.google.com' },
  { name: 'Suno', icon: 'suno', category: '生成', purpose: '生成音乐', url: 'https://suno.com' },
  { name: 'Lovable', icon: 'lovable', category: '生成', purpose: '快速出页面', url: 'https://lovable.dev' },
  { name: 'YouTube', icon: 'youtube', category: '灵感', purpose: 'ASMR / 教学 / 沉浸', url: 'https://youtube.com' },
  { name: 'Pinterest', icon: 'pinterest', category: '灵感', purpose: '视觉参考', url: 'https://pinterest.com' },
  { name: 'Figma', icon: 'figma', category: '灵感', purpose: '设计与组件', url: 'https://figma.com' },
  { name: 'Canva', icon: 'canva', category: '灵感', purpose: '快速视觉排版', url: 'https://canva.com' },
  { name: 'Spotify', icon: 'spotify', category: '灵感', purpose: '纯音乐 / 天主教音乐', url: 'https://open.spotify.com' },
  { name: 'Google Drive', icon: 'drive', category: '仓库', purpose: '云档', url: 'https://drive.google.com' },
  { name: 'Google 文档', icon: 'docs', category: '仓库', purpose: '在线文档', url: 'https://docs.google.com' },
  { name: 'Obsidian', icon: 'obsidian', category: '仓库', purpose: '本地主仓', url: 'obsidian://open' },
  { name: 'GitHub', icon: 'github', category: '仓库', purpose: '代码与仓库', url: 'https://github.com' },
  { name: 'Cursor', icon: 'cursor', category: '建造', purpose: '写代码', url: 'https://cursor.com' },
  { name: 'Vercel', icon: 'vercel', category: '建造', purpose: '部署前端', url: 'https://vercel.com' },
  { name: 'Cloudflare', icon: 'cloudflare', category: '建造', purpose: '域名 / Worker / 墨排', url: 'https://dash.cloudflare.com' },
  { name: 'Supabase', icon: 'supabase', category: '建造', purpose: '后端与数据', url: 'https://supabase.com' },
  { name: 'DeepSeek', icon: 'deepseek', category: '建造', purpose: '开放平台', url: 'https://platform.deepseek.com' },
  { name: '公众号', icon: 'wechat', category: '建造', purpose: '发布与后台', url: 'https://mp.weixin.qq.com' },
];
