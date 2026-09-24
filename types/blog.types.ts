export enum Title {
  DigitalBank = "Digital Bank",
  Inspirasi = "Inspirasi",
  Keuangan = "Keuangan",
}

export enum TagClassName {
  TagPrimary = "tag-primary",
  TagSecondary = "tag-secondary",
  TagSuccess = "tag-success",
}

interface Tag {
  Id: number;
  Title: Title;
  TagClassName: TagClassName;
}

export interface Article {
  Id: number;
  Type: string;
  Title: string;
  Slug: string;
  BannerImage: string;
  ThumbnailImage: string;
  Video: string;
  VideoHls: string;
  VideoEmbed: string;
  Content: string;
  Footer: string;
  MetaTag: null;
  MetaDescription: null;
  Tags: Tag[];
  Author: string;
  PostedDate: string;
}

// export interface ITab {
//   title: string;
//   slug: string;
//   type: string;
//   active: number;
// }

// export interface BlogType {
//   Id: number;
//   Group: string;
//   Title: string;
// }
// export interface Blog {
//   Id: number;
//   Title: string;
//   Slug: string;
//   BannerImage: string;
//   SubTitle: string;
//   Summary: string;
//   BlogType: BlogType;
// }

// export interface Recommendation {
//   Id: number;
//   Title: string;
//   Slug: string;
//   BannerImage: string;
//   SubTitle: string;
//   Summary: string;
//   BlogType: BlogType;
// }
