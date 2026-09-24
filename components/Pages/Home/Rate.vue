<template>
  <section class="home-page-section-padding">
    <div class="container">
      <AppTitle
        size="lg"
        class="rate-section-title"
        style="margin-bottom: 36px"
        :html-content="parameterSettings['Kurs - Title']"
      />
      <div class="d-flex flex-column flex-md-row gap-3">
        <div class="exchange-tabs d-flex d-md-none">
          <button
            v-for="(tab, i) in tabs"
            :key="tab.slug"
            class="text-decoration-none d-inline-block tab-item"
            :class="[activeTab!.slug === tab.slug && 'active-item', i === 0 ? 'flex-shrink-0' : '']"
            @click="handleTabChange({ slug: tab.slug })"
          >
            {{ tab.title }}
          </button>
        </div>

        <AppSidebarList
          style="max-width: 200px"
          title=""
          text-field="name"
          :lists="tabs.map(val => ({ name: val.title, slug: val.slug }))"
          :convert-as-dropdown="true"
          :selected="activeTab?.slug"
          :as-link="false"
          :sticky="false"
          class="d-none d-md-block"
          @update:sidebar="handleTabChange"
        />

        <div class="flex-grow-1">
          <HomeRateExchangeRate
            v-if="activeTab!.slug === 'exchange-rate'"
            :currencies-res="currenciesRes || []"
          />

          <HomeRateNAB
            v-else-if="activeTab!.slug === 'nab-and-prime-lending-rate'"
            :prime-lending-rates="primeLendingRates || []"
            :nab-by-category="NABByCategory"
            :nab-last-updated-at="NABLastUpdatedAt"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PrimeLendingRate } from "~/types/currencies.types";
import type { ParameterSettings } from "~/types/parameter-settings.types";

const parameterSettings = inject<ParameterSettings>("parameter-settings")!;
const { locale } = useI18n();
const { apiUrl } = useRuntimeConfig().public;
const { t } = useI18n();

// =======================
// TABS
// =======================

const tabs = computed(() => [
  {
    title: t("page.home.rate.exchangeRate.title"),
    slug: "exchange-rate",
    active: activeSlug.value === "exchange-rate",
  },
  {
    title: t("page.home.rate.nabAndPrimeLendingRate.title"),
    slug: "nab-and-prime-lending-rate",
    active: activeSlug.value === "nab-and-prime-lending-rate",
  },
]);

const activeSlug = useState(
  "home-rate-active-tab",
  () => "exchange-rate"
);


const activeTab = computed(() =>
  tabs.value.find(tab => tab.slug === activeSlug.value)
);

function handleTabChange(value: { slug: string }) {
  activeSlug.value = value.slug;
}


// =======================
// FETCH CURRENCIES (Tetap SSR)
// =======================
const { currenciesRes } = await useCurrencies();

// =======================
// LAZY LOAD NAB — tidak auto fetch
// =======================
const {
  nabs,
  NABByCategory,
  NABLastUpdatedAt,
  loadNab,
  loading: nabLoading,
  error: nabError
} = useNab();

// Saat TAB NAB dipilih → baru fetch
watch(activeTab, (tab) => {
  if (tab?.slug === "nab-and-prime-lending-rate") {
    loadNab();
  }
});

// =======================
// PRIME LENDING RATES (Tetap SSR)
// =======================
const { data: primeLendingRates } = await useFetch<PrimeLendingRate[]>(
  `${apiUrl}/${locale.value}/prime-lending-rates`
);
</script>

<style lang="scss" scoped>
section {
  background-color: #f3f3f3;
}

.rate-section-title {
  text-align: left;
  @media screen and (min-width: $lg) {
    text-align: center;
  }
}

.exchange-tabs {
  .tab-item {
    color: $primary;
    background: transparent;
    border: none;
    padding: 8px 20px;
    font-weight: 500;

    @media screen and (min-width: $lg) {
      padding: 6px 26px;
      font-weight: bold;
    }

    &.active-item {
      border-bottom: 2px solid currentColor;
      font-weight: 700;
    }
  }
}
</style>