export function useAPI<T>(path: string) {
  const { apiUrl } = useRuntimeConfig().public;
  const { locale } = useI18n();
  return useAsyncData<T>(path, () => {
    const apiPath = path.startsWith("/") ? path.substr(1) : path;
    return $fetch(`${apiUrl}/${locale.value}/v2/${apiPath}`);
  });
}
