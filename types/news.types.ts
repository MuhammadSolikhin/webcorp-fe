import type { AppRes } from "./utils.types";

interface NewsType {
  Id: number;
  Group: string;
  Title: string;
}
export interface News {
  Id: number;
  Title: string;
  Slug: string;
  BannerImage: string;
  PostedDate: string;
  SubTitle: string;
  Summary: string;
  BlogType: NewsType;
}
interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: {
    url: null | string;
    label: string;
    active: boolean;
  }[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface NewsRes extends AppRes<News[]> {
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
}

// types for news/[slug]
export interface NewsBlog {
  Id: number;
  Title: string;
  Slug: string;
  BannerImage: string;
  SubTitle: string;
  Location: null;
  Content: string;
  Footer: string;
  MetaTag: null;
  MetaDescription: null;
}

export interface RecommendationNews {
  Id: number;
  Title: string;
  Slug: string;
  BannerImage: string;
  SubTitle: string;
  Summary: string;
  BlogType: {
    Id: number;
    Group: string;
    Title: string;
    Slug: string;
  };
}
