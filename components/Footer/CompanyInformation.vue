<template>
  <div>
    <a
      v-for="item in props.informations"
      :key="item.slug"
      :href="isValidUrl(item.slug) ? item.slug : String(localePath(item.slug))"
      class="text-decoration-none"
      :target="isValidUrl(item.slug) ? '_blank' : undefined"
      :rel="isValidUrl(item.slug) ? 'noopener' : undefined"
    >
      <span class="sub-menu underlined-text"> {{ item.text }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
  import { isValidUrl } from "~/utils/validurl";
  const localePath = useLocalePath();
  const props = defineProps<{ informations: { text: string; slug: string }[] }>();
</script>
