import { ICurrencies, INAB } from "~~/types/currencies.types";

const _nabs = ref<INAB[] | null>(null);
const _error = ref<any>(null);
const _loading = ref(false);

export const useNab = () => {
  const { apiUrl } = useRuntimeConfig().public;

  const loadNab = async (force = false) => {
    if (_loading.value) return;
    if (!force && _nabs.value !== null) return;

    _loading.value = true;
    _error.value = null;

    try {
      const res = await $fetch<any[]>(`${apiUrl}/nab`);

      if (!Array.isArray(res)) {
        _nabs.value = [];
      } else {
        _nabs.value = res.map((item: any) => ({
          idProduct: item.idProduct ?? item.ProductId,
          productCode: item.productCode ?? item.ProductCode,
          productName: item.productName ?? item.ProductName,
          idCategory: (item.idCategory ?? item.CategoryId ?? "").trim(),
          category: (item.category ?? item.Category ?? "").trim(),
          ytd: item.ytd ?? item.YTD,
          oneYear: item.oneYear ?? item.OneYear,
          sixMonth: item.sixMonth ?? item.SixMonth,
          threeMonth: item.threeMonth ?? item.ThreeMonth,
          oneMonth: item.oneMonth ?? item.OneMonth,
          oneWeek: item.oneWeek ?? item.OneWeek,
          nabUnit: item.nabUnit ?? item.NABUnit,
          lastUpdate: item.lastUpdate ?? item.LastUpdate,
        }));
      }
    } catch (err) {
      _error.value = err;
      _nabs.value = [];
    } finally {
      _loading.value = false;
    }
  };

  const NABByCategory = computed(() => {
    if (!_nabs.value) return [];

    return _nabs.value.filter(
      (v, i, a) => a.findIndex(v2 => v2.category === v.category) === i
    );
  });

  const NABLastUpdatedAt = computed(() =>
    _nabs.value?.length ? _nabs.value[0].lastUpdate : null
  );

  //   ⬇️ API tetap sama persis
  return {
    nabs: _nabs,
    NABByCategory,
    NABLastUpdatedAt,
    error: _error,
    loadNab,
    loading: _loading,
  };
};



export const useCurrencies = async () => {
  const { apiUrl } = useRuntimeConfig().public;

  const { data: currenciesRes, error } = await useFetch<ICurrencies[]>(`${apiUrl}/currencies`, {
    transform: data => {
      if (!Array.isArray(data)) return [];

      const lastUpdate = data[0]?.lastUpdate || null;

      // Tambah IDR di akhir agar tetap konsisten dengan FE lama
      return data.concat({
        fullName: "Indonesian Rupiah",
        flag: "id.svg",
        name: "IDR",
        buy: 1,
        sell: 1,
        lastUpdate,
      });
    },
  });

  const firstHalfCurrencies = computed(() =>
    currenciesRes.value ? currenciesRes.value.slice(0, currenciesRes.value.length / 2) : []
  );

  const secondHalfCurrencies = computed(() =>
    currenciesRes.value
      ? currenciesRes.value.slice(currenciesRes.value.length / 2, currenciesRes.value.length)
      : []
  );

  // Ambil waktu update terakhir dari data BE
  const CurrenciesLastUpdatedAt = computed(() =>
    currenciesRes.value?.length ? currenciesRes.value[0].lastUpdate : null
  );

  return {
    currenciesRes,
    firstHalfCurrencies,
    secondHalfCurrencies,
    CurrenciesLastUpdatedAt, 
    error,
  };
};