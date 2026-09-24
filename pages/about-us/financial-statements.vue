<script setup lang="ts">
  import { ref, computed, watch, onMounted, inject } from "vue";
  import type {
    YearsRes,
    FinancialStatementRes,
    FinancialStatementGroupsRes,
  } from "~/types/financial-statements.types";
  import WithSidebar from "~/layouts/with-sidebar.vue";
  import { makeSlug } from "~/utils/helpers";

  // Get runtime configuration and other necessary properties
  const { apiUrl } = useRuntimeConfig().public;
  const { locale } = useI18n();
  const route = useRoute();
  const localePath = useLocalePath();
  const isTabletPlus = inject("isTabletPlus");

  // Fetch product metadata for SEO purposes
  const { banner, links } = await useProductMeta("financial-statements/financial-statements");

  // Set up SEO metadata for the page
  useAppSeo({
    title: banner.value.bannerTitle,
    ogTitle: banner.value.bannerTitle,
    ogImage: banner.value.backgroundImage,
    ogUrl: localePath("/about-us/financial-statements"),
  });

  // Fetch financial statement groups from the API
  const { data: financialStatementGroups, error: groupError } =
    await useAPI<FinancialStatementGroupsRes>("financial-statement-groups");

  // Handle errors when fetching financial statement groups
  if (groupError.value || !financialStatementGroups || !financialStatementGroups.value) {
    throw createError("Unable to load financial statements group");
  }

  // State management for pagination and active years
  const pageNumber = useState("financial-statement-page", () => 1);
  const activeYears = ref<Record<number, number>>({});
  const activeYear = computed(() =>
    activeStatementsGroup.value ? activeYears.value[activeStatementsGroup.value.Id] ?? null : null
  );

  const years = ref<{ year: number }[]>([]);

  // Manage the currently active financial statements group
  const activeStatementsGroup = useState("active-statements-group", () => {
    if (!financialStatementGroups.value || !financialStatementGroups.value.data.length) return null;
    if (route.query.group) {
      const item = financialStatementGroups.value?.data.find(
        item => makeSlug(item.Header) === route.query.group
      );
      if (item) return item;
    }
    return financialStatementGroups.value.data[0];
  });

  // Watch for changes in the route query to update the active statements group
  watch(
    () => route.query,
    query => {
      if (query.group) {
        pageNumber.value = 1;
        activeStatementsGroup.value =
          financialStatementGroups.value?.data.find(
            item => makeSlug(item.Header) === query.group
          ) || null;
      }
    }
  );

  // Ensure an active statements group is found
  if (!activeStatementsGroup.value) {
    throw createError("Financial statements group not found!");
  }

  // Function to fetch available years for the selected financial statements group
  const fetchAvailableYears = async () => {
    if (!activeStatementsGroup.value) return;

    try {
      const response = await $fetch<YearsRes>(
        `${apiUrl}/${locale.value}/v2/financial-statement-groups-year/${activeStatementsGroup.value.Id}/financial-statements`
      );

      if (response && response.year) {
        years.value = response.year.map(year => ({ year })).reverse();

        // Set activeYear only if it hasn't been selected before
        if (!activeYears.value[activeStatementsGroup.value.Id]) {
          activeYears.value[activeStatementsGroup.value.Id] = years.value.length
            ? years.value[0].year
            : new Date().getFullYear();
        }
      }
    } catch (error) {
      console.error("Failed to fetch available years:", error);
    }
  };

  // Watch for changes in the active statements group to fetch available years
  watch(activeStatementsGroup, async newGroup => {
    if (newGroup) {
      await fetchAvailableYears();
    }
  });

  // Fetch financial statements based on the active group and year
  const { data: financialStatements, status } = useAsyncData<FinancialStatementRes>(
    "financial-statements-data",
    () => {
      if (!activeStatementsGroup.value || !activeYear.value) return null;

      return $fetch(
        `${apiUrl}/${locale.value}/v2/financial-statement-groups-year/${
          activeStatementsGroup.value.Id
        }/financial-statements?year=${activeYear.value}${
          pageNumber.value > 1 ? "&page=" + pageNumber.value : ""
        }`
      );
    },
    { watch: [() => activeStatementsGroup.value, () => pageNumber.value, () => activeYear.value] }
  );

  // Determine if pagination is needed based on the total number of financial statements
  const hasPagination = computed(() => {
    if (!financialStatements.value) return false;
    return (
      Math.ceil(financialStatements.value.meta.total / financialStatements.value.meta.per_page) > 1
    );
  });

  // Function to set the active year and reset the page number
  const setActiveYear = (year: number) => {
    if (activeStatementsGroup.value) {
      activeYears.value[activeStatementsGroup.value.Id] = year;
    }
    pageNumber.value = 1;
  };

  // On component mount, fetch available years and navigate if no group is specified
  onMounted(async () => {
    await fetchAvailableYears();
    if (!route.query.group && activeStatementsGroup.value) {
      navigateTo(localePath({ query: { group: makeSlug(activeStatementsGroup.value.Header) } }));
    }
  });
</script>

<template>
  <AppHero
    v-if="banner"
    :background-image="banner.backgroundImage"
    :banner-text="''"
    :banner-title="$t('page.aboutUs.financialStatements.title')"
    :links="links"
  />
  <WithSidebar>
    <template #sidebar>
      <AppSidebarList
        v-if="financialStatementGroups && financialStatementGroups.data.length"
        :title="$t('page.aboutUs.financialStatements.title')"
        :lists="
          financialStatementGroups.data.map(item => ({
            name: item.Header,
            slug: makeSlug(item.Header),
          }))
        "
        :convert-as-dropdown="true"
        :selected="activeStatementsGroup ? makeSlug(activeStatementsGroup.Header) : ''"
        :as-link="true"
        query-key="group"
        :scroll-to-view="{ elementId: 'financial-statements', offsetTop: 100 }"
      />
    </template>
    <template #default>
      <div
        v-if="activeStatementsGroup"
        id="financial-statements"
        :class="isTabletPlus ? '' : 'container'"
      >
        <AppTitle v-if="isTabletPlus" color="primary" size="sm">{{
          $t("page.aboutUs.financialStatements.title")
        }}</AppTitle>
        <AppText
          color="secondary"
          :size="undefined"
          style="font-size: clamp(14px, 2vw, 16px)"
          class="fw-bold"
        >
          {{ activeStatementsGroup.Title }}
        </AppText>
        <ul v-if="years.length > 0" class="tab-list">
          <li
            v-for="(item, index) in years"
            :key="index"
            :class="{ active: item.year === activeYear }"
            @click="setActiveYear(item.year)"
          >
            {{ item.year }}
          </li>
        </ul>
        <ul v-if="financialStatements && years.length > 0" class="list-group">
          <li
            v-for="(statement, i) in financialStatements.data"
            :key="statement.Id"
            class="list-group-item border-0 d-flex justify-content-between align-items-center"
            :class="i % 2 === 0 ? (hasPagination ? 'table-orange' : 'table-gray') : 'table-light'"
          >
            <span class="d-inline-block">{{ statement.Title }}</span>
            <a
              class="d-inline-block text-decoration-none fw-bold"
              :href="statement.FileUrl"
              target="_blank"
            >
              Download
            </a>
          </li>
        </ul>
        <div v-if="financialStatements && financialStatements.data.length == 0"></div>
      </div>
      <div class="w-100 d-flex flex-column align-items-center py-4">
        <BlogPagination
          v-if="
            financialStatements &&
            Math.ceil(financialStatements.meta.total / financialStatements.meta.per_page) > 1
          "
          :current-page="financialStatements.meta.current_page"
          :page-limit="financialStatements.meta.per_page"
          :total-items="financialStatements.meta.total"
          :scroll-to-top="{
            elementId: '#financial-statements',
            scroll: status === 'success',
            space: 100,
          }"
          @update:pagination="p => (pageNumber = p)"
        />
      </div>
    </template>
  </WithSidebar>
</template>

<style scoped lang="scss">
  #financial-statements {
    @media screen and (max-width: 991.98px) {
      padding-top: 16px;
    }

    @media screen and (max-width: 768px) {
      padding: 24px 32px 0;
    }

    @media screen and (max-width: 767.98px) {
      padding: 0;
    }
  }

  .tab-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
    overflow: hidden;
    overflow-x: auto;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      -webkit-appearance: none;
      display: none;
      width: 0;
    }

    @media only screen and (max-width: 991.98px) {
      margin-left: -24px;
      margin-right: -24px;
      padding-right: 24px;
      padding-left: 24px;
    }

    @media only screen and (max-width: 767.98px) {
      margin-bottom: 24px;
    }

    li {
      position: relative;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0;
      margin-right: 24px;
      color: $dark-gray;

      @media only screen and (max-width: 767.98px) {
        font-size: 14px;
      }

      &:last-child {
        margin-right: 0;
      }

      &.active {
        font-weight: bold;
        color: $secondary;
        opacity: 1;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: $secondary;
        }
      }
    }
  }

  .table-light {
    background-color: $light;
  }

  .table-gray {
    background-color: $table-gray;
  }

  .table-orange {
    background-color: $table-orange;
  }

  .list-group-item {
    border-radius: 16px;
    padding: 15px 20px;
    margin-bottom: 15px;
  }
</style>
