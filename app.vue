<script setup lang="ts">
  import { NAVData } from "~/types/nav.types";
  import { AppRes } from "~/types/utils.types";

  const { locale } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;

  const { data: navRes, error } = await useAsyncData<AppRes<NAVData>>(
    "navigations",
    () => {
      return $fetch(`${apiUrl}/${locale.value}/v2/navigations`);
    },
    { watch: [locale] }
  );
  if (error.value || !navRes.value) {
    throw createError("nav data not loaded");
  }
  const { navStore } = useNav();
  navStore.value = navRes.value ? navRes.value.data : null;
  watch(navRes, n => {
    navStore.value = n ? n.data : null;
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
