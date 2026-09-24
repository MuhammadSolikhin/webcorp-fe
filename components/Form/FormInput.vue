<template>
  <div class="input-wrapper" :class="props.wrapperClass">
    <label v-if="props.label" class="form-label fw-bold">
      {{ props.label }}
    </label>
    <input
      v-model="value"
      class="form-control form-control-lg"
      :class="errorMessage && 'input-error'"
      :placeholder="props.placeholder"
      autocomplete="off"
      v-bind="$attrs"
    />
    <div v-if="errorMessage" class="ps-2 error-message text-danger">
      {{ $t(errorMessage, errorMessage) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineOptions({
    inheritAttrs: false,
  });
  interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    wrapperClass?: string;
  }
  const props = defineProps<Props>();
  const { value, errorMessage } = useField(() => props.name);
</script>
<style lang="scss" scoped>
  input {
    border-radius: 40px;
    padding: 14px 20px;
    &:focus {
      border-color: transparent !important;
      box-shadow: 0 0 0 2px $primary !important;
    }
    &.input-error {
      border: 1.5px solid $danger !important;
      box-shadow: none !important;
    }
  }
  .error-message {
    font-size: 14px;
    margin-top: 4px;
    font-weight: 500;
  }
</style>
