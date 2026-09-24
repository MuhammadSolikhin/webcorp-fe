<script setup lang="ts">
  const { t } = useI18n();
  const emits = defineEmits<{
    (e: "update:modelValue", val: Event): void;
  }>();
  const attrs = useAttrs();
  const fileRef = ref();
  function openFileInput() {
    if (fileRef.value) {
      fileRef.value.click();
    }
  }
  const fileInput = computed({
    get() {
      return attrs.modelValue || null;
    },
    set(file: any) {
      emits("update:modelValue", file);
    },
  });

  function setFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      fileInput.value = target.files[0];
    }
  }

  const fileName = computed(() => {
    return attrs.modelValue
      ? attrs.modelValue.name.length > 20
        ? attrs.modelValue.name.substr(0, 20) + "..." + attrs.modelValue.type.split("/")[1]
        : attrs.modelValue.name
      : t("form.fileInput");
  });
</script>

<template>
  <label for="formFile" class="w-100 form-file-input">
    <p class="form-label fw-bold">
      {{ $t("page.aboutUs.contactUs.form.attachment") }}
    </p>
    <div class="d-flex">
      <input
        id="formFile"
        ref="fileRef"
        class="d-none flex-grow-1"
        placeholder=""
        accept="image/jpeg, image/png"
        type="file"
        @change="setFile"
      />
      <div class="file-input-mock flex-grow-1">{{ fileName }}</div>
      <button type="button" class="fw-bold bg-primary text-white" @click="openFileInput">
        Browse
      </button>
    </div>
  </label>
</template>

<style lang="scss" scoped>
  .form-file-input {
    overflow: hidden;
    button {
      border-radius: 40px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border: 0;
      padding-left: 30px;
      padding-right: 30px;
    }
    .file-input-mock {
      padding: 13.5px 20px;
      border: 1px solid $light-gray;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
    }
  }
</style>
