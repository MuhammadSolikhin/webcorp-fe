<script setup lang="ts">
  interface Options {
    name: string;
    value: string;
  }
  const props = defineProps<{
    options: Options[];
    selected?: Options[][number]["value"];
    modelValue?: string;
  }>();
  const emits = defineEmits<{
    (e: "update:modelValue", value: string): void;
  }>();
</script>

<template>
  <select
    v-bind="$attrs"
    :value="modelValue"
    class="form-select"
    aria-label="Default select example"
    @change="emits('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :selected="option.value === props.selected"
    >
      {{ option.name }}
    </option>
  </select>
</template>
<style lang="scss" scoped>
  select.form-select {
    border-radius: 8px;
    border: none;
    box-shadow: inset 0 0 0 1px #b4b4b4;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 14px;
  }
</style>
