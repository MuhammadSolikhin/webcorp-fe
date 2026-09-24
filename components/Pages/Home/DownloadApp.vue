<script setup lang="ts">
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const localePath = useLocalePath();
  const device = useDevice();
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;

  const ps = {
    title: parameterSettings["Download App - Title"],
    description: parameterSettings["Download App - Description"],
    navLinkTitle: parameterSettings["Download App - Navigation Link - Title"],
    navColor: parameterSettings["Download App - Navigation Link - Color"],
    navLink: parameterSettings["Download App - Navigation Link - Link"],
    iosLink: parameterSettings["Download App - Play Store Link"],
    androidLink: parameterSettings["Download App - Google Play Link"],
    downloadAppImage: parameterSettings["Download App - Image"],
  };
</script>

<template>
  <section class="home-page-section-padding-large">
    <div class="container">
      <div class="row align-items-center mx-auto app-download">
        <div class="col-12 col-lg-8">
          <AppTitle size="lg" color="primary" class="fw-bold mb-2" :html-content="ps.title" />
          <AppText class="mb-0" :html-content="ps.description" />
          <AppLink
            v-if="ps.navLink"
            :title="ps.navLinkTitle"
            class="text-primary d-block mb-5 mt-5"
            :style="`color: ${ps.navColor}`"
            :to="localePath(ps.navLink)"
          />
          <div class="d-flex gap-3">
            <a
              v-if="device.isIos || !device.isAndroid"
              :href="ps.iosLink"
              target="_blank"
              class="text-decoration-none"
            >
              <img class="img-fluid app-store-icon me-2 mb-2" alt="ios app" src="/icons/ios.png" />
            </a>
            <a
              v-if="device.isAndroid || !device.isIos"
              class="text-decoration-none"
              :href="ps.androidLink"
              target="_blank"
            >
              <img
                class="app-store-icon mb-2 img-fluid"
                alt="android app"
                src="/icons/android.png"
              />
            </a>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <img id="leftImage" class="img-fluid" :src="ps.downloadAppImage" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
  #leftImage {
    width: 242px;
    display: block;
    margin: auto;
    @media screen and (min-width: $lg) {
      width: 282px;
    }
  }

  .app-store-icon {
    max-height: 40px;
  }
  .app-download {
    max-width: 900px;
    flex-direction: column-reverse;
    row-gap: 2.5rem;
    @media screen and (min-width: $lg) {
      flex-direction: row;
    }
    .title {
      font-size: clamp(21px, 3vw, 40px);
    }
  }
</style>
