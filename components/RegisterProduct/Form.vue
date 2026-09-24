<script setup lang="ts">
  import { isEmail, isRequired, phoneNumber } from "~/utils/validator";
  const { t } = useI18n();
  const config = useRuntimeConfig();

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
    values: formValues,
    isSubmitting,
    resetForm,
  } = useForm({
    validationSchema: {
      fullName: (val: any) => isRequired(val, "Full Name"),
      email: isEmail,
      postalCode: (val: any) => isRequired(val, "Post Code"),
      product: (val: any) => isRequired(val, "Product"),
      phone: (val: any) => phoneNumber(val, "Phone"),
      address: (val: any) => isRequired(val, "Address"),
      customerType: (val: any) => isRequired(val, "Customer Type"),
      recaptchaVerified: (val: any) => isRequired(val, "Recaptcha"),
      acceptPrivacyPolicy: (val: boolean) => val || "page.aboutUs.contactUs.form.errors.required",
    },
    initialValues: {
      email: "",
      fullName: "",
      phone: null,
      postalCode: null,
      address: "",
      product: "",
      customerType: defaultSelectOpt.value.value,
      recaptchaVerified: null as null | string,
      acceptPrivacyPolicy: false,
    },
  });

  defineInputBinds("recaptchaVerified");
  const notes = ref("");
  const formSubmitted = ref(false);

  export interface ProductOptions {
    text: string;
    value: string;
  }

  const props = defineProps<{ productOptions: ProductOptions[] }>();

  const productOptions = ref<ProductOptions[]>([
    { text: t("page.registerProduct.form.selectProduct"), value: "" },
    ...props.productOptions,
  ]);

  const yesNoOptions = ref([
    defaultSelectOpt.value,
    { text: t("page.aboutUs.contactUs.form.yes"), value: "Ya" },
    { text: t("page.aboutUs.contactUs.form.no"), value: "Tidak" },
  ]);

  onMounted(() => {
    if (window.grecaptcha?.enterprise) {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.render("recaptcha-register-product", {
          sitekey: config.public.recaptcha,
          callback: (token: string) => {
            console.log("✅ Captcha verified (Register Product):", token);
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

      const data = new FormData();
      data.append("ProductSlug", values.product!);
      data.append("Name", values.fullName);
      data.append("Address", values.address);
      data.append("PostalCode", values.postalCode!);
      data.append("Email", values.email);
      data.append("Phone", values.phone!);
      data.append("IsCustomer", values.customerType!);
      data.append("Notes", notes.value);
      data.append("Recaptcha", values.recaptchaVerified!);
      await $fetch(`${config.public.apiUrl}/register-product-form`, {
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
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div class="row">
        <FormSelect
          name="product"
          class="col-12 col-md-6"
          value-field="value"
          :label="t('page.registerProduct.form.product')"
          :options="productOptions"
        />
        <FormSelect
          name="customerType"
          value-field="text"
          class="col-12 col-md-6"
          :label="t('page.aboutUs.contactUs.form.isCustomer')"
          :options="yesNoOptions"
        />
        <FormInput
          name="fullName"
          class="col-12"
          :placeholder="t('page.aboutUs.contactUs.form.fullName')"
          :label="t('page.aboutUs.contactUs.form.fullName')"
        />
        <FormInput
          name="postalCode"
          class="col-12"
          :placeholder="t('page.registerProduct.form.postalCode')"
          :label="t('page.registerProduct.form.postalCode')"
        />
        <FormInput
          name="address"
          class="col-12"
          :placeholder="t('page.registerProduct.form.address')"
          :label="t('page.registerProduct.form.address')"
        />
        <FormInput
          name="phone"
          class="col-12"
          :placeholder="t('page.aboutUs.contactUs.form.telephone')"
          :label="t('page.aboutUs.contactUs.form.telephone')"
        />
        <FormInput
          name="email"
          class="col-12"
          placeholder="someone@example.com"
          :label="t('page.aboutUs.contactUs.form.email')"
        />
        <FormTextArea
          v-model="notes"
          class="col-12"
          :label="t('page.aboutUs.contactUs.form.notes')"
          :placeholder="t('page.aboutUs.contactUs.form.notes')"
        />
      </div>

      <div id="recaptcha-register-product" class="my-4"></div>
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
          {{ t("page.registerProduct.form.acceptTerms") }}
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
  .error-message {
    font-size: 14px;
    margin-top: 4px;
    font-weight: 500;
  }
</style>