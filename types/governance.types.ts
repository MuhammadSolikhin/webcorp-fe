import type { AppRes } from "./utils.types";

interface GovernanceCategory {
	Id: number,
	Slug: string;
	Title: string;
	Description: string;
	Icon: string;
};

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

interface PageBanner {
	Id: number;
	Title: string;
	Description: string;
	ImageDesktop: string;
	ImageMobile: string;
}

interface SubCategory {
	Id: number;
	Title: string;
	Slug: string;
	Type: string;
	Details: {}
}

export interface GovernanceCategoryRes extends AppRes<GovernanceCategory[]> {
	links: {
		first: string | null;
		last: string | null;
		prev: string | null;
		next: string | null;
	};
	meta: Meta;
}

export interface PageBannerRes extends AppRes<PageBanner> {}

export interface SubCategoryRes extends AppRes<SubCategory[]> {}