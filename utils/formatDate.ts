import dayjs from "dayjs";
import id from "dayjs/locale/id";
import en from "dayjs/locale/en";

export interface DateOptions {
  locale: "id" | "en";
}
export function getFullDateTimeFormat(date: string | Date, opt = {} as DateOptions) {
  return dayjs(new Date(date))
    .locale(opt.locale === "id" ? id : en)
    .format("dddd, D MMMM YYYY | hh:mm");
}
export function convertDate(date: Date, opt = {} as DateOptions) {
  return dayjs(new Date(date))
    .locale(opt.locale === "id" ? id : en)
    .format("MMMM, D YYYY | hh:mm:ss");
}

export function formatDate(
  date: string | Date,
  opt = { formateString: "D MMMM YYYY" } as DateOptions & { formateString: string }
) {
  return dayjs(new Date(date))
    .locale(opt.locale === "id" ? id : en)
    .format(opt.formateString);
}
