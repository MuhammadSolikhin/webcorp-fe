<script setup lang="ts">
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;
  const localePath = useLocalePath();
  const items = [1, 2, 3].map(item => ({
    [`Mengapa Hibank - [${item}] Image`]: parameterSettings[
      `Mengapa Hibank - [${item.toString()}] Image`
    ] as string,
    [`Mengapa Hibank - [${item}] Title`]: parameterSettings[
      `Mengapa Hibank - [${item}] Title`
    ] as string,
    [`Mengapa Hibank - [${item}] Description`]: parameterSettings[
      `Mengapa Hibank - [${item}] Description`
    ] as string,
  }));
</script>

<template>
  <section class="position-relative">
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute left-0"
      style="z-index: -1; top: 90%"
    /> -->
    <div class="container">
      <div class="row w-100 mx-auto">
        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
          <AppTitle :html-content="parameterSettings['Mengapa Hibank - Title']" size="xl" />
          <AppText
            :html-content="parameterSettings['Mengapa Hibank - Description']"
            size="md"
            color="dark-gray"
            class="fw-medium"
          />
        </div>
        <div class="col-12 col-lg-8 row row-cols-1 row-cols-lg-3">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="d-flex align-items-center flex-column hibank-card col"
          >
            <NuxtImg
              :src="parameterSettings[`Mengapa Hibank - [${i + 1}] Image`]"
              class="hibank-card__image"
            />
            <div class="hibank-card__body d-flex flex-column">
              <h5
                class="hibank-card__title"
                v-html="parameterSettings[`Mengapa Hibank - [${i + 1}] Title`] || ''"
              ></h5>
              <p
                class="hibank-card__text fw-medium"
                v-html="parameterSettings[`Mengapa Hibank - [${i + 1}] Description`] || ''"
              ></p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center button-container">
        <AppButton size="xl" :to="localePath(parameterSettings['Mengapa Hibank - Button - Link'])">
          {{ parameterSettings["Mengapa Hibank - Button - Text"] }}
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  section {
    padding-top: 36px;
    padding-bottom: 36px;
    @media screen and (min-width: $md) {
      padding-top: 64px;
      padding-bottom: 64px;
    }
    @media screen and (min-width: $lg) {
      padding-top: 100px;
      padding-bottom: 100px;
    }
  }
  .hibank-card {
    max-width: 400px;
    margin: auto;
    gap: 24px;
    text-align: center;
    @media screen and (max-width: $lg) {
      &:nth-child(2) {
        padding-top: 62px;
        padding-bottom: 62px;
        position: relative;
        &::after,
        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 1px;
          background: #e6e6e6;
          left: 0;
        }
        &::after {
          top: 36px;
        }
        &::before {
          bottom: 36px;
        }
      }
    }
    @media screen and (min-width: $lg) {
      text-align: start;
    }
    &__body {
      gap: 16px;
      @media screen and (min-width: $lg) {
        gap: 24px;
      }
    }
    &__image {
      width: 143px;
      height: 140px;
      @media screen and (min-width: $md) {
        width: 180px;
        height: 170px;
      }
      @media screen and (min-width: 1100px) {
        width: 200px;
        height: 190px;
      }
      @media screen and (min-width: 1400px) {
        width: 240px;
        height: 230px;
      }
    }
    &__title {
      font-size: 18px;
      font-weight: 700;
      @media screen and (min-width: $md) {
        font-weight: 600;
      }
    }
    &__text {
      font-size: 14px;
    }
  }
  .button-container {
    margin-top: 24px;
    @media screen and (min-width: $md) {
      margin-top: 36px;
    }
    @media screen and (min-width: $lg) {
      margin-top: 64px;
    }
  }
</style>
