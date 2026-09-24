import { ref } from 'vue';
import { useNab } from '~/composables/useRate';

export const useLazyNab = () => {
  const loaded = ref(false);
  const loading = ref(false);

  const nabs = ref<any[]>([]);
  const NABByCategory = ref<any[]>([]);
  const NABLastUpdatedAt = ref<string | null>(null);
  const error = ref<any>(null);

  const load = async () => {
    if (loaded.value || loading.value) return;

    loading.value = true;

    try {
      const result = await useNab();

      // assign reactive values
      nabs.value = result.nabs?.value ?? [];
      NABByCategory.value = result.NABByCategory?.value ?? [];
      NABLastUpdatedAt.value = result.NABLastUpdatedAt?.value ?? null;
      error.value = result.error?.value ?? null;

      loaded.value = true;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loaded,
    loading,
    nabs,
    NABByCategory,
    NABLastUpdatedAt,
    error,
    load,
  };
};