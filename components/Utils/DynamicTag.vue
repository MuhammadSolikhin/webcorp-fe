<template>
  <NuxtLink :to="props.to || ''" class="text-decoration-none">
    <slot name="link" />
  </NuxtLink>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    to: any;
  }>();
</script>
