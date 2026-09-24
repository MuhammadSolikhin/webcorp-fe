enum BannerTitle {
  TemukanTabunganTerbaikBersamaHibank = "Temukan tabungan terbaik bersama hibank",
}

enum BannerType {
  WithoutBackground = "without_background",
}

interface Product {
  Id: number;
  Title: string;
  Slug: string;
  HeroImage: string;
  MobileHeroImage: string;
  IconImage: null | string;
  BannerType: BannerType;
  BannerTitle: BannerTitle;
  Content: string;
  Footer: string;
  Registerable: number;
}

interface SubPagesElement {
  Id: number;
  Title: string;
  Slug: string;
  Active: boolean;
}

interface SubPage {
  Id: number;
  Title: string;
  Slug: string;
  SidebarTitle: string;
  Products: Product[];
}

export interface ISubTypePage {
  Id: number;
  Title: string;
  Slug: string;
  Route: null;
  SubPages: SubPagesElement[];
  SubPage: SubPage;
}
