

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
  isSubmitting,
  resetForm,
  values,
} = useForm({
  validateOnMount: false,
  validationSchema: {
    email: isEmail,
    fullName: (val: any) => {
      if (!val) return isRequired(val, "Full Name");
      if (!/^[A-Za-z\s]+$/.test(val))
        return t("page.aboutUs.contactUs.form.errors.nameAlphabet");
      if (val.length < 3)
        return t("page.aboutUs.contactUs.form.errors.nameMin");
      return true;
    },
    phone: (val: any) => phoneNumber(val, "Phone"),
    identityNumber: (val: any) => {
      if (!val) return isRequired(val, "Identity Number");
      if (!/^[0-9]+$/.test(val))
        return t("page.aboutUs.contactUs.form.errors.identityNumeric");
      if (val.length > 16)
        return t("page.aboutUs.contactUs.form.errors.identityMax");
      return true;
    },
    customerType: (val: any) => isRequired(val, "Customer Type"),
    problemTopic: (val: any) => isRequired(val, "Problem Topic"),

    notes: (val: any) => {
      const value = String(val || "").trim();

      if (value.length === 0) {
        return t("page.aboutUs.contactUs.form.errors.required");
      }

      return true;
      },

    recaptchaVerified: (val: any) =>
      isRequired(val, "Captcha verification"),
  },

  initialValues: {
    email: "",
    fullName: "",
    phone: null,
    identityNumber: "",
    customerType: defaultSelectOpt.value.value,
    problemTopic: defaultSelectOpt.value.value,
    recaptchaVerified: null as null | string,


    notes: "",
    sendCopy: "no",
  },
});

defineInputBinds("recaptchaVerified");
const notesBind = defineInputBinds("notes");

const attachment = ref<null | File>(null);
const formSubmitted = ref(false);
const { apiUrl } = useRuntimeConfig().public;



/* =============================== */
onMounted(() => {
  setFieldValue("sendCopy", "no");
  const loadRecaptcha = () => {
    if (!window.grecaptcha?.enterprise) {
      return setTimeout(loadRecaptcha, 150);
    }

    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.render("recaptcha-container", {
        sitekey: config.public.recaptcha,
        callback: (token: string) => {
          setFieldValue("recaptchaVerified", token);
        },
        "expired-callback": () => {
          setFieldValue("recaptchaVerified", null);
        },
        "error-callback": () => {
          setFieldValue("recaptchaVerified", null);
        },
      });
    });
  };

  loadRecaptcha();
});
/* =============================== */

const onSubmit = handleSubmit(
  async (values) => {
    formSubmitted.value = true;

    if (!values.recaptchaVerified) {
      setFieldError("recaptchaVerified", "Captcha belum diverifikasi");
      return;
    }

    const data = new FormData();
    data.append("Name", values.fullName);
    if (attachment.value) data.append("Attachment", attachment.value);
    data.append("Email", values.email);
    data.append("Phone", values.phone!);
    data.append("IdentityCardNumber", values.identityNumber);
    data.append("CustomerType", values.customerType!);
    data.append("TopicType", values.problemTopic!);
    data.append("Notes", values.notes);

    data.append(
      "SendCopyToEmail",
      values.sendCopy === "yes" ? "Ya" : "Tidak"
    );

    data.append("Recaptcha", values.recaptchaVerified!);

    try {
      await $fetch(`${apiUrl}/complaint-form`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      resetForm();
      attachment.value = null;
      setFieldValue("recaptchaVerified", null);

      alert(t("shared.form.success"));
    } catch (err) {
      console.error(err);
      alert(t("shared.form.failure"));
    }
  },
  () => {
    formSubmitted.value = true;
  }
);

</script>

<template>
  <div class="d-flex flex-column complaint--form">
    <AppTitle color="primary" size="md" class="mb-0">
      {{ $t("page.aboutUs.complaint.complaintForm") }}
    </AppTitle>

    <form @submit.prevent="onSubmit">
      <div class="row">
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
        />
        <FormInput
          name="phone"
          wrapper-class="col-12 col-lg-6"
          :label="$t('page.aboutUs.contactUs.form.telephone')"
          :placeholder="$t('page.aboutUs.contactUs.form.telephone')"
        />
        <FormInput
          name="identityNumber"
          wrapper-class="col-12 col-lg-6"
          :label="$t('page.aboutUs.contactUs.form.identity')"
          :placeholder="$t('page.aboutUs.contactUs.form.identity')"
        />

        <div class="hr col-12">
          <hr class="w-100 d-block" />
        </div>

        <FormSelect
          name="customerType"
          value-field="text"
          wrapper-class="col-12 col-lg-6"
          :options="[
            defaultSelectOpt,
            { text: $t('page.aboutUs.contactUs.form.yes'), value: 'Ya' },
            { text: $t('page.aboutUs.contactUs.form.no'), value: 'Tidak' },
          ]"
          :label="$t('page.aboutUs.contactUs.form.isCustomer')"
        />

        <FormSelect
          name="problemTopic"
          value-field="text"
          wrapper-class="col-12 col-lg-6"
          :options="[
            defaultSelectOpt,
            {
              text: $t('page.aboutUs.contactUs.topicTypeDropdown.information'),
              value: $t('page.aboutUs.contactUs.topicTypeDropdown.information'),
            },
            {
              text: $t('page.aboutUs.contactUs.topicTypeDropdown.question'),
              value: $t('page.aboutUs.contactUs.topicTypeDropdown.question'),
            },
          ]"
          :label="$t('page.aboutUs.contactUs.form.topicType')"
        />
        
        
        <FormTextArea
            v-bind="notesBind"
            :model-value="values.notes"
            @update:model-value="setFieldValue('notes', $event)"
            :label="$t('page.aboutUs.contactUs.form.notes')"
            :placeholder="$t('page.aboutUs.contactUs.form.notes')"
            :error="!!formErrors.notes && formSubmitted"
          />
                    
        
          <div v-if="formErrors.notes && formSubmitted" class="ps-2 error-message text-danger">
            {{ formErrors.notes }}
          </div>
                  
           <div class="input-wrapper col-12">
              <label class="form-label fw-bold d-block">
                {{ $t('page.aboutUs.contactUs.form.sendCopy') }}
              </label>


        <div class="d-flex gap-4">
  <div class="form-check pl-0 d-flex align-items-center gap-2">
    <input
      class="rounded-circle"
      type="radio"
      name="radio-sendCopy"
      value="yes"
      :checked="values.sendCopy === 'yes'"
      @change="setFieldValue('sendCopy','yes')"
    />
    <label class="form-check-label fw-bold">
      {{ $t('page.aboutUs.contactUs.form.yes') }}
    </label>
  </div>

  <div class="form-check pl-0 d-flex align-items-center gap-2">
    <input
      class="rounded-circle"
      type="radio"
      name="radio-sendCopy"
      value="no"
      :checked="values.sendCopy === 'no'"
      @change="setFieldValue('sendCopy','no')"
    />
    <label class="form-check-label fw-bold">
      {{ $t('page.aboutUs.contactUs.form.no') }}
    </label>
  </div>
</div>
</div>
        
        <div class="input-wrapper col-12">
          <FormFile v-model="attachment" class="mb-1" />
          <div>
            <p class="mb-0 form-label">
              <b> {{ $t("page.aboutUs.contactUs.form.fileFormat") }} </b>: jpg, png
            </p>
            <p class="form-label">
              <b>{{ $t("page.aboutUs.contactUs.form.maxFileSize") }}</b
              >: 500 KB
            </p>
          </div>
        </div>

        <!-- ✅ reCAPTCHA Enterprise widget -->
        <div id="recaptcha-container" class="my-4"></div>
        <div
          v-if="formErrors.recaptchaVerified"
          class="ps-2 error-message text-danger"
        >
          {{ $t("page.aboutUs.contactUs.form.errors.recaptcha") }}
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3 pb-5">
        <AppButton
          color="primary"
          full-on-mobile
          size="xl"
          type="submit"
          :disabled="isSubmitting"
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
  .complaint--form {
    gap: 36px;
  }
  .hr {
    padding: 5px 0;
    hr {
      background: $light-gray;
    }
  }
</style>