import type { Network, Regions } from "~/types/regions.types";

export const useRegions = async () => {
  const { apiUrl } = useRuntimeConfig().public;
  const { locale } = useI18n();
  const { data: regions, error } = await useFetch<{ data: Regions[] }>(
    `${apiUrl}/${locale.value}/networks`,
    {
      transform: input => {
        return input;
      },
    }
  );
  const activeRegion = useState(() =>
    regions.value && regions.value.data.length ? regions.value.data[0] : null
  );
  const centerCoordinate = ref<string[]>([]);

  function updateCenter(location: Network) {
    const coordinate = [location.Latitude, location.Longitude];
    document.getElementById("sidebar")?.scrollIntoView({
      behavior: "smooth",
    });
    centerCoordinate.value = coordinate;
  }
  function handleSidebarChange(selectedRegion: any) {
    activeRegion.value = {
      Id: selectedRegion.Id,
      Name: selectedRegion.Name ?? selectedRegion.name,
      Networks: selectedRegion.Networks,
    };
    updateCenter(selectedRegion.Networks[0]);
  }

  return {
    regions: computed(() => (regions.value ? regions.value.data : [])),
    activeRegion,
    centerCoordinate,
    updateCenter,
    handleSidebarChange,
    error,
  };
};
