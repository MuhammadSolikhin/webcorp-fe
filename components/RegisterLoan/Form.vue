<script setup lang="ts">
  import { isEmail, isRequired, phoneNumber } from "~/utils/validator";
  const { t } = useI18n();
  const config = useRuntimeConfig();

  const defaultSelectOpt = computed(() => ({
    text: t("page.registerLoan.form.selectFinancingType"),
    value: null,
  }));

  const {
    defineInputBinds,
    errors: formErrors,
    handleSubmit,
    setFieldError,
    setFieldValue,
    values: formValues,
    isSubmitting,
    resetForm,
  } = useForm({
    validationSchema: {
      financingType: (val: any) => isRequired(val, "Financing Type"),
      principalName: (val: any) => isRequired(val, "Principal Name"),
      companyName: (val: any) => isRequired(val, "Company Name"),
      businessType: (val: any) => isRequired(val, "Type Of Business"),
      desiredLoanLimit: (val: any) => isRequired(val, "Desired Loan Limit"),
      contactPicName: (val: any) => isRequired(val, "Contact PIC Name"),
      phonePic: (val: any) => phoneNumber(val, "Phone PIC"),
      emailPic: isEmail,
      recaptchaVerified: (val: any) => isRequired(val, "Recaptcha"),
      acceptPrivacyPolicy: (val: boolean) =>
        val || "page.aboutUs.contactUs.form.errors.required",
    },
    initialValues: {
      financingType: defaultSelectOpt.value.value,
      principalName: "",
      companyName: "",
      businessType: "",
      desiredLoanLimit: "Rp 0",
      contactPicName: "",
      phonePic: null,
      emailPic: "",
      recaptchaVerified: null as null | string,
      acceptPrivacyPolicy: false,
    },
  });

  defineInputBinds("recaptchaVerified");
  const notes = ref("");
  const formSubmitted = ref(false);

  const FinancingTypeOptions = ref([
  defaultSelectOpt.value,
  {
    text: t("page.registerLoan.form.loan.distributorFinancing"),
    value: 1,
  },
  {
    text: t("page.registerLoan.form.loan.supplierFinancing"),
    value: 2,
  },
]);

  onMounted(() => {
    if (window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.render("recaptcha-loan-form", {
          sitekey: config.public.recaptcha,
          callback: (token: string) => {
            console.log("✅ Captcha verified (Register Loan):", token);
            setFieldValue("recaptchaVerified", token);
          },
          "expired-callback": () => {
            console.warn("Captcha expired");
            setFieldValue("recaptchaVerified", null);
          },
          "error-callback": () => {
            console.error("Captcha error");
            setFieldValue("recaptchaVerified", null);
          },
        });
      });
    } else {
      console.error("reCAPTCHA Enterprise SDK belum siap");
    }
  });

  const onSubmit = handleSubmit(async function (values) {
    try {
      if (formSubmitted.value) return;

      if (!values.recaptchaVerified) {
        setFieldError("recaptchaVerified", "Captcha belum diverifikasi");
        return;
      }

      const numericLoanLimit = values.desiredLoanLimit
        ? values.desiredLoanLimit.replace(/[^\d]/g, "")
        : "";

      const data = new FormData();
      data.append("FinancingType", String(values.financingType!));
      data.append("PrincipalName", values.principalName);
      data.append("CompanyName", values.companyName);
      data.append("BusinessTypeCode", values.businessType);
      data.append("DesiredLoanLimit", numericLoanLimit);
      data.append("ContactPicName", values.contactPicName);
      data.append("PhonePic", values.phonePic!);
      data.append("EmailPic", values.emailPic);
      data.append("Recaptcha", values.recaptchaVerified!);

      await $fetch(`${config.public.apiUrl}/register-loan-form`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      formSubmitted.value = true;
      resetForm();
      notes.value = "";
      setFieldValue("recaptchaVerified", null);
      alert(t("shared.form.success"));
    } catch (err: any) {
      alert(t("shared.form.failure"));
    }
  });

  export interface BusinessTypeOptions {
    text: string;
    value: string;
  }

  const props = defineProps<{ businessTypeOptions: BusinessTypeOptions[] }>();

  const businessTypeOptions = ref<BusinessTypeOptions[]>([
    { text: t("page.registerLoan.form.placeholderBusinessType"), value: "" },
    ...props.businessTypeOptions,
  ]);

  const formattedDesiredLoanLimit = computed(() => {
    const rawValue = formValues.desiredLoanLimit || "0";
    const numericValue = parseFloat(rawValue.replace(/[^\d]/g, ""));
    if (isNaN(numericValue) || numericValue === 0) {
      return "Rp 0"; // Display 'Rp 0' if the value is 0 or invalid
    }
    return `Rp ${new Intl.NumberFormat("id-ID").format(numericValue)}`;
  });

  function updateDesiredLoanLimit(value: string) {
    // Remove non-numeric characters before storing the value
    const numericValue = value.replace(/[^\d]/g, "");
    setFieldValue("desiredLoanLimit", numericValue); // Store only the numeric value
  }
</script>

<template>
  <div class="d-flex flex-column complaint--form">
    <AppTitle color="primary" size="md" class="mb-0">
      {{ $t("page.registerLoan.title") }}
    </AppTitle>

    <form @submit.prevent="onSubmit">
      <div class="row">
        <FormSelect
          name="financingType"
          class="col-12 col-md-6"
          value-field="value"
          :label="t('page.registerLoan.form.financingType')"
          :options="FinancingTypeOptions"
        />
        <FormInput
          name="principalName"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderPrincipalName')"
          :label="t('page.registerLoan.form.principalName')"
        />
        <FormInput
          name="companyName"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderCompanyName')"
          :label="t('page.registerLoan.form.companyName')"
        />
        <FormSelect
          name="businessType"
          value-field="value"
          class="col-12 col-md-6"
          :label="t('page.registerLoan.form.businessType')"
          :options="businessTypeOptions"
        />
        <FormInput
          name="desiredLoanLimit"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderDesiredLoanLimit')"
          :label="t('page.registerLoan.form.desiredLoanLimit')"
          :value="formattedDesiredLoanLimit"
          @input="updateDesiredLoanLimit"
        />
        <FormInput
          name="contactPicName"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderContactPicName')"
          :label="t('page.registerLoan.form.contactPicName')"
        />
        <FormInput
          name="phonePic"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderPhonePic')"
          :label="t('page.registerLoan.form.phonePic')"
        />
        <FormInput
          name="emailPic"
          class="col-12 col-md-6"
          :placeholder="t('page.registerLoan.form.placeholderEmailPic')"
          :label="t('page.registerLoan.form.emailPic')"
        />
      </div>

      <div id="recaptcha-loan-form" class="my-4"></div>
      <div v-if="formErrors.recaptchaVerified" class="ps-2 error-message text-danger">
        {{ $t("page.aboutUs.contactUs.form.errors.recaptcha") }}
      </div>

      <div id="checkbox-1" class="form-check mb-4">
        <input
          id="privacy-policy"
          class="form-check-input"
          name="acceptPrivacyPolicy"
          type="checkbox"
          :class="formErrors.acceptPrivacyPolicy && 'check-box-error'"
          @input="() => setFieldValue('acceptPrivacyPolicy', !formValues.acceptPrivacyPolicy)"
        />
        <label class="form-check-label" for="privacy-policy">
          {{ t("page.registerLoan.form.acceptTerms") }}
        </label>
      </div>

      <div class="d-flex justify-content-end mt-4 pb-5">
        <AppButton
          color="primary"
          full-on-mobile
          size="xl"
          type="submit"
          :disabled="isSubmitting || formSubmitted"
        >
          {{
            $t(
              isSubmitting
                ? "page.aboutUs.contactUs.form.submitting"
                : "page.aboutUs.contactUs.form.submit"
            )
          }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .check-box-error {
    border: 1.5px solid $danger !important;
    box-shadow: none !important;
  }
</style>