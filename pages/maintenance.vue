<template>
  <div id="maintenanceWrappper" class="text-center">
    <nuxt-img class="mt-5 img-fluid" src="/icons/placeholder-1.png" alt="placeholder" />
    <span class="title font-family-title">
      {{ $t("page.maintenance.title") }}
    </span>
    <span class="description">{{ $t("page.maintenance.description") }}</span>
    <AppLink :to="localePath('/')" :title="$t('page.maintenance.back')" />
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
</script>

<style lang="scss" scoped>
  #maintenanceWrappper {
    min-height: 45vh;
  }

  img {
    height: 225px;
  }

  .title {
    display: block;
    font-size: 30px;
    font-weight: bolder;
    margin-top: 30px;
  }

  .description {
    font-size: 12px;
    display: block;
  }

  .back {
    display: block;
    color: map-get($secondaryColor, "50");
    font-weight: bold;
    font-size: 12px;
  }
</style>
