<template>
  <div>
    <div class="py-5 container sitemap d-flex flex-column">
      <h2 class="title-lg fw-bold text-secondary">{{ $t("page.sitemap.title") }}</h2>
      <SitemapTable
        v-for="item in navData['Left Menu']"
        :key="item.Id"
        :table-text="item.Title"
        :table-items="item"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  const localePath = useLocalePath();
  useAppSeo({
    title: "Sitemap",
    description: "sitemap",
    ogDescription: "sitemap",
    ogTitle: "Hibank Sitemap",
    ogImage: "/icons/hi-bank-log-og.svg",
    ogUrl: localePath("/sitemap"),
  });
  const { navData } = await useNav();
</script>

<style lang="scss" scoped>
  .sitemap {
    gap: 42px;
  }
</style>
