<script setup lang="ts">
  import type { AppRes } from "~/types/utils.types";
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;

  const localePath = useLocalePath();
  interface Service {
    Id: number;
    Title: string;
    Slug: string;
    Description: string;
    Image: string;
    BackgroundColor: string;
    ComingSoon: number;
  }
  const { data: services } = await useAPI<AppRes<Service[]>>("pages");
</script>
<template>
  <section class="position-relative service-section overflow-hidden">
    <!-- <NuxtImg
      src="/icons/two-tone-circle.svg"
      class="position-absolute"
      style="right: -30px; bottom: -30px; z-index: -1"
    /> -->
    <div class="container">
      <AppTitle
        class="text-center"
        size="lg"
        :html-content="parameterSettings['Layanan Kami - Title']"
      />
      <div v-if="services && services.data.length" class="service-section__card-container">
        <div class="d-block d-lg-none">
          <Swiper
            :slides-per-view="'auto'"
            :space-between="10"
            :modules="[SwiperPagination]"
            class="mySwiper"
            :free-mode="false"
            :draggable="true"
            :grab-cursor="true"
            :pagination="{
              el: '.services-swiper-pagination',
              type: 'bullets',
              clickable: true,
            }"
          >
            <SwiperSlide v-for="service in services.data" :key="service.Id" style="width: 254px">
              <div class="card overflow-hidden service__card">
                <div
                  v-if="service.ComingSoon === 1"
                  class="position-absolute left-0 px-4 py-2 fw-bold rounded-5 coming-soon"
                >
                  {{ $t("page.home.comingSoon") }}
                </div>
                <NuxtImg :src="service.Image" class="card-img-top w-100 d-block" alt="..." />
                <div class="card-body">
                  <h5 class="card-title fw-bold">
                    <NuxtLink
                      :to="service.ComingSoon !== 1 ? localePath('/' + service.Slug) : ''"
                      class="text-decoration-none"
                    >
                      {{ service.Title }}
                    </NuxtLink>
                  </h5>
                  <p class="card-text fw-medium" v-html="service.Description"></p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div class="services-swiper-pagination mt-3"></div>
        </div>
        <div class="d-none d-lg-block">
          <div class="row row-cols-lg-4 justify-content-center">
            <div v-for="service in services.data" :key="service.Id" class="col mb-4">
              <div class="card overflow-hidden p-0 h-100">
                <div
                  v-if="service.ComingSoon === 1"
                  class="position-absolute left-0 fw-bold rounded-5 coming-soon"
                >
                  {{ $t("page.home.comingSoon") }}
                </div>
                <NuxtImg :src="service.Image" class="card-img-top w-100 d-block" alt="..." />
                <div class="card-body">
                  <h5 class="card-title fw-bold">
                    <NuxtLink
                      :to="service.ComingSoon !== 1 ? localePath('/' + service.Slug) : ''"
                      class="text-decoration-none"
                    >
                      {{ service.Title }}
                    </NuxtLink>
                  </h5>
                  <p class="card-text fw-medium" v-html="service.Description"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
  .services-swiper-pagination {
    .swiper-pagination-bullet {
      height: 6px !important;
      width: 26px !important;
      border-radius: 100px !important;
      opacity: 1 !important;
      background: #e9f7fa !important;
    }
    .swiper-pagination-bullet-active {
      background: $primary !important;
      opacity: 1 !important;
    }
  }
  .service-section {
    padding-top: 36px;
    padding-bottom: 36px;
    @media screen and (min-width: $md) {
      padding-top: 48px;
      padding-bottom: 48px;
    }
    @media screen and (min-width: $lg) {
      padding-top: 82px;
      padding-bottom: 82px;
    }
    &__card-container {
      padding: 36px 0;
    }
    .card {
      width: 254px;
      border-radius: 16px;
      border: 2px solid #e6e6e6;
      padding: 0;
      transition: box-shadow 0.8s cubic-bezier(0, 0.74, 0.47, 1.06);
      &:hover {
        box-shadow: 0px 15px 35px 0px rgba(51, 51, 51, 0.18);
      }
      @media screen and (min-width: $lg) {
        width: auto;
      }
      .card-title {
        font-size: clamp(1.2rem, 1vw, 1.5rem);
        margin-bottom: 1.2rem;
      }
      .card-body {
        font-size: 14px;
        padding: 1rem;
      }
      .card-text > p {
        margin-bottom: 0;
      }
    }
  }
  .coming-soon {
    background-color: #ed3151;
    color: #fdeaee;
    font-size: 0.8rem;
    margin-top: 16px;
    margin-left: 16px;
    padding: 8px 16px;
  }
</style>
