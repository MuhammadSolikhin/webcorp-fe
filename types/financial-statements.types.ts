import type { AppRes, PaginationAppRes } from "~/types/utils.types";

interface FinancialStatementGroups {
	Id: number;
	Header: string;
	Title: string;
}
interface FinancialStatement {
	Id: number;
	Year: string;
	Group: string;
	Title: string;
	FileUrl: string;
}
export interface YearsRes extends AppRes<number[]> {
	year: number[]
}

export interface FinancialStatementRes extends PaginationAppRes<FinancialStatement[]> {}

export interface FinancialStatementGroupsRes extends AppRes<FinancialStatementGroups[]> {}