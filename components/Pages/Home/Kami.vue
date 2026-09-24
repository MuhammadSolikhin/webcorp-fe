<template>
  <section class="home-page-section-padding">
    <div class="container">
      <div class="row w-100 mx-auto align-items-center">
        <div class="d-flex row-gap-3 flex-column col-12 col-lg-6">
          <AppText class="fw-semibold" size="md-extend" :html-content="ps.description" />
          <AppTitle size="lg" :html-content="ps.title" />
        </div>
        <div class="col-12 col-lg-6">
          <NuxtImg class="d-block mx-auto" :src="ps.image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;

  const ps = {
    description: parameterSettings["Kami Adalah Hibank - Description"],
    title: parameterSettings["Kami Adalah Hibank - Title"]?.split(",")?.join(",<br />") || "",
    image: parameterSettings["Kami Adalah Hibank - Image"],
  };
</script>
<style lang="scss" scoped>
  img {
    width: 65vw;
    max-width: 300px;
    @media screen and (min-width: $lg) {
      width: 50vw;
      max-width: 400px;
    }
  }
</style>
