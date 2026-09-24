<script setup lang="ts">
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const parameterSettings = inject<ParameterSettings>(
    "parameter-settings",
    {} as ParameterSettings
  )!;

  const isMobile = inject("isMobile");

  const ps = {
    title: parameterSettings["Mengapa UMKM - Title"]?.split(" ")?.join("<br />") || "",
    description: parameterSettings["Mengapa UMKM - Description"],
    image: parameterSettings["Mengapa UMKM - Image"],
    pendukungFirstLine: parameterSettings["Ekosistem Pendukung - First Line"],
    pendukungSecondLine: parameterSettings["Ekosistem Pendukung - Second Line"],
  };
</script>

<template>
  <section class="position-relative home-page-section-padding">
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute top-0 left-0"
      style="z-index: -1"
    /> -->
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute"
      style="right: 0; bottom: -51px; transform: translateY(50%)"
    /> -->
    <div class="container">
      <div class="row justify-content-between align-items-center mengapa">
        <div class="col-12 col-lg-6">
          <div>
            <AppTitle size="xl" class="fw-bolder" :html-content="ps.title" />
            <AppText
              size="lg"
              :color="'dark-gray'"
              class="fw-medium"
              :html-content="ps.description"
            />
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div v-if="ps.image" class="mengapa-image">
            <NuxtImg :src="ps.image" class="w-100 d-block" />
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row box-container">
        <div
          v-for="item in [1, 2, 3]"
          :key="item"
          class="box-item d-flex flex-column row-gap-3 col-12 col-lg-4 position-relative z-1"
        >
          <div class="d-flex d-lg-block column-gap-2">
            <span
              class="box-item__percentage fw-bolder text-primary d-block"
              v-html="parameterSettings[`Mengapa UMKM - [${item}] Percentage`] || ''"
            ></span>
            <span
              class="box-item__title fw-bolder text-primary d-block"
              v-html="parameterSettings[`Mengapa UMKM - [${item}] Title`] || ''"
            ></span>
          </div>
          <p
            class="box-item__description mb-0 text-md"
            v-html="parameterSettings[`Mengapa UMKM - [${item}] Description`] || ''"
          ></p>
        </div>
      </div>
    </div>
  </section>
  <section class="home-page-section-padding position-relative z-3">
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute left-0"
      style="z-index: -1; top: 40%"
    /> -->
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute left-0"
      style="z-index: -1; top: 70%; right: 0px"
    /> -->
    <div class="container">
      <div class="d-flex flex-column ekosistem">
        <div>
          <AppText size="lg" class="fw-medium first-line" :html-content="ps.pendukungFirstLine" />
          <AppTitle
            size="es"
            class="second-line"
            :color="null"
            :html-content="ps.pendukungSecondLine"
          />
        </div>
        <NuxtImg
          class="d-block w-100 mx-auto"
          style="max-width: 900px"
          :src="
            isMobile
              ? parameterSettings['Ekosistem Pendukung - Image Mobile']
              : parameterSettings['Ekosistem Pendukung - Image Desktop']
          "
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .mengapa-image {
    width: 210px;
    margin: auto;
    @media screen and (min-width: $md) {
      width: 310px;
    }
    @media screen and (min-width: $md) {
      width: 356px;
    }
  }
  .box-container {
    padding: 24px;
    gap: 48px;
    max-width: 500px;
    margin: auto;
    background: #f3f3f3;
    border-radius: 24px;
    border: 1px solid #e6e6e6;
    @media screen and (min-width: $lg) {
      max-width: 100%;
      gap: 0;
      padding: 2rem 0;
    }
    .box-item {
      @media screen and (min-width: $lg) {
        padding: 0 1.3rem;
      }
    }
  }
  .box-item {
    padding: 0;
    @media (min-width: $lg) {
      padding: 0.7rem;
    }
    &:nth-child(2) {
      position: relative;
      &::before,
      &::after {
        position: absolute;
        content: "";
        display: none;
        width: 1px;
        height: 100%;
        background-color: #b4b4b4;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
      @media screen and (min-width: $lg) {
        &::after,
        &::before {
          display: block;
        }
      }
    }
    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      @media screen and (min-width: $lg) {
        font-size: clamp(1.2rem, 3vw, 1.5rem);
      }
    }
    &__percentage {
      font-size: 1.5rem;
      font-weight: 700;
      @media screen and (min-width: $lg) {
        font-size: clamp(1.4rem, 4vw, 1.8rem);
      }
    }
  }
  .ekosistem {
    gap: 36px;
    .first-line {
      text-align: start;
    }
    @media screen and (min-width: $lg) {
      .first-line {
        text-align: center;
      }
      .second-line {
        text-align: center;
      }
    }
  }
</style>
