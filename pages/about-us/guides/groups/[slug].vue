<script setup lang="ts">
  import type { AppRes, PaginationAppRes } from "~/types/utils.types";
  import GuidesCard from "~/components/Pages/Guides/GuidesCard.vue";

  const localePath = useLocalePath();
  const { apiUrl } = useRuntimeConfig().public;
  const { locale, t } = useI18n();
  const route = useRoute("about-us-guides-groups-slug");

  useAppSeo({
    title: t("page.guides.title") + " - " + route.params.slug,
    ogTitle: t("page.guides.title") + " - " + route.params.slug,
    ogUrl: localePath(`/about-us/guides/groups/${route.params.slug}`),
  });

  const pageNumber = useState(() => (route.query.page ? +(route.query.page as string) : 1));
  watch(pageNumber, val => {
    navigateTo({ query: { page: val } });
    window.scrollTo({ top: 0 });
  });

  interface Group {
    Id: number;
    Image: string;
    Title: string;
    Slug: string;
    BackgroundColor: string;
  }
  const { data: group } = await useAPI<AppRes<Group>>(`guide-groups/${route.params.slug}`);

  export interface GroupGuide {
    Id: number;
    Image: string;
    Title: string;
    Question: string;
    Slug: string;
    Description: string;
  }

  const { data: groupGuides, status } = await useAsyncData<PaginationAppRes<GroupGuide[]>>(
    "groupGuides",
    () => {
      return $fetch(
        `${apiUrl}/${locale.value}/v2/guide-groups/${route.params.slug}/guides?page=${pageNumber.value}&limit=9`
      );
    },
    { watch: [() => pageNumber.value] }
  );

  const links = computed(() => [
    { title: t("page.aboutUs.aboutUs.title"), to: localePath("/about-us") },
    { title: t("page.guides.title"), to: localePath("/about-us/guides") },
    {
      title: group.value!.data.Title,
      to: localePath(`/about-us/guides/groups/${route.params.slug}`),
    },
  ]);

  onMounted(() => {
    if (!route.query.page) {
      navigateTo({
        query: { ...route.query, page: 1 },
      });
    }
  });
</script>

<template>
  <section>
    <div
      v-if="group"
      class="guides-group__hero--container"
      :style="{ background: group.data.BackgroundColor }"
    >
      <div class="guides-group__hero container">
        <BlogBreadcrumb :links="links" color="dark" />
        <div class="guides-group__hero--group">
          <NuxtImg class="guides-group__hero--image" :src="group.data.Image" />
          <div class="guides-group__hero--content">
            <h4 class="text-secondary fw-bold title-es">{{ t("page.guides.title") }}</h4>
            <h2 class="text-dark fw-bold title-lg">{{ group.data.Title }}</h2>
          </div>
        </div>
      </div>
    </div>
    <div v-if="groupGuides" id="guides-group" class="guides-group__card--container container">
      <GuidesCard
        v-for="groupGuide in groupGuides.data"
        :key="groupGuide.Id"
        route-path-prefix="/about-us/guides"
        :guide="groupGuide"
      />
      <div class="py-3 d-flex justify-content-center w-100">
        <BlogPagination
          :current-page="groupGuides.meta.current_page"
          :page-limit="groupGuides.meta.per_page"
          :total-items="groupGuides.meta.total"
          :scroll-to-top="{ elementId: '#guides-group', scroll: status === 'success', space: 100 }"
          @update:pagination="p => (pageNumber = p)"
        />
      </div>
    </div>
    <div v-else>
      <p class="fw-bold text-center">Guides Group Not Found</p>
    </div>
  </section>
</template>

<style lang="scss">
  section {
    padding-bottom: 40px;
  }
  .guides-group__hero.container,
  .guides-group__card--container.container {
    @media screen and (min-width: $md) {
      max-width: 550px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    @media screen and (min-width: $lg) {
      max-width: 1000px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
  .guides-group__hero--container {
  }
  .guides-group {
    &__hero {
      display: flex;
      padding: 36px 0 64px 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 36px;

      &--group {
        display: flex;
      }
      &--image {
        width: 100px;
        height: 100px;
      }
      &--content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        flex: 1 0 0;
        align-self: stretch;
      }
      @media screen and (min-width: $md) {
        padding: 48px 0 96px 0;
        gap: 42px;
        &--image {
          width: 150px;
          height: 150px;
        }
      }

      @media screen and (min-width: $lg) {
        padding: 64px 0 154px 0;
        gap: 48px;
        &--image {
          width: 200px;
          height: 200px;
        }
      }
    }
    &__card--container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 36px;
      margin-top: -40px;
      @media screen and (min-width: $md) {
        margin-top: -70px;
      }
      @media screen and (min-width: $lg) {
        margin-top: -100px;
      }
    }
  }
</style>
