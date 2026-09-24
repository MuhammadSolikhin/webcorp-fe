import { useI18n } from "#imports";

export const useContactOptions = () => {
  const { t } = useI18n();

  const isCustomerOptions = computed(() => [
    {
      text: t("page.aboutUs.contactUs.form.pleaseSelect"),
      value: null,
    },
    {
      text: t("page.aboutUs.contactUs.isCustomerDropdown.individualCustomer"),
      value: t("page.aboutUs.contactUs.isCustomerDropdown.individualCustomer"),
    },
    {
      text: t("page.aboutUs.contactUs.isCustomerDropdown.corporateCustomer"),
      value: t("page.aboutUs.contactUs.isCustomerDropdown.corporateCustomer"),
    },
    {
      text: t("page.aboutUs.contactUs.isCustomerDropdown.generalCustomer"),
      value: t("page.aboutUs.contactUs.isCustomerDropdown.generalCustomer"),
    },
  ]);

  const topicTypeOptions = computed(() => [
    {
      text: t("page.aboutUs.contactUs.form.pleaseSelect"),
      value: null,
    },
    {
      text: t("page.aboutUs.contactUs.topicTypeDropdown.information"),
      value: t("page.aboutUs.contactUs.topicTypeDropdown.information"),
    },
    {
      text: t("page.aboutUs.contactUs.topicTypeDropdown.question"),
      value: t("page.aboutUs.contactUs.topicTypeDropdown.question"),
    },
  ]);
  const issueOptions = computed(() => [
    {
      text: t("page.aboutUs.contactUs.form.pleaseSelect"),
      value: null,
    },
    {
      text: t("page.aboutUs.contactUs.issueDropdown.atm"),
      value: t("page.aboutUs.contactUs.issueDropdown.atm"),
    },
    {
      text: t("page.aboutUs.contactUs.issueDropdown.other"),
      value: t("page.aboutUs.contactUs.issueDropdown.other"),
    },
  ]);
  const issueDetailOptions = computed(() => [
    {
      text: t("page.aboutUs.contactUs.form.pleaseSelect"),
      value: null,
    },
    {
      text: t("page.aboutUs.contactUs.issueDetailDropdown.atm"),
      value: t("page.aboutUs.contactUs.issueDetailDropdown.atm"),
    },
    {
      text: t("page.aboutUs.contactUs.issueDetailDropdown.other"),
      value: t("page.aboutUs.contactUs.issueDetailDropdown.other"),
    },
  ]);
  return {
    isCustomerOptions,
    issueDetailOptions,
    issueOptions,
    topicTypeOptions,
  };
};
