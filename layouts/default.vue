<template>
  <div id="app-container">
    <LoadingIndicator :ref="loadingRef" color="#CF5A27" :height="5" :throttle="100" />

    <NavDesktopNavBar />
    <NavMobileNav v-if="showMobileNav" />

    <main>
      <slot />
    </main>

    <AppScrollTopButton />
    <WhatsAppButton />
    <Footer />
  </div>
</template>

<script setup lang="ts">
  import LoadingIndicator from "~/components/Utils/LoadingIndicator";
  import AppScrollTopButton from "~/components/shared/ScrollTopButton.vue";
  import WhatsAppButton from "~/components/shared/WhatsAppButton.vue";
  import { ref, onMounted, watch } from "vue";

  const { locale } = useI18n();

  const showMobileNav = useState("showMobileNav", () => true);
  provide("showMobileNav", showMobileNav);

  useHead({
    htmlAttrs: {
      lang: locale.value,
    },
  });

  useSeoMeta({
    applicationName: "hibank",
    author: "PT Bank Hibank Indonesia",
    ogSiteName: "Hibank",
    ogLocale: "en",
    publisher: "PT Bank Hibank Indonesia",
    ogImage: "/icons/hi-bank-log-og.svg",
  });

  const device = useDevice();
  const loadingRef = ref();

  const shrinkNav = ref(false);
  provide("shrinkNav", shrinkNav);

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    shrinkNav.value = scrollTop > 300;
  }

  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  function holdTransitionOnResize() {
    document.body.classList.add("hold-transition");
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("hold-transition");
    }, 300);
  }

  function handleResize() {
    holdTransitionOnResize();
  }

  onMounted(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  });
</script>
<style>
  @media screen and (max-width: 1000px) {
    #desktop-navbar-container {
      display: none;
    }

    main {
      padding-top: 0px;
    }
  }

  @media screen and (min-width: 1000px) {
    #mobile-navbar {
      display: none;
    }

    main {
      padding-top: 112px;
    }
  }
</style>
