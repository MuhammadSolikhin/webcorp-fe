<template>
  <div class="input-wrapper">
    <label class="form-label fw-bold">
      {{ props.label }}
    </label>

    <textarea
      v-bind="$attrs"
      v-model="inputValue"
      :class="['form-control', { 'is-invalid': props.error }]"
      :placeholder="props.placeholder"
      autocomplete="off"
      rows="4"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>

interface Props {
  label: string;
  placeholder: string;
  error?: boolean;
  modelValue?: string;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = computed({
  get() {
    return props.modelValue || "";
  },
  set(value: string) {
    emits("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
textarea {
  border-radius: 24px;
  padding: 16px 12px;

  &:focus {
    border-color: transparent !important;
    box-shadow: 0 0 0 2px $primary !important;
  }
}

.is-invalid {
  border: 1px solid red !important;
}
</style>