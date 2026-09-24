<template>
  <section>
    <template v-if="announcements && announcements.data.length">
      <Swiper
        class="bg-primary"
        :free-mode="false"
        :draggable="announcements.data.length > 1"
        :grab-cursor="announcements.data.length > 1"
        :slides-per-view="1"
      >
        <SwiperSlide v-for="announcement in announcements.data" :key="announcement.Id" class="py-3">
          <div class="container text-light d-flex align-items-center">
            <img src="/icons/Information.svg" class="d-inline-block me-2" />
            <span class="announcement">{{ announcement.Text }}</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </template>

    <div v-if="banners && banners.data.length" class="hero overflow-x-hidden">
      <div class="hero__wrapper">
        <div id="hero-carousel" class="carousel carousel-fade h-100" data-bs-ride="carousel">

          <div v-if="banners.data.length > 1" class="carousel-indicators">
            <button
              v-for="(_, i) in banners.data"
              :key="i"
              type="button"
              data-bs-target="#hero-carousel"
              :data-bs-slide-to="i"
              :class="i === 0 && 'active'"
            ></button>
          </div>

          <div class="carousel-inner h-100">
            <div
              v-for="(banner, i) in banners.data"
              :key="banner.Id"
              class="carousel-item w-100 h-100"
              :class="i === 0 && 'active'"
              data-bs-interval="500000"
            >
              <img
                :src="isMobile ? banner.ImageMobile : banner.ImageDesktop"
                class="carousel-item-bg d-block w-100 object-fit-cover position-absolute top-0 h-100"
                style="z-index: -1"
              />

              <div class="container h-100">
                <div class="d-flex align-items-md-center h-100 position-relative hero__content-container">

                  <template v-if="banners.data.length > 1">
                    <button class="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
                      <img src="/icons/chevron-right.svg" />
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
                      <img src="/icons/chevron-left.svg" />
                    </button>
                  </template>

                  <div class="hero__content d-flex flex-column">
                    <h2 v-if="banner.Title" class="hero__title text-light" v-html="banner.Title"></h2>
                    <p v-if="banner.SubTitle" class="hero__subtitle text-light fw-medium" v-html="banner.SubTitle"></p>
                    <p v-if="banner.Description" class="hero__description text-light" v-html="banner.Description"></p>

                    
                  <NuxtLink
                  v-if="banner.ButtonTo"
                  to="#"
                  class="button button-size-lg button-large bg-white text-primary hero__button"
                  @click.prevent="handleClick(banner.ButtonTo)"
                >
                  <span>{{ banner.ButtonText }}</span>
                  <span class="d-inline-flex align-items-center">
                    <i class="bx bx-chevron-right"></i>
                  </span>
                </NuxtLink>


                                
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted } from "vue";
import type { AppRes } from "~/types/utils.types";

const { locale } = useI18n();
const localePath = useLocalePath();

const router = useRouter()

function handleClick(path: string) {
  const finalPath = locale.value === 'en'
    ? `/en${path}`
    : path

  router.push(finalPath)
}

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

function isValidDomain(domain: any) {
  try {
    const url = new URL(domain.includes("://") ? domain : `https://${domain}`);
    return !!url.hostname;
  } catch {
    return false;
  }
}

interface HeroBanner {
  Id: number;
  Title: string;
  SubTitle: string;
  Description: string;
  ImageDesktop: string;
  ImageMobile: string;
  StartDate: Date;
  EndDate: Date;
  ButtonText: string;
  ButtonColor: string;
  ButtonBg: string;
  ButtonTo: string;
}

interface Announcements {
  Id: number;
  Text: string;
  StartDate: Date;
  EndDate: Date;
}

const { data: announcements } = useAPI<AppRes<Announcements[]>>("announcements");
const { data: banners } = useAPI<AppRes<HeroBanner[]>>("hero-banners");

onMounted(() => {

  if (banners?.value?.data?.length) {
    banners.value.data.forEach((b, i) => {
      console.log(
        `Banner[${i}] ButtonTo =`,
        b.ButtonTo
      );
    });
  }
});

watchEffect(() => {
  console.log("Reactive width =", width.value);
  console.log("Reactive isMobile =", isMobile.value);
});
</script>

<style scoped lang="scss">
  .hero {
     overflow: hidden;
    position: relative;
    z-index: 0;
    
    &__wrapper {
      height: 60vh;
      // min-height: 740px;
      @media screen and (min-width: 960px) {
        height: 69vh;
        height: 69svh;
      }

      @media screen and (max-width: 767.98px) {
        min-height: 360px;
      }

      @media screen and (max-width: 479.98px) {
        height: auto;
        min-height: 320px;
      }
    }

    &__content {
      @media screen and (max-width: 479.98px) {
        min-height: 480px;
      }

      @media screen and (max-width: 767.98px) {
        padding-top: 24px;

        &-container {
          margin-left: 15px;
          margin-right: 15px;
        }
      }

      @media screen and (min-width: $sm) {
        &-container {
          padding-left: 32px;
          padding-right: 32px;
        }
      }

      @media screen and (min-width: $lg) {
        &-container {
          padding-left: 48px;
          padding-right: 48px;
        }
      }
    }

    &__title,
    &__subtitle,
    &__description,
    &__button {
      opacity: 0;
      transform: translateY(32px);
      transition: all 1.5s ease;

      .active & {
        opacity: 1;
        transform: none;
      }
    }

    &__title {
      font-size: clamp(46px, 5vw, 64px);
      line-height: 100%;
      font-weight: bold;
      margin-bottom: 24px;
      transition-delay: 0.35s;

      .active & {
        transition-delay: 0.75s;
      }

      @media screen and (max-width: 991.98px) {
        margin-bottom: 16px;
      }

      @media screen and (max-width: 767.98px) {
        font-size: clamp(32px, 4vw, 48px);
        margin-bottom: 8px;
      }
    }

    &__subtitle {
      font-size: 1.3rem;
      margin-bottom: 0;
      transition-delay: 0.2s;

      ::v-deep(p) {
        margin-bottom: 0;
      }

      .active & {
        transition-delay: 0.85s;
      }

      @media screen and (min-width: $lg) {
        font-size: clamp(1.5rem, 3vw, 40px);
      }
    }

    &__description {
      font-size: 1rem;
      margin: 16px 0 0;
      transition-delay: 0.15s;

      ::v-deep(p) {
        margin-bottom: 0;
      }

      .active & {
        transition-delay: 0.95s;
      }

      @media screen and (min-width: $lg) {
        font-size: clamp(1.5rem, 2vw, 24px);
      }
    }

    &__button {
      font-size: clamp(14px, 2vw, 16px);
      margin-top: 56px;
      transition-delay: 0s;

      @media screen and (max-width: 991.98px) {
        margin-top: 40px;
      }

      @media screen and (max-width: 767.98px) {
        margin-top: 32px;
      }

      .active & {
        transition-delay: 1s;
      }
    }
  }

  .carousel-control-prev,
  .carousel-control-next {
    background-color: transparent;
    width: 32px;
    height: 32px;
    top: 50%;
    transform: translateY(-50%);

    @media screen and (min-width: $md) {
      width: 40px;
      height: 40px;
    }

    @media screen and (min-width: $lg) {
      width: 50px;
      height: 50px;
    }
  }

  .carousel-control-prev {
    left: -3%;

    @media screen and (max-width: $md) {
      left: -32px;
    }

    @media screen and (max-width: $sm) {
      left: -28px;
    }
  }

  .carousel-control-next {
    right: -3%;

    @media screen and (max-width: $md) {
      right: -32px;
    }

    @media screen and (max-width: $sm) {
      right: -28px;
    }
  }

  .carousel-control-prev img,
  .carousel-control-next img {
    width: 100%;
  }

  .announcement {
    font-size: 0.8rem;

    @media screen and (min-width: $md) {
      font-size: 1rem;
    }
  }

  .carousel-indicators {
    margin-bottom: 32px;

    @media screen and (max-width: 479.98px) {
      margin-bottom: 24px;
    }

    ::v-deep(button) {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 0;

      @media screen and (max-width: 479.98px) {
        width: 8px;
        height: 8px;
        margin-right: 5px;
        margin-left: 5px;
      }
    }
  }

  .carousel-item-bg {
    opacity: 0;
    transform: scale(1.15);
    transition: opacity 2.5s ease, transform 5s ease;

    .active & {
      opacity: 1;
      filter: none;
      transform: none;
      transition: opacity 3s ease, transform 5s ease;
      transition-delay: 0.75s;
    }
  }

  .carousel-item {
    display: block;
    opacity: 1;
  }
</style>