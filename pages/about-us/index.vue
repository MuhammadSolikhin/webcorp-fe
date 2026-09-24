<template>
  <section class="about-us-page home-page-section-padding pb-0">
    <div class="container">
      <div class="about-us-top-content text-center">
        <AppText
          class="mb-4 fw-bolder"
          size="xl"
          color="dark"
          :html-content="parameterSettings['About Us - Top Section - First Line']"
        />
        <AppTitle
          size="md"
          class="fw-bolder"
          :html-content="parameterSettings['About Us - Top Section - Second Line']"
        />
        <AppText
          class="about-us-page__subtitle"
          color="dark-gray"
          :html-content="parameterSettings['About Us - Top Section - Third Line']"
        />
        <div class="text-center about-us-page__cta">
          <AppButton
            height="large"
            size="lg"
            :color-class="
              parameterSettings['About Us - Top Section - Button Class Name'] ||
              'button-primary-fill'
            "
            @click="scrollToNextSection"
          >
            {{ parameterSettings["About Us - Top Section - Button Title"] }}
            <i class="bx bx-down-arrow-alt"></i>
          </AppButton>
        </div>
      </div>
    </div>
    <div class="position-relative bg-primary curve-shape-container overflow-x-hidden">
      <div class="curve-shape position-absolute"></div>
    </div>
  </section>
  <section id="our-vision" class="bg-primary position-relative">
    <img src="/icons/dark-circle.svg" class="position-absolute top-0 end-0 d-block d-md-none" />
    <img
      src="/icons/4-dot-dark-circle-right.svg"
      class="position-absolute top-0 end-0 d-none d-md-block dot-dark-circle"
    />
    <div class="container">
      <div
        class="row our-vision__content w-100 mx-auto text-white position-relative align-items-center home-page-section-padding"
      >
        <div class="col-7">
          <AppText
            size="lg"
            color="white"
            class="mb-2"
            :html-content="parameterSettings['About Us - Vision - Small Title']"
          />
          <AppTitle
            size="sm"
            color="white"
            :html-content="parameterSettings['About Us - Vision - Jumbo Title']"
          />
        </div>
        <div class="col-5">
          <img
            class="d-block w-100 our-vision__img"
            :src="parameterSettings['About Us - Vision - Image']"
          />
        </div>
      </div>
    </div>
  </section>
  <section id="our-mission" class="bg-primary position-relative home-page-section-padding">
    <img
      src="/icons/dark-circle-left.svg"
      class="position-absolute top-0 start-0 d-block d-md-none"
      style="transform: translateY(-10%)"
    />
    <img
      src="/icons/4-dot-dark-circle-left.svg"
      class="position-absolute top-0 start-0 d-none d-md-block dot-dark-circle"
      style="transform: translateY(-10%)"
    />
    <div class="container">
      <AppText
        size="lg"
        color="white"
        class="text-center"
        :html-content="parameterSettings['About Us - Mission - Title']"
      />
      <NuxtImg
        class="img-fluid"
        :src="
          isMobile
            ? parameterSettings['About Us - Mission - Image Mobile']
            : parameterSettings['About Us - Mission - Image Desktop']
        "
      />
    </div>
  </section>
  <section id="corporate-value" class="bg-primary position-relative home-page-section-padding">
    <img
      src="/icons/dark-circle.svg"
      class="position-absolute top-0 end-0 d-block d-md-none"
      style="transform: translateY(-30px)"
    />
    <img
      src="/icons/4-dot-dark-circle-right.svg"
      class="position-absolute top-0 end-0 d-none d-md-block dot-dark-circle"
      style="transform: translateY(-30px)"
    />
    <div class="container text-white">
      <AppTitle
        class="mb-3"
        size="sm"
        color="white"
        :html-content="parameterSettings['About Us - Company Values - Title']"
      />
      <AppText
        size="lg"
        color="white"
        class="fw-medium"
        :html-content="parameterSettings['About Us - Company Values - Description']"
      />
      <NuxtImg
        class="img-fluid"
        :src="
          isMobile
            ? parameterSettings['About Us - Company Values - Image Mobile']
            : parameterSettings['About Us - Company Values - Image Desktop']
        "
      />
    </div>
  </section>
  <section id="company-history" class="home-page-section-padding">
    <div class="container">
      <AppTitle
        size="es"
        color="secondary"
        class="fw-bold mb-4"
        :html-content="parameterSettings['About Us - Company History - Title']"
      />
      <AppText
        v-for="(par, i) in (
          parameterSettings['About Us - Company History - Description'] || ''
        ).split('\n')"
        :key="i"
        class="mb-4"
        size="md"
        :html-content="par"
      />
      <NuxtImg
        class="img-fluid mt-4"
        :src="
          isMobile
            ? parameterSettings['About Us - Journey - Image Mobile']
            : parameterSettings['About Us - Journey - Image Desktop']
        "
      />
    </div>
  </section>
  <AboutUsManagementSection />
  <section id="journey" class="home-page-section-padding">
    <div class="container">
      <div class="row w-100 mx-auto journey-card-container">
        <div class="col-12 col-md-6 journey-card-container-col">
          <div class="row w-100 mx-auto journey-card card-item-1 justify-content-between h-100">
            <div class="col-9 d-flex flex-column">
              <AppTitle
                size="es"
                color="dark"
                class="mt-2 mb-4 fw-bolder"
                :html-content="parameterSettings['About Us - Left Card - Title']"
              />
              <AppText
                size="md"
                color="dark"
                class="fw-semibold mt-auto"
                :html-content="parameterSettings['About Us - Left Card - Description']"
              />
            </div>
            <div class="col-2 display-5 pt-1 text-primary text-end card-link">
              <NuxtLink
                :to="localePath(parameterSettings['About Us - Left Card - Path'])"
                class="text-description-none"
              >
                <i class="bx bx-right-arrow-alt"></i>
              </NuxtLink>
            </div>
            <NuxtImg :src="imageUrl3DCasual" />
          </div>
        </div>
        <div class="col-12 col-md-6 journey-card-container-col">
          <div class="row w-100 mx-auto journey-card card-item-2 justify-content-between h-100">
            <div class="col-9 d-flex flex-column">
              <AppTitle
                size="es"
                color="dark"
                class="mt-2 mb-4 fw-bolder"
                :html-content="parameterSettings['About Us - Right Card - Title']"
              />
              <AppText
                size="md"
                color="dark"
                class="fw-semibold mt-auto"
                :html-content="parameterSettings['About Us - Right Card - Description']"
              />
            </div>
            <div class="col-2 display-5 pt-1 text-primary text-end card-link">
              <NuxtLink
                :to="localePath(parameterSettings['About Us - Right Card - Path'])"
                class="text-description-none"
              >
                <i class="bx bx-right-arrow-alt"></i>
              </NuxtLink>
            </div>
            <NuxtImg :src="imageUrlCasual" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { ParameterSettings } from "types/parameter-settings.types";
  import { AppRes } from "types/utils.types";
  const isMobile = inject<boolean>("isMobile");
  const { t } = useI18n();
  const localePath = useLocalePath();

  const config = useRuntimeConfig();
  const { assetUrl } = config.public;

  const imageUrl3DCasual = computed(() => {
    return `${assetUrl}/uploads/Media/AboutUs/3d-casual-life-documents-with-diagram-and-pen.png`;
  });

  const imageUrlCasual = computed(() => {
    return `${assetUrl}/uploads/Media/AboutUs/casual-life-3d-retro-phone-and-smartphone-flying-removebg-preview.png`;
  });

  const { data: parameterSettingsRes, error: parameterSettingsError } = await useAPI<
    AppRes<ParameterSettings>
  >("parameter-settings");
  if (!parameterSettingsRes.value || parameterSettingsError.value) {
    throw createError("unable to load page. try again");
  }
  const parameterSettings = computed(() =>
    parameterSettingsRes.value ? parameterSettingsRes.value.data : ({} as ParameterSettings)
  );
  provide("parameterSettings", parameterSettings.value);
  useAppSeo({
    title: t("page.aboutUs.title"),
    description: parameterSettings.value["About Us - Top Section - Second Line"],
    ogTitle: t("page.aboutUs.title"),
    ogDescription: parameterSettings.value["About Us - Top Section - Second Line"],
    ogUrl: localePath("/about-us"),
  });

  function scrollToNextSection() {
    const offsetTop = (document.querySelector("#our-vision") as HTMLButtonElement).offsetTop;
    window.scrollTo({
      top: offsetTop - 80,
    });
  }
</script>

<style lang="scss" scoped>
  .card-link {
    z-index: 999;
  }
  .dot-dark-circle {
    width: 6vw;
  }
  .about-us-page {
    &__subtitle {
      margin-top: 1rem;
      font-size: clamp(12px, 3vw, 18px);
    }
    &__cta {
      margin-top: 3rem;
      i {
        font-size: clamp(22px, 1.8vw, 28px);
      }
    }
    .curve-shape-container {
      height: 100px;
      margin-top: -68px;
      z-index: -1;
      .curve-shape {
        top: -2px;
        border-bottom-left-radius: 50% 50px;
        border-bottom-right-radius: 50% 50px;
        width: 110%;
        overflow: hidden;
        background: white;
        height: 100px;
        left: 50%;
        transform: translateX(-50%);
      }
      @media screen and (min-width: $md) {
        height: 156px;
        margin-top: -80px;
        .curve-shape {
          border-bottom-left-radius: 50% 102px;
          border-bottom-right-radius: 50% 102px;
          width: 105%;
          height: 150px;
        }
      }
      @media screen and (min-width: $lg) {
        height: 200px;
        .curve-shape {
          border-bottom-left-radius: 50% 150px;
          border-bottom-right-radius: 50% 150px;
          width: 110%;
          height: 150px;
        }
      }
    }
  }
  #our-vision {
    .our-vision {
      &__content {
        @media screen and (min-width: $lg) {
          max-width: 80%;
          margin: auto;
        }
      }
      &__img {
        transform: scale(1.3);
        @media screen and (min-width: $md) {
          transform: scale(1.2);
        }
        @media screen and (min-width: $lg) {
          transform: scale(1.3);
        }
      }
    }
  }
  #company-history {
    background: #e9f7fa;
  }
  .journey-card-container {
    .journey-card-container-col {
      @media screen and (max-width: 768px) {
        padding: 0 !important;
      }
    }
    @media screen and (max-width: 768px) {
      row-gap: 30px;
    }
  }

  .journey-card {
    &.card-item-1 {
      background: #c1e0e7;
    }
    &.card-item-2 {
      background: #f1cdbc;
    }
    border-radius: 16px;
    padding: 1rem;
    position: relative;
    img {
      width: 100px;
      position: absolute;
      bottom: 0;
      right: 0;
      @media screen and (min-width: $lg) {
        width: 170px;
      }
    }
  }

  .managements-sidebarlist-container,
  .management-data-description {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: white;
      border-radius: 20px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cdcdcd; /* color of the scroll thumb */
      border-radius: 20px; /* roundness of the scroll thumb */
    }
    scrollbar-width: 8px; /* "auto" or "thin" */
    scrollbar-color: #cdcdcd white;
  }

  .managements-sidebarlist-container {
    &::-webkit-scrollbar-track {
      border: 1px solid #cdcdcd;
    }
  }
</style>
