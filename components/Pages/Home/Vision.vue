<script setup lang="ts">
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;
</script>

<template>
  <section class="row mx-auto">
    <div
      class="col-12 col-md-6 content-box fw-bold"
      :class="parameterSettings['Visi Hibank - Background Color'] ? '' : 'bg-secondary'"
      :style="`background: ${parameterSettings['Visi Hibank - Background Color']}`"
    >
      <div class="content-box__inner">
        <AppTitle color="white" :html-content="parameterSettings['Visi Hibank - Title']"></AppTitle>
        <AppText
          class="fw-semibold mt-3 mb-0"
          color="white"
          size="md"
          :html-content="parameterSettings['Visi Hibank - Description']"
        />
      </div>
    </div>
    <div
      class="col-12 col-md-6 image-box"
      :style="`background: url(${parameterSettings['Visi Hibank - Image']}) center 20% /cover no-repeat`"
    ></div>
  </section>
</template>

<style scoped lang="scss">
  $box-height: 170px;
  section {
    max-width: 1400px;
  }
  .content-box {
    color: white;
    text-align: center;
    padding: 2.5rem 1rem;
    min-height: $box-height;
    @media screen and (min-width: $lg) {
      padding: 100px 1rem;
    }
    h3 {
      width: 90%;
      margin: auto;
      line-height: 28px;
      font-size: 1.3rem;
      font-weight: bold;
      @media screen and (min-width: $lg) {
        font-size: clamp(1.2rem, 2vw, 28px);
        line-height: 42px;
      }
    }
    p {
      // font-size: 18px;
      line-height: 36px;
    }
    &__inner {
      max-width: 400px;
      margin: auto;
      @media screen and (min-width: $lg) {
        max-width: 500px;
      }
    }
  }
  .image-box {
    min-height: $box-height;
  }
</style>
