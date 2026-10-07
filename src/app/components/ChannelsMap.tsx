import { ExternalLink } from "lucide-react";
import { SectionCard } from "./SectionCard";

export function ChannelsMap() {
  const channels = [
    { name: "X", category: "信息", purpose: "刷推 + 前沿", url: "https://x.com" },
    { name: "YouTube", category: "灵感", purpose: "ASMR / 音乐 / 祈祷 / 专业", url: "https://youtube.com" },
    { name: "ChatGPT", category: "生成", purpose: "框架、理解、设计", url: "https://chat.openai.com" },
    { name: "Gemini", category: "生成", purpose: "Nano Banana Pro 生图", url: "https://gemini.google.com" },
    { name: "Grok", category: "生成", purpose: "搜索 + 理解", url: "https://x.com/i/grok" },
    { name: "Perplexity", category: "学习", purpose: "搜索 + 多模型", url: "https://perplexity.ai" },
    { name: "NotebookLM", category: "学习", purpose: "精读 + 幻灯片/漫画/导图", url: "https://notebooklm.google.com" },
    { name: "Pinterest", category: "灵感", purpose: "图 + 美学", url: "https://pinterest.com" },
    { name: "微信读书", category: "学习", purpose: "天主教/哲学/心理学", url: "https://weread.qq.com" },
    { name: "Substack", category: "学习", purpose: "外网长文", url: "https://substack.com" },
    { name: "Google Drive", category: "存储", purpose: "云盘", url: "https://drive.google.com" },
    { name: "Telegram", category: "信息", purpose: "设计/AI 图 + 资讯", url: "https://web.telegram.org" },
    { name: "Spotify", category: "放松", purpose: "纯音乐 + 天主教", url: "https://open.spotify.com" },
    { name: "Z-Library", category: "学习", purpose: "书源", url: "https://z-lib.gs" },
    { name: "Obsidian", category: "存储", purpose: "Inbox / Core / Compost", url: "obsidian://open" },
  ];

  return (
    <SectionCard
      title="B. Channels Map"
      instructions={["每个渠道一个目的", "按用途找", "没用的砍掉"]}
    >
      <div className="space-y-3">
        <p className="os-label">Where I surf</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {channels.map((channel) => (
            <div key={channel.name} className="border border-line px-3 py-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium">{channel.name}</span>
                <span className="os-label">{channel.category}</span>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex h-8 w-8 items-center justify-center"
                  title={channel.name}
                >
                  <ExternalLink className="h-3.5 w-3.5 text-mute" />
                </a>
              </div>
              <p className="text-xs leading-relaxed text-mute">{channel.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
