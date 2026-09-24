interface VacancyLink {
  Id: number;
  Title: string;
  Link: string;
}
interface VacancyType {
  Id: number;
  Title: string;
}

export interface Vacancy {
  Id: number;
  Title: string;
  Requirement: string;
  JobDescription: string;
  Slug: string;
  CreatedAt: Date;
  VacancyType: VacancyType;
  VacancyLinks: VacancyLink[];
}
