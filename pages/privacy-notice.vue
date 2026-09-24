<script setup lang="ts">
  import WithoutSidebar from "~/layouts/without-sidebar.vue";
  const route = useRoute();
  const localePath = useLocalePath();

  const { banner, links, products } = await useProductMeta("privacy-notice/privacy-notice");

  useAppSeo({
    title: banner.value.bannerTitle,
    ogTitle: banner.value.bannerTitle,
    ogImage: banner.value.backgroundImage,
    ogUrl: localePath("/privacy-notice"),
  });

  const activeProduct = computed(() => {
    const p = products.value.find(item => item.Slug === route.query.product);
    return p || products.value[0];
  });

  function sanitizeProductContent(content: string): string {
    return content.replace(/table theme-table/g, "theme-table");
  }
</script>

<template>
  <div class="main-container">
    <AppHero
      v-if="banner"
      :background-image="banner.backgroundImage"
      :banner-text="''"
      :banner-title="banner.bannerTitle"
      :links="links"
    />
    <WithoutSidebar>
      <template #default>
        <div v-if="activeProduct">
          <h2 :id="activeProduct.Id.toString()" class="fw-bolder title-lg mb-3 text-primary">
            {{ activeProduct.Title }}
          </h2>
          <div v-html="sanitizeProductContent(activeProduct.Content)"></div>
          <div v-if="activeProduct.Footer">
            <hr />
            <div v-html="activeProduct.Footer"></div>
          </div>
        </div>
        <p v-else class="py-5 w-100 text-center fw-bold">{{ $t("page.notFound.description") }}!</p>
      </template>
    </WithoutSidebar>
  </div>
</template>

<style lang="scss">
  html,
  body {
    overflow-x: hidden;
    max-width: 100%; // Prevent overflow on the body
  }

  .main-container {
    overflow-x: hidden;
    max-width: 100%;
    width: 100%;
  }

  #product-tablet-sidebar {
    .sidebar-title {
      font-weight: bold;
      color: $dark-gray;
    }
  }

  .tabs-container {
    @media screen and (max-width: 767px) {
      // Adjust for mobile view
      display: block;
      overflow-x: hidden;
    }
    @media screen and (min-width: $lg) {
      display: flex;
      justify-content: center;
    }
  }

  #product-page-content {
    .sidebar-title {
      font-weight: bold;
      color: $dark-gray;
    }
    a {
      color: map-get($secondaryColor, "50");
    }

    a:hover {
      font-weight: bold;
    }
  }
</style>
