<template>
  <div id="map"></div>
</template>
<script setup lang="ts">
  import * as L from "leaflet";
  import type { Network } from "~/types/regions.types";

  const { t } = useI18n();

  const props = defineProps<{
    centerCoordinate: string[];
    locations: Network[];
  }>();

  const map = ref<L.Map | null>(null);

  function setMap(center: number[], locations: Network[]) {
    if (map.value) map.value.remove();
    // @ts-ignore
    const leafletMap = L.map("map", { zoom: 13, center });
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap);
    locations.forEach(location => {
      const marker = L.marker([+location.Latitude, +location.Longitude]).addTo(leafletMap);
      marker.bindPopup(`
          <div class='text-center'>
            <p class="fw-bold">${location.Name}</p>
            <p></p>
            <p>${location.Address}</p>
            <a class="btn btn-sm primary-btn" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${
              location.Latitude
            },${location.Longitude}">
               ${t("page.location.map")}  
            </a>
          </div>
      `);
    });
    map.value = leafletMap;
  }
  onMounted(() => {
    setMap(
      props.centerCoordinate.map(item => +item),
      props.locations
    );
  });

  watch([() => props.centerCoordinate, () => props.locations], ([c, l]) => {
    setMap(
      c.map(item => +item),
      l
    );
  });

  onBeforeUnmount(() => {
    if (map.value) {
      map.value.remove();
    }
  });
</script>

<style scoped>
  #map {
    height: 400px;
    z-index: 2;
  }
</style>
