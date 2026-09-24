<template>
  <div class="input-wrapper" :class="props.wrapperClass">
    <label v-if="props.label" class="form-label fw-bold">
      {{ props.label }}
    </label>
    <select
      v-bind="$attrs"
      v-model="value"
      class="form-select form-select-lg"
      :class="errorMessage && 'input-error'"
      autocomplete="off"
    >
      <option selected :value="props.options[0].value">
        {{ props.options[0].text }}
      </option>
      <option v-for="opt in options" :key="opt.value!" :value="opt[props.valueField]">
        {{ opt[props.textField] }}
      </option>
    </select>
    <div v-if="errorMessage" class="ps-2 error-message text-danger">
      {{ $t(errorMessage, errorMessage) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface Select {
    text: string;
    value: string | null;
  }
  interface Props {
    name: string;
    label?: string;
    options: Select[];
    wrapperClass?: string;
    valueField?: keyof Select;
    textField?: keyof Select;
  }
  defineOptions({
    inheritAttrs: false,
  });
  const props = withDefaults(defineProps<Props>(), {
    textField: "text",
    valueField: "value",
  });
  const options = computed(() => props.options.slice(1, props.options.length));
  const { value, errorMessage } = useField(() => props.name);
</script>

<style lang="scss" scoped>
  select {
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
