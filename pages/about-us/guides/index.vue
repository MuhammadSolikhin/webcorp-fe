<script setup lang="ts">
  import { PaginationAppRes } from "types/utils.types";

  const { locale } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;
  const localePath = useLocalePath();
  const route = useRoute();

  const pageNumber = useState(() => (route.query.page ? +(route.query.page as string) : 1));
  watch(pageNumber, val => {
    navigateTo({ query: { page: val } });
  });

  const { banner, links, tabs } = await useProductMeta("about-us/guides");

  useAppSeo({
    title: banner.value.bannerTitle,
    ogTitle: banner.value.bannerTitle,
    ogImage: banner.value.backgroundImage,
    ogUrl: localePath("/about-us/guides"),
  });
  interface Guide {
    Id: number;
    Image: string;
    Title: string;
    Slug: string;
  }

  const { data: guideGroups, status } = await useAsyncData<PaginationAppRes<Guide[]>>(
    "articles",
    () => {
      return $fetch(`${apiUrl}/${locale.value}/v2/guide-groups?page=${pageNumber.value}&limit=9`);
    },
    { watch: [() => pageNumber.value] }
  );

  onMounted(() => {
    if (!route.query.page) {
      navigateTo({
        query: { ...route.query, page: 1 },
      });
    }
  });
</script>

<template>
  <div>
    <AppHero
      v-if="banner"
      :background-image="banner.backgroundImage"
      :banner-text="''"
      :banner-title="banner.bannerTitle"
      :links="links"
    />
    <div class="bg-secondary">
      <div class="container tabs-container">
        <AppTabs
          :items="tabs"
          :active-item="'guides'"
          class="text-white"
          @item-click="
            val => {
              navigateTo(localePath(`/about-us/${val}`));
            }
          "
        />
      </div>
    </div>
    <div id="guides" class="container py-5">
      <template v-if="guideGroups && guideGroups.data">
        <div class="guides row row-cols-2 row-cols-md-3 row-cols-md-4 w-100 mx-auto">
          <div v-for="guideGroup in guideGroups.data" :key="guideGroup.Id" class="col mb-4">
            <NuxtLink
              :to="localePath(`/about-us/guides/groups/${guideGroup.Slug}`)"
              class="guides__card text-decoration-none"
            >
              <div class="guides__card--image">
                <NuxtImg :src="guideGroup.Image" />
              </div>
              <div class="guides__card--text">
                <h2>{{ guideGroup.Title }}</h2>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="py-3 d-flex justify-content-center">
          <BlogPagination
            :current-page="guideGroups.meta.current_page"
            :page-limit="guideGroups.meta.per_page"
            :total-items="guideGroups.meta.total"
            :scroll-to-top="{ elementId: '#guides', scroll: status === 'success', space: 100 }"
            @update:pagination="p => (pageNumber = p)"
          />
        </div>
      </template>
      <p v-else class="py-3 text-center fw-bold text-capitalize">there is no guides</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tabs-container {
    @media screen and (min-width: $lg) {
      display: flex;
      justify-content: center;
    }
  }
  .guides {
    &__card {
      border-radius: 16px;
      box-shadow: 0px 15px 35px 0px rgba(0, 0, 0, 0.05);
      border: 1px solid $light-gray;
      overflow: hidden;
      display: block;
      @media screen and (min-width: $md) {
        border-radius: 24px;
        border: none;
      }
      &--image {
        img {
          width: 100%;
          display: block;
        }
      }
      &--text {
        padding: 10px 8px;
        h2 {
          font-size: clamp(14px, 2vw, 24px);
          font-weight: 700;
          text-align: start;
          @media screen and (min-width: $md) {
            text-align: center;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
