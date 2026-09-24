<script setup lang="ts">
import { BreadcrumbLink } from "~/components/Blog/Breadcrumb.vue";
import { ref, computed, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    backgroundImage: string;
    backgroundImageMobile?: string;
    links?: BreadcrumbLink[];
    bannerTitle?: string;
    bannerText?: string;
  }>(),
  {
    links: () => [] as BreadcrumbLink[],
    bannerText: "",
    bannerTitle: "",
  }
);


const width = ref(0);
let resizeHandler: any = null;

if (process.client) {
  width.value = window.innerWidth;

  resizeHandler = () => {
    width.value = window.innerWidth;
  };

  window.addEventListener("resize", resizeHandler);
}

onUnmounted(() => {
  if (process.client && resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
});

const isMobile = computed(() => width.value <= 768);
</script>

<template>
  <section
    class="hero-section text-light"
    :style="`background: url('${isMobile && props.backgroundImageMobile ? props.backgroundImageMobile : props.backgroundImage}') center/cover`"
  >
    <div class="container d-flex flex-column h-100">
      <BlogBreadcrumb v-if="props.links.length" :links="props.links" color="white" />
      <div class="hero-section__title">
        <h2 class="text-white title-xl mb-3" v-html="props.bannerTitle || ''"></h2>
        <p class="mt-3 text-xl text-white" v-html="props.bannerText || ''"></p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-section {
  height: 60vh;
  padding-top: 36px;

  @media screen and (min-width: $md) {
    padding-top: 20px;

    &__title {
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
  }

  @media screen and (min-width: $lg) {
    height: 69vh;
    max-height: 660px;
  }

  &__title {
    margin-top: 20px;
  }
}
</style>