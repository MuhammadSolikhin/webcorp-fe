import { required, email, integer, max, min } from "@vee-validate/rules";

export const isRequired = (val: any, _fieldName = "This") =>
  required(val) || "page.aboutUs.contactUs.form.errors.required";

export const isEmail = (val: any) => {
  const r = isRequired(val, "Email");
  if (r === true) {
    return email(val) || "page.aboutUs.contactUs.form.errors.invalidEmail";
  }
  return r;
};

export const phoneNumber = (val: any, fieldName?: string) => {
  const r = isRequired(val, fieldName);
  if (r === true) {
    if (integer(val) === true)
      return (
        (max(val, { length: 15 }) && min(val, { length: 10 })) ||
        "page.aboutUs.contactUs.form.errors.invalidPhone"
      );
    return "page.aboutUs.contactUs.form.errors.invalidPhone";
  }
  return r;
};
