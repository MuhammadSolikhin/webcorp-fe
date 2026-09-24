export enum Section {
  LeftMenu = "Left Menu",
  RightMenu = "Right Menu",
}

enum MainSection {
  Footer = "Footer",
  NavigationBar = "Navigation Bar",
}

export interface SubSubNavigation {
  Id: number;
  Title: string;
  Route: string;
  OriginalRoute: null | string;
  IsStaticRoute: boolean;
}

export interface SubNavigation {
  Id: number;
  Title: string;
  Route: string;
  IsStaticRoute: boolean;
  SubSubNavigations: SubSubNavigation[];
}
export interface Navigation {
  Id: number;
  Title: string;
  Route: string;
  SubNavigations?: SubNavigation[];
}
export interface TMenu {
  Id: number;
  MainSection: MainSection;
  Section: Section;
  Title: string;
  Route: null | string;
  Navigations: Navigation[];
}
interface Footer {
  "Left Menu": TMenu[];
  "Right Menu": TMenu[];
}

interface NavigationBar {
  "Left Menu": TMenu[];
}

export interface NAVData {
  "Navigation Bar": NavigationBar;
  Footer: Footer;
}
