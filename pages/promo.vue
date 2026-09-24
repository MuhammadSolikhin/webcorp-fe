<template>
  <div>
    <AppHero background-image="/images/Promo_notxt.jpg" />
    <div class="container py-5">
      <div
        v-if="promos && promos.data"
        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 w-100 mx-auto promos"
      >
        <div v-for="(blog, index) in promos.data" :key="index" class="promo">
          <BlogNewsCard v-bind="blog" :to="localePath(`/news/${blog.Slug}`)" />
        </div>
      </div>
      <p v-else class="text-center py-5 fw-bold">{{ $t("shared.noDataFound") }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { News } from "types/news.types";
  const { apiUrl } = useRuntimeConfig().public;
  const { locale, t } = useI18n();
  const localePath = useLocalePath();
  const { data: promos, error } = await useFetch<{ data: News[] }>(
    `${apiUrl}/${locale.value}/blog-types/promo/blogs?1=1`
  );
  if (error.value) {
    throw createError(t("shared.noDataFound"));
  }
  useAppSeo({
    title: t("page.registerProduct.title"),
    ogTitle: t("page.promo.title"),
    ogImage: "/images/Promo_notxt.jpg",
    ogUrl: localePath("/promo"),
  });
</script>

<style lang="scss" scoped>
  .promos {
    row-gap: 36px;
    .promo {
      padding-left: 0;
      padding-right: 0;
      @media screen and (min-width: $sm) {
        padding-right: 15px;
      }
      @media screen and (min-width: $md) {
        padding-right: 20px;
      }
    }
  }
</style>
