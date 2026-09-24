<template>
  <div class="position-relative">
    <input v-model="inputValue" class="form-control" :placeholder="props.placeholder" />
    <div class="position-absolute icon-container">
      <slot name="icon" />
    </div>
  </div>
</template>
<script setup lang="ts">
  const emits = defineEmits<{
    (e: "update:modelValue", val: string): void;
  }>();
  const props = withDefaults(defineProps<{ placeholder: string }>(), {
    placeholder: "",
  });
  defineOptions({
    inheritAttrs: false,
  });
  const attrs = useAttrs();
  const inputValue = computed({
    get() {
      return attrs.modelValue as string;
    },
    set(value: string) {
      emits("update:modelValue", value);
    },
  });
</script>

<style lang="scss" scoped>
  input {
    border-radius: 100px;
    display: inline-block;
    border: none;
    outline: 1px solid #828282;
    padding: 10px 16px;
    color: $body-color;
    &:active,
    &:focus {
      outline: 1px solid #828282;
    }
  }
  input::placeholder {
    color: $light-gray;
  }
  .icon-container {
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
</style>
