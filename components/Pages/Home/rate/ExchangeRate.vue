<template>
  <div v-if="currenciesRes && currenciesRes.length" class="row justify-space-between">
    <div class="col-12 col-lg-6">
      <div class="currencies-table-box">
        <h3 class="fw-semibold mb-3 rate-card-title">
          {{ parameterSettings["Kurs - Exchange Rate - Title"] }}
        </h3>
        <table class="table text-start">
          <thead>
            <tr class="fw-bold">
              <th class="text-secondary ps-0">
                {{ $t("page.home.rate.exchangeRate.currency") }}
              </th>
              <th class="text-secondary ps-0">{{ $t("page.home.rate.exchangeRate.buy") }}</th>
              <th class="text-secondary ps-0">{{ $t("page.home.rate.exchangeRate.sell") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(currency, index) in currenciesList" :key="index">
              <td class="fw-medium ps-0 d-flex align-items-center column-gap-1">
                <img
                  :alt="currency.fullName"
                  class="currency-flag me-3 img-fluid"
                  :src="`/icons/flags/${currency.flag}`"
                />
                <span class="d-inline-block">
                  {{ currency.name }}
                </span>
              </td>
              <td class="fw-bold ps-0">{{ formatExchangeRate(currency.buy) }}</td>
              <td class="fw-bold ps-0">{{ formatExchangeRate(currency.sell) }}</td>
            </tr>
          </tbody>
        </table>

        <small class="mt-3 footer-text">
          <span class="fw-medium">
            {{ $t("page.home.rate.updatedAt") }}{{ " " }}
          </span>
          <span class="fw-bold">
            {{
              getFullDateTimeFormat(
                new Date(CurrenciesLastUpdatedAt || new Date()),
                { locale } as DateOptions
              )
            }}
            WIB
          </span>
        </small>
      </div>
    </div>

    <!-- KONVERTER -->
    <div class="col-12 col-lg-6 d-flex flex-column">
      <div
        v-if="formValue.from && formValue.to"
        class="currencies-converter h-100 d-flex flex-column justify-content-center"
      >
        <h3 class="fw-semibold mb-3 rate-card-title">
          {{ parameterSettings["Kurs - Calculator - Title"] }}
        </h3>

        <div class="my-auto">
          <span class="from-to mt-1 fw-bold d-block text-secondary mb-2"
            style="border-bottom: 1px solid #e6e6e6; padding: 5px 0">
            {{ $t("page.home.rate.exchangeRate.from") }}
          </span>
          <div class="row py-2">
            <div class="col px-1 d-flex justify-content-center align-items-center converter-country-flag">
              <img class="img-fluid" :src="`/icons/flags/${formValue.from.flag}`" />
            </div>
            <div v-if="props.currenciesRes.length" class="col-5 px-1">
              <select
                v-model="formValue.from.name"
                class="form-control"
                @change="handleCurrencyChange"
              >
                <option v-for="currency in props.currenciesRes" :key="currency.name" :value="currency.name">
                  {{ currency.name }}
                </option>
              </select>
            </div>
            <div class="px-1 col position-relative">
              <input
                v-model="formValue.fromValue"
                type="number"
                min="1"
                class="form-control ps-3"
                :placeholder="defaultPlaceholder"
                @input="handleValueChange"
              />
            </div>
          </div>

          <span class="from-to mt-1 fw-bold d-block text-secondary mb-2"
            style="border-bottom: 1px solid #e6e6e6; padding: 5px 0">
            {{ $t("page.home.rate.exchangeRate.to") }}
          </span>
          <div class="row py-2">
            <div class="col px-1 d-flex justify-content-center align-items-center converter-country-flag">
              <img class="img-fluid" :src="`/icons/flags/${formValue.to.flag}`" />
            </div>
            <div v-if="props.currenciesRes.length" class="col-5 px-1">
              <select
                v-model="formValue.to.name"
                class="form-control"
                @change="handleCurrencyChange"
              >
                <option v-for="currency in props.currenciesRes" :key="currency.name" :value="currency.name">
                  {{ currency.name }}
                </option>
              </select>
            </div>
            <div class="px-1 col position-relative">
              <input
                v-model="formValue.toValue"
                readonly
                type="text"
                class="form-control ps-3"
                :placeholder="defaultPlaceholder"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DateOptions } from "~/utils/formatDate";
import { getFullDateTimeFormat } from "~/utils/formatDate";
import { formatPrice, formatExchangeRate } from "~/utils/formatPrice";
import type { ICurrencies } from "~/types/currencies.types";
import type { ParameterSettings } from "~/types/parameter-settings.types";

const parameterSettings = inject<ParameterSettings>("parameter-settings")!;
const { t, locale } = useI18n();

const props = defineProps<{
  currenciesRes: ICurrencies[];
  CurrenciesLastUpdatedAt?: string | null; 
}>();

const currenciesList = computed(() => props.currenciesRes.filter(item => item.name !== "IDR"));
const defaultPlaceholder = ".00";

const tabs = useState(() => [
  { title: t("page.home.rate.exchangeRate.buy"), slug: "buy", active: true },
  { title: t("page.home.rate.exchangeRate.sell"), slug: "sell", active: false },
]);

const formValue = reactive({
  selected: null,
  fromValue: null,
  from: props.currenciesRes.find(item => item.name === "USD") || props.currenciesRes[0],
  to: props.currenciesRes.find(item => item.name === "IDR") || props.currenciesRes[0],
  toValue: null as null | string,
});

watch(
  () => props.currenciesRes,
  newCurrencies => {
    if (newCurrencies.length) {
      formValue.from = newCurrencies.find(item => item.name === "USD") || newCurrencies[0];
      formValue.to = newCurrencies.find(item => item.name === "IDR") || newCurrencies[0];
      handleCurrencyChange();
    }
  },
  { immediate: true }
);

function handleValueChange() {
  if (!formValue.fromValue && formValue.toValue) formValue.toValue = null;

  if (formValue.from && formValue.to && formValue.fromValue) {
    const activeType = tabs.value.find(item => item.active);
    const type = activeType ? (activeType.slug as "buy" | "sell") : "buy";

    let multiplier = formValue.from[type];
    if (formValue.to.name !== "IDR") multiplier = multiplier / formValue.to[type];

    let conversion = formatPrice(
      (Math.round(parseFloat(formValue.fromValue) * parseFloat(multiplier) * 100) / 100).toFixed(2)
    );

    if (conversion && conversion.length > 0 && conversion[conversion.length - 3] === ".") {
      const conversionSplit = conversion.split("");
      conversionSplit[conversion.length - 3] = ",";
      conversion = conversionSplit.join("");
    }

    formValue.toValue = conversion;
  }
}

function handleCurrencyChange() {
  const findCurrencyFrom = props.currenciesRes.find(cur => cur.name === formValue.from!.name);
  if (findCurrencyFrom) formValue.from = Object.assign({}, findCurrencyFrom);

  const findCurrencyTo = props.currenciesRes.find(cur => cur.name === formValue.to!.name);
  if (findCurrencyTo) formValue.to = Object.assign({}, findCurrencyTo);

  handleValueChange();
}

onMounted(() => handleCurrencyChange());

const CurrenciesLastUpdatedAt = computed(() => {
  return props.CurrenciesLastUpdatedAt || props.currenciesRes[0]?.lastUpdate || null;
});
</script>

<style lang="scss" scoped>
table td {
  padding-top: 6px;
  padding-bottom: 6px;
}
.rate-card-title {
  font-size: clamp(1rem, 3vw, 21px);
}
select,
input {
  border-radius: 40px;
  padding: 10px 12px;
  font-size: inherit;
}
input::placeholder {
  color: rgb(180, 180, 180);
}
.converter-country-flag {
  max-width: 60px;
}
.converter-country-flag > img {
  width: 35px;
}
.currencies-table-box {
  margin-bottom: 14px;
  @media screen and (min-width: $lg) {
    margin-bottom: 0;
  }
  .footer-text {
    color: #9b9b9b;
    font-size: 10px;
    @media screen and (min-width: $md) {
      font-size: 14px;
    }
  }
}
.currencies-table-box,
.currencies-converter {
  border: 2px solid #e6e6e6;
  border-radius: 16px;
  padding: 24px;
  background: #fff;
}
</style>