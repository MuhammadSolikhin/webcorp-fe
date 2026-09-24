<script setup lang="ts">
  import { ISubTypePage } from "~/types/subtype.types";
  import WithSidebar from "~/layouts/with-sidebar.vue";
  import { ref, computed, onMounted, onUnmounted } from "vue";

  const route = useRoute("type-subType");
  const localePath = useLocalePath();
  
  const width = ref(0);

  function updateWidth() {
    width.value = window.innerWidth;
  }

  onMounted(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateWidth);
  });

  const isMobile = computed(() => width.value <= 768);

  const { data: typePageRes, error } = await useAPI<{ data: ISubTypePage }>(
    `products/${route.params.type}/${route.params.subType}`
  );

  if (!typePageRes.value || error.value) {
    throw createError({});
  }
  if (!route.query.product) {
    navigateTo(localePath({ query: { product: typePageRes.value.data.SubPage.Products[0].Slug } }));
  }

  const links = [
    {
      to: ``,
      title: typePageRes.value.data.Title,
    },
    {
      to: `/${typePageRes.value.data.Slug}/${typePageRes.value.data.SubPage.Slug}`,
      title: typePageRes.value.data.SubPage.Title,
    },
  ];

  const activeProduct = computed(() => {
    const p = typePageRes.value!.data.SubPage.Products.find(
      item => item.Slug === route.query.product
    );
    if (p) return p;
    return typePageRes.value?.data.SubPage.Products[0];
  });

  useAppSeo({
    title: typePageRes.value.data.SubPage.Title,
    ogTitle: typePageRes.value.data.SubPage.Title,
    description: activeProduct.value ? activeProduct.value.BannerTitle : "",
    ogDescription: activeProduct.value ? activeProduct.value.BannerTitle : "",
    ogUrl: localePath(`/${route.params.type}/${route.params.subType}`),
    ogImage: activeProduct.value ? activeProduct.value.HeroImage : "",
  });

  function sanitizeProductContent(content: string): string {
    return content.replace(/table theme-table/g, "theme-table");
  }

  function handleTabChange(slug: string) {
    navigateTo(localePath(`/${route.params.type}/${slug}`));
  }
</script>

<template>
  <div>
    <AppHero
      v-if="activeProduct"
      :background-image="isMobile ? activeProduct.MobileHeroImage : activeProduct.HeroImage"
      :banner-text="activeProduct.BannerTitle"
      :banner-title="typePageRes!.data.SubPage.Title"
      :links="links"
    />
    <div class="text-white bg-secondary">
      <div class="container">
        <div class="tabs-container">
          <AppTabs
            v-if="typePageRes"
            :items="typePageRes.data.SubPages"
            :active-item="(route.params.subType as string)"
            class="text-white"
            @item-click="handleTabChange"
          />
        </div>
      </div>
    </div>
    <WithSidebar>
      <template #sidebar>
        <AppSidebarList
          v-if="typePageRes"
          :title="typePageRes.data.SubPage.SidebarTitle"
          :lists="
            typePageRes.data.SubPage.Products.map(item => ({
              name: item.Title,
              slug: item.Slug,
            }))
          "
          :convert-as-dropdown="true"
          :selected="(route.query.product as string)"
          query-key="product"
          :as-link="true"
          :scroll-to-view="{ elementId: 'product-page-content', offsetTop: 200 }"
        />
      </template>
      <template #default>
        <div v-if="activeProduct" id="product-page-content" class="w-100">
          <AppTitle
            v-if="activeProduct.Title"
            :id="activeProduct.Id"
            color="primary"
            class="page-content__title mb-3"
          >
            {{ activeProduct.Title }}
          </AppTitle>
          <div v-html="sanitizeProductContent(activeProduct.Content)"></div>
          <div>
            <hr v-if="activeProduct.Footer || activeProduct.Registerable === 1" class="my-3" />
            <div class="d-flex flex-column flex-md-row">
              <div
                v-if="activeProduct.Footer"
                class="footer-content flex-grow-1"
                v-html="activeProduct.Footer"
              ></div>
              <div v-if="activeProduct.Registerable === 1" class="my-auto">
                <AppButton
                  size="xl"
                  full-on-mobile
                  :to="localePath(`/register-product`)"
                  height="medium"
                  color="primary"
                  >{{ $t("page.registerProduct.applyNow") }}</AppButton
                >
              </div>
            </div>
          </div>
        </div>
        <p v-else class="py-5 w-100 text-center fw-bold">{{ $t("page.notFound.description") }}!</p>
      </template>
    </WithSidebar>
  </div>
</template>

<style lang="scss">
  #product-tablet-sidebar {
    .sidebar-title {
      font-weight: bold;
      color: $dark-gray;
    }
  }
  .footer-content {
    a {
      text-decoration: none;
      color: $secondary;
    }
    li {
      margin-right: 12px;
    }
  }
  .tabs-container {
    @media screen and (min-width: $lg) {
      display: flex;
      justify-content: center;
    }
  }
</style>

<style lang="scss" scoped>
  #product-page-content {
    .page-content__title {
      font-size: 36px;
    }
  }
</style>