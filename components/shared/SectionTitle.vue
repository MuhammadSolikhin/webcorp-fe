<template>
  <h2
    v-if="props.htmlContent"
    class="text-secondary"
    :class="props.type === 'large' ? 'large' : 'medium'"
    v-html="props.htmlContent"
  ></h2>
  <h2 v-else class="text-secondary" :class="props.type === 'large' ? 'large' : 'medium'">
    <slot />
  </h2>
</template>
<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      htmlContent?: any;
      type: "large" | "medium";
    }>(),
    {
      type: "large",
    }
  );
</script>

<style lang="scss" scoped>
  h2 {
    font-weight: 700;
    line-height: 150%;
  }
  .large {
    font-size: clamp(2rem, 3vw, 48px);
  }
  .medium {
    font-size: clamp(2rem, 3vw, 64px);
  }
</style>
