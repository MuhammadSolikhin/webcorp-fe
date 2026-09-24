<template>
  <div>
    <nuxt-link
      v-for="supportLink in props.supportLinks"
      :key="supportLink.link"
      :to="isValidUrl(supportLink.link) ? supportLink.link : localePath(supportLink.link)"
      class="text-decoration-none"
    >
      <span class="sub-menu underlined-text">{{ supportLink.text }}</span>
    </nuxt-link>
  </div>
</template>
<script setup lang="ts">
  import { isValidUrl } from "~/utils/validurl";
  const localePath = useLocalePath();
  const props = defineProps<{
    supportLinks: { text: string; link: string }[];
  }>();
</script>
