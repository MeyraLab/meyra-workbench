export type FolderStyle = "blush" | "noir" | "ribbon" | "bows" | "plain";

export type FolderId = "studio" | "product" | "type" | "editorial";

export type Project = {
  id: string;
  folder: FolderId;
  name: string;
  year: string;
  role: string;
  tags: string[];
  description: string;
};

