<script setup lang="ts">
  const props = defineProps<{ text: string; iconName: string }>();
</script>

<template>
  <AppButton v-bind="$attrs" class="align-items-center">
    <span>{{ props.text }}</span>
    <span class="d-inline-flex align-items-center">
      <i class="bx" :class="'bx-' + props.iconName"></i>
    </span>
  </AppButton>
</template>

<style lang="scss" scoped>
  span {
    display: inline-block;
    &:nth-child(2) {
      transform: translateY(1px);
    }
  }
  i {
    font-size: clamp(24px, 1.9vw, 28px);
  }
</style>
