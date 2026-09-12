export type ProjectStatus = "ACTIVE" | "BUILDING";

export type ProjectEntry = {
  id: string;
  name: string;
  status: ProjectStatus;
  blurb: string;
  href: string;
  image: string;
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
    image: "/projects/inkpai-2.jpg",
    external: true,
  },
  {
    id: "excerpt",
    name: "IMAGE EXCERPT",
    status: "ACTIVE",
    blurb: "Image book excerpts",
    href: "https://imageexcerpt.lovable.app",
    image: "/projects/excerpt-2.jpg",
    external: true,
  },
  {
    id: "vibe",
    name: "VIBE CODING STORE",
    status: "ACTIVE",
    blurb: "Live product store",
    href: "https://vibe-coding-store.vercel.app/",
    image: "/projects/vibe-2.jpg",
    external: true,
  },
];
