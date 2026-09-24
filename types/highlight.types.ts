import type { AppRes } from "./utils.types";

export interface BlogList {
  Id: number;
  Title: string;
  Slug: string;
  BannerImage: string;
  SubTitle: string;
  Summary: string;
  PostedDate: Date;
  BlogType: {
		Id: number;
		Group: string;
		Title: string;
	};
}

export interface ReportList {
  Id: number;
  Year: string;
  PublishDate: Date;
  Group: string;
  Title: string;
  FileUrl: string;
}

export interface Highlight {
  Id: number;
  Name: string;
  Type: number;
  Link: string;
  List: BlogList[] | ReportList[];
}

export interface HighlightRes extends AppRes<Highlight[]> {}
