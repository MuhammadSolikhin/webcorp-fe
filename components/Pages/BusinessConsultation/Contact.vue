<script setup lang="ts">
  import { isEmail, isRequired, phoneNumber } from "~/utils/validator";
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const { t } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;
  const runtimeConfig = useRuntimeConfig();

  const defaultSelectOpt = computed(() => ({
    text: t("page.aboutUs.contactUs.form.pleaseSelect"),
    value: null,
  }));
  const {
    defineInputBinds,
    errors: formErrors,
    handleSubmit,
    setFieldError,
    setFieldValue,
    isSubmitting,
    resetForm,
  } = useForm({
    validationSchema: {
      email: isEmail,
      fullName: (val: any) => isRequired(val, "Full Name"),
      phone: (val: any) => phoneNumber(val, "Phone"),
      customerType: (val: any) => isRequired(val, "Customer Type"),
      industryType: (val: any) => isRequired(val, "industryType"),
      businessSize: (val: any) => isRequired(val, "Business Size"),
      problemTopic: (val: any) => isRequired(val, "Problem Topic"),
      recaptchaVerified: (val: any) => isRequired(val, "Captcha verification"),
    },
    initialValues: {
      email: "",
      fullName: "",
      phone: null,
      customerType: defaultSelectOpt.value.value,
      industryType: defaultSelectOpt.value.value,
      businessSize: defaultSelectOpt.value.value,
      problemTopic: defaultSelectOpt.value.value,
      recaptchaVerified: null as null | string,
    },
  });
  defineInputBinds("recaptchaVerified");

  useHead({
    title: t("page.aboutUs.contactUs.title"),
  });

  const parameterSetting = inject<ParameterSettings>("parameter-settings");

  const customerTypes = computed(() => [
    defaultSelectOpt.value,
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
  const industryTypes = computed(() => {
    return [
      defaultSelectOpt.value,
      ...parameterSetting!["Contact Us Form - Dropdown - Industry Type"]
        .split("||")
        .map(i => ({ text: i, value: makeSlug(i) })),
    ];
  });
  const businessSizes = computed(() => {
    return [
      defaultSelectOpt.value,
      ...parameterSetting!["Contact Us Form - Dropdown - Business Size"]
        .split("||")
        .map(i => ({ text: i, value: makeSlug(i) })),
    ];
  });
  const problemTopics = computed(() => {
    return [
      defaultSelectOpt.value,
      ...parameterSetting!["Contact Us Form - Dropdown - Problem Topic"]
        .split("||")
        .map(i => ({ text: i, value: makeSlug(i) })),
    ];
  });
  const yesNoOptions = computed(() => [
    { text: t("page.aboutUs.contactUs.form.yes"), value: "Ya" },
    { text: t("page.aboutUs.contactUs.form.no"), value: "Tidak" },
  ]);

  const formSubmitted = ref(false);
  const notes = ref("");
  const sendCopy = ref(null);
  const attachment = ref<null | File>(null);
  
  onMounted(() => {
    if (window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.render("recaptcha-contact", {
          sitekey: runtimeConfig.public.recaptcha,
          callback: (token: string) => {
            console.log("✅ Captcha verified (Contact Form):", token);
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
    if (formSubmitted.value) return;

    if (!values.recaptchaVerified) {
      setFieldError("recaptchaVerified", "Captcha belum diverifikasi");
      return;
    }

    const data = new FormData();
    data.append("Name", values.fullName);
    if (attachment.value) {
      data.append("Attachment", attachment.value);
    }
    data.append("Email", values.email);
    data.append("Phone", values.phone!);
    data.append("CustomerType", values.customerType!);
    data.append("IndustryType", values.industryType!);
    data.append("BusinessSize", values.businessSize!);
    data.append("TopicType", values.problemTopic!);
    data.append("Notes", notes.value);
    data.append("SendCopyToEmail", sendCopy.value!);
    data.append("Recaptcha", values.recaptchaVerified!);
    try {
      await $fetch(`${apiUrl}/contact-form`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      formSubmitted.value = true;
      resetForm();
      notes.value = "";
      sendCopy.value = null;
      attachment.value = null;
      setFieldValue("recaptchaVerified", null);
      alert(t("shared.form.success"));
    } catch (err) {
      console.error(err);
      alert(t("shared.form.failure"));
    }
  });
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="row w-100 mx-auto">
      <FormInput
        name="fullName"
        wrapper-class="col-12 col-lg-6"
        :label="$t('page.aboutUs.contactUs.form.fullName')"
        :placeholder="$t('page.aboutUs.contactUs.form.fullName')"
      />
      <FormInput
        name="email"
        wrapper-class="col-12 col-lg-6"
        :label="$t('page.aboutUs.contactUs.form.email')"
        placeholder="someone@example.com"
        type="email"
      />
      <FormInput
        name="phone"
        wrapper-class="col-12 col-lg-6"
        :label="$t('page.aboutUs.contactUs.form.telephone')"
        :placeholder="$t('page.aboutUs.contactUs.form.telephone')"
      />
      <FormSelect
        name="customerType"
        value-field="text"
        wrapper-class="col-12 col-lg-6"
        :label="$t('page.aboutUs.contactUs.form.isCustomer')"
        :options="customerTypes"
      />
      <div class="hr col-12">
        <hr class="w-100 d-block" />
      </div>
      <FormSelect
        name="industryType"
        value-field="text"
        wrapper-class="col-12 col-lg-6"
        :options="industryTypes"
        :label="$t('page.aboutUs.contactUs.form.industryType')"
      />
      <FormSelect
        name="businessSize"
        value-field="text"
        wrapper-class="col-12 col-lg-6"
        :options="businessSizes"
        :label="$t('page.aboutUs.contactUs.form.MSMESize')"
      />
      <FormSelect
        name="problemTopic"
        value-field="text"
        wrapper-class="col-12 col-lg-6"
        :options="problemTopics"
        :label="$t('page.aboutUs.contactUs.form.topicType')"
      />
      <FormTextArea
        v-model="notes"
        :label="$t('page.aboutUs.contactUs.form.notes')"
        :placeholder="$t('page.aboutUs.contactUs.form.notes')"
      />
      <FormRadio
        v-model="sendCopy"
        class="input-wrapper col-12"
        :label="$t('page.aboutUs.contactUs.form.sendCopy')"
        :options="yesNoOptions"
      />
      <div class="input-wrapper col-12">
        <FormFile v-model="attachment" class="mb-1" />
        <div>
          <p class="mb-0 form-label">
            <b>{{ $t("page.aboutUs.contactUs.form.fileFormat") }}</b>:
            <span class="fw-medium">jpg, png</span>
          </p>
          <p class="form-label">
            <b>{{ $t("page.aboutUs.contactUs.form.maxFileSize") }}</b>:
            <span class="fw-medium">500 KB</span>
          </p>
        </div>
      </div>

      <div id="recaptcha-contact" class="my-4"></div>
      <div
        v-if="formErrors.recaptchaVerified"
        class="ps-2 error-message text-danger"
      >
        {{ $t("page.aboutUs.contactUs.form.errors.recaptcha") }}
      </div>

      <div class="d-flex justify-content-end mt-3 pb-5">
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
    </div>
  </form>
</template>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
  .hr {
    padding: 5px 0;
    hr {
      background: $light-gray;
    }
  }
  .error-message {
    font-size: 14px;
    margin-top: 4px;
    font-weight: 500;
  }
</style>