import { SectionCard } from './SectionCard';
import { Hash, Youtube, MessageSquare, Sparkles, Book, FileText, Cloud, Send, Music, BookOpen, FolderOpen, ExternalLink } from 'lucide-react';

export function ChannelsMap() {
  const channels = [
    { name: 'X', icon: Hash, color: 'bg-blue-500', category: '信息', purpose: '刷推文放松 + 前沿高质量信息', url: 'https://x.com' },
    { name: 'YouTube', icon: Youtube, color: 'bg-red-500', category: '灵感', purpose: 'ASMR / 沉浸音乐 / 阅读祈祷冥想 / 大V专业素材', url: 'https://youtube.com' },
    { name: 'ChatGPT', icon: MessageSquare, color: 'bg-green-500', category: '生成', purpose: '框架构建、理解、设计助力', url: 'https://chat.openai.com' },
    { name: 'Gemini', icon: Sparkles, color: 'bg-purple-500', category: '生成', purpose: 'Nano Banana Pro 生图 + 框架助力', url: 'https://gemini.google.com' },
    { name: 'Grok', icon: MessageSquare, color: 'bg-orange-500', category: '生成', purpose: '最新搜索 + 理解助力', url: 'https://x.com/i/grok' },
    { name: 'Perplexity', icon: MessageSquare, color: 'bg-cyan-500', category: '学习', purpose: '整合性搜索 + 多模型对比', url: 'https://perplexity.ai' },
    { name: 'NotebookLM', icon: Book, color: 'bg-indigo-500', category: '学习', purpose: '聚焦式学习 + 幻灯片/漫画/思维导图', url: 'https://notebooklm.google.com' },
    { name: 'Pinterest', icon: Sparkles, color: 'bg-pink-500', category: '灵感', purpose: '灵感图 + 美学放松', url: 'https://pinterest.com' },
    { name: '微信读书', icon: BookOpen, color: 'bg-teal-500', category: '学习', purpose: '天主教/哲学/心理学', url: 'https://weread.qq.com' },
    { name: 'Substack', icon: FileText, color: 'bg-amber-500', category: '学习', purpose: '外网深度思考内容', url: 'https://substack.com' },
    { name: 'Google Drive', icon: Cloud, color: 'bg-blue-400', category: '存储', purpose: '云档存储', url: 'https://drive.google.com' },
    { name: 'Telegram', icon: Send, color: 'bg-sky-500', category: '信息', purpose: '设计师/AI 艺术图灵感 + AI 最新信息', url: 'https://web.telegram.org' },
    { name: 'Spotify', icon: Music, color: 'bg-green-600', category: '放松', purpose: '纯音乐沉浸 + 天主教音乐', url: 'https://open.spotify.com' },
    { name: 'Z-Library', icon: Book, color: 'bg-slate-600', category: '学习', purpose: '导入书源', url: 'https://z-lib.gs' },
    { name: 'Obsidian', icon: FolderOpen, color: 'bg-violet-500', category: '存储', purpose: 'Inbox/Core/Compost 主仓', url: 'obsidian://open' },
  ];

  const categories = ['信息', '灵感', '生成', '学习', '存储', '放松'];
  const categoryColors: Record<string, string> = {
    '信息': 'bg-blue-100 text-blue-800',
    '灵感': 'bg-pink-100 text-pink-800',
    '生成': 'bg-green-100 text-green-800',
    '学习': 'bg-purple-100 text-purple-800',
    '存储': 'bg-slate-100 text-slate-800',
    '放松': 'bg-amber-100 text-amber-800',
  };

  return (
    <SectionCard
      title="B. Channels Map"
      color="bg-gradient-to-r from-blue-500 to-cyan-500"
      width="w-[500px]"
      instructions={['每个渠道都有明确的获取目标', '按用途分类，快速找到对应工具', '定期评估哪些渠道真正有效']}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600 font-medium">我在哪里冲浪</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat} className={`text-xs px-2 py-1 rounded-full ${categoryColors[cat]}`}>{cat}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all hover:-translate-y-1 relative group">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${channel.color} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{channel.name}</span>
                  <a href={channel.url} target="_blank" rel="noopener noreferrer" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-slate-200 rounded-md p-1.5" title={`打开 ${channel.name}`}>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[channel.category]}`}>{channel.category}</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{channel.purpose}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
