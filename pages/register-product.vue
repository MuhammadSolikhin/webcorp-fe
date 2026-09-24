<template>
  <div>
    <AppHero background-image="/images/Pendaftaran_notxt.jpg" />
    <div class="container">
      <div class="row my-5 w-100 mx-auto">
        <div cols="col-12">
          <RegisterProductForm
            v-if="data"
            :product-options="data.map(item => ({ text: item.Title, value: item.Slug }))"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const { t, locale } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;
  const localePath = useLocalePath();

  export interface RegisterableProducts {
    Id: number;
    Title: string;
    Slug: string;
  }

  const { data } = await useFetch<RegisterableProducts[]>(
    `${apiUrl}/${locale.value}/registerable-products`
  );
  useAppSeo({
    title: t("page.registerProduct.title"),
    ogTitle: t("page.registerProduct.title"),
    ogImage: "/images/Pendaftaran_notxt.jpg",
    ogUrl: localePath("/register-product"),
  });
</script>
