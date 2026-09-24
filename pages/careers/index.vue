<template>
  <div>
    <!-- Hero -->
    <AppHero background-image="/images/Career_notxt.jpg" />

    <WithSidebar>
      <template #sidebar>
        <AppSidebarList
          :title="$t('page.career.openPosition')"
          :as-link="true"
          :convert-as-dropdown="true"
          :lists="categories?.data.map((item) => ({
            name: item.Title,
            slug: item.Slug!
          }))"
          :selected="activeCategorySlug"
          query-key="category"
          @update:sidebar="v => (activeCategorySlug = v.slug)"
        />
      </template>
      <template #default>
        <template v-if="activeCategory">
          <AppTitle class="mb-3" :title="$t('page.career.title')" />
          <p class="secondary-color fw-bold mb-0 mt-4 font-family-title">
            {{ activeCategory.Title }}
          </p>
          <span> {{ activeCategory.Vacancies.length }} {{ $t("page.career.openPosition") }} </span>

          <table class="theme-table table-neutral--02">
            <tbody>
              <tr v-for="(vacancy, index) in activeCategory.Vacancies" :key="index">
                <td class="align-middle">
                  <span class="primary-color fw-bold">
                    {{ vacancy.Title }}
                  </span>
                </td>
                <td class="text-end align-middle">
                  <AppLink
                    class="text-primary"
                    :title="$t('page.career.checkDescription')"
                    :to="`/careers/${vacancy.Slug}`"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <div class="pb-5 row">
            <div class="text-center col">
              <img
                id="placeholderImage"
                class="mt-5 img-fluid"
                src="/icons/placeholder-2.png"
                fluid
              />
              <h1 class="fw-bold">
                {{ $t("page.career.noOpenPosition.title") }}
              </h1>
              <span>
                {{ $t("page.career.noOpenPosition.subtitle") }}
              </span>
            </div>
          </div>
        </template>
      </template>
    </WithSidebar>
  </div>
</template>
<script setup lang="ts">
  import WithSidebar from "~/layouts/with-sidebar.vue";
  const { apiUrl } = useRuntimeConfig().public;
  const { locale, t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute("careers");

  interface Vacancy {
    Id: number;
    Title: string;
    Slug: string;
  }
  interface Category {
    Id: number;
    Title: string;
    Slug?: string;
    Vacancies: Vacancy[];
  }
  const { data: categories, error } = await useFetch<{ data: Category[] }>(
    `${apiUrl}/${locale.value}/vacancy-types`,
    {
      transform: input => {
        input.data.forEach(item => {
          if (item && item.Title) {
            item.Slug = item.Title.toLowerCase().split(" ").join("-");
          }
        });
        return input;
      },
    }
  );
  if (!categories.value || error.value) {
    throw createError("careers not loaded!");
  }
  useAppSeo({
    title: t("page.career.title"),
    ogTitle: t("page.career.title"),
    ogImage: "/images/Career_notxt.jpg",
    ogUrl: localePath("/careers"),
  });
  const activeItem = categories.value!.data.find(item => item.Slug === route.query.category);
  const activeCategorySlug = useState(() =>
    activeItem ? activeItem.Slug : categories.value!.data[0].Slug
  );

  const activeCategory = computed(() => {
    return categories.value!.data.find(item => item.Slug === activeCategorySlug.value);
  });

  onMounted(() => {
    if (!route.query.category) {
      navigateTo(localePath({ query: { category: categories.value!.data[0].Slug } }));
    }
  });
</script>

<style lang="scss" scoped>
  #placeholderImage {
    max-height: 250px;
  }
  a {
    text-decoration: none;
  }
</style>
