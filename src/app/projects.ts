export type ProjectStatus = "ACTIVE" | "BUILDING";

export type ProjectEntry = {
  id: string;
  name: string;
  status: ProjectStatus;
  blurb: string;
  href: string;
  external: boolean;
  here?: boolean;
};

export const PROJECTS: ProjectEntry[] = [
  {
    id: "inkpai",
    name: "INKPAI",
    status: "ACTIVE",
    blurb: "AI layout system",
    href: "https://inkpai.hongmeichen1219.workers.dev",
    external: true,
  },
  {
    id: "excerpt",
    name: "IMAGE EXCERPT",
    status: "ACTIVE",
    blurb: "Image book excerpts",
    href: "https://imageexcerpt.lovable.app",
    external: true,
  },
  {
    id: "vibe",
    name: "VIBE CODING STORE",
    status: "ACTIVE",
    blurb: "Live product store",
    href: "https://vibe-coding-store.vercel.app/",
    external: true,
  },
];
