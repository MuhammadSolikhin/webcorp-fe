<template>
  <div id="wrapper" class="pt-5 pb-5">
    <div class="container my-2">
      <AppTitle class="text-center mb-3" :title="$t('page.home.rate.exchangeRate.todaysRate')" />

      <div v-if="currenciesRes.length" class="justify-content-center fw-bold row">
        <div class="col-12 col-lg-6">
          <table class="theme-table table-default text-center">
            <tbody>
              <tr
                v-for="(currency, index) in firstHalfCurrencies"
                :key="`left-${index}`"
                class="shadow-sm"
              >
                <td class="align-middle">
                  <img
                    :alt="currency.fullName"
                    class="currency-flag me-2 img-fluid"
                    :src="`${cdnUrl}/icons/flags/${currency.flag}`"
                  />
                  {{ currency.name }}
                </td>
                <td>
                  <span class="text-start d-block buy-sell">
                    {{ $t("page.home.rate.exchangeRate.buy") }}
                  </span>
                  <span class="text-start d-block price">
                    {{ formatPrice(currency.buy) }}
                  </span>
                </td>
                <td>
                  <span class="text-start d-block buy-sell">
                    {{ $t("page.home.rate.exchangeRate.sell") }}
                  </span>
                  <span class="text-start d-block price">
                    {{ formatPrice(currency.sell) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12 col-lg-6">
          <table class="theme-table table-default text-center">
            <tbody>
              <tr
                v-for="(currency, index) in secondHalfCurrencies"
                :key="`right-${index}`"
                class="shadow-sm"
              >
                <td class="align-middle">
                  <img
                    :alt="currency.fullName"
                    class="currency-flag me-2 img-fluid"
                    :src="`${cdnUrl}/icons/flags/${currency.flag}`"
                  />
                  {{ currency.name }}
                </td>
                <td>
                  <span class="text-start d-block buy-sell">
                    {{ $t("page.home.rate.exchangeRate.buy") }}
                  </span>
                  <span class="text-start d-block price">
                    {{ formatPrice(currency.buy) }}
                  </span>
                </td>
                <td>
                  <span class="text-start d-block buy-sell">
                    {{ $t("page.home.rate.exchangeRate.sell") }}
                  </span>
                  <span class="text-start d-block price">
                    {{ formatPrice(currency.sell) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <small class="text-start latest-update">
        * {{ $t("page.home.rate.updatedAt") }}
        {{ getFullDateTimeFormat(new Date(), { locale } as DateOptions) }} WIB
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useHead, useRuntimeConfig } from "#app";
import { getFullDateTimeFormat, DateOptions } from "~/utils/formatDate";
import { formatPrice } from "~/utils/formatPrice";

// Runtime config (for CDN URLs)
const { cdnUrl } = useRuntimeConfig().public;

// i18n
const { t, locale } = useI18n();

// SEO title
useHead({
  title: t("page.nab.title"),
});

// Fetch currencies
const { currenciesRes, error } = await useCurrencies();

if (error.value) {
  throw createError("Currencies Not Loaded!");
}

// Defensive fallback
const currencyList = currenciesRes.value || [];

const firstHalfCurrencies = computed(() =>
  currencyList.slice(0, Math.ceil(currencyList.length / 2))
);
const secondHalfCurrencies = computed(() =>
  currencyList.slice(Math.ceil(currencyList.length / 2))
);
</script>

<style lang="scss" scoped>
#wrapper {
  background-color: map-get($neutralColor, "02");
}
</style>
