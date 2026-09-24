<script setup lang="ts">
  import { AppRes } from "types/utils.types";
  import GuidesCard from "~/components/Pages/Guides/GuidesCard.vue";

  const { t } = useI18n();
  const localePath = useLocalePath();

  const route = useRoute("about-us-guides-slug");

  interface Step {
    Id: number;
    Content: string;
  }
  interface Guide {
    Id: number;
    Image: string;
    Title: string;
    Question: string;
    Description: string;
    Slug: string;
    Steps?: Step[];
    Group: {
      Title: string;
      Slug: string;
    };
  }
  interface GuideRes {
    guide: Guide;
    recommendedGuides: Guide[];
  }

  const { data: guideRes } = await useAPI<AppRes<GuideRes>>(`guides/${route.params.slug}`);

  if (!guideRes.value) {
    throw createError("guide not found");
  }
  useAppSeo({
    title: t("page.guides.title") + " - " + guideRes.value.data.guide.Title,
    description: guideRes.value.data.guide.Description,
    ogTitle: t("page.guides.title") + " - " + guideRes.value.data.guide.Title,
    ogUrl: localePath(`/about-us/guides/${guideRes.value.data.guide.Slug}`),
  });

  const links = computed(() => [
    { title: t("page.aboutUs.aboutUs.title"), to: localePath("/about-us") },
    { title: t("page.guides.title"), to: localePath("/about-us/guides") },
    {
      title: guideRes.value!.data.guide.Group.Title,
      to: localePath(`/about-us/guides/groups/${guideRes.value!.data.guide.Group.Slug}`),
    },
    {
      title: guideRes.value!.data.guide.Title,
      to: localePath(`/about-us/guides/${route.params.slug}`),
    },
  ]);

  const { guide, recommendedGuides } = guideRes.value.data;
</script>

<template>
  <section class="guides-section">
    <div class="container">
      <div class="breadcrumb-container">
        <BlogBreadcrumb :links="links" color="dark" />
      </div>
      <div class="guide__container">
        <div class="guide d-flex flex-column-reverse flex-lg-row align-items-start">
          <div class="guide__image">
            <NuxtImg :src="guide.Image" />
          </div>
          <div class="guide__content d-flex flex-column align-items-start">
            <h1 class="fw-bold guide__content--title">{{ guide.Title }}</h1>
            <div
              v-for="(step, index) in guide.Steps"
              :key="step.Id"
              class="guide__step d-flex align-items-start"
            >
              <div
                class="step__number d-flex justify-content-center align-items-center fw-bold flex-shrink-0"
              >
                {{ index + 1 }}
              </div>
              <div class="step__content flex-grow-1 fw-medium" v-html="step.Content"></div>
            </div>
          </div>
        </div>
        <div class="guide-hr">
          <hr />
        </div>
      </div>
      <div class="guide__recommended--container d-flex align-items-start flex-column">
        <div class="guide__recommended d-flex align-items-start flex-column">
          <div class="d-flex w-100">
            <h3 class="text-secondary fw-bold title-sm mb-0 flex-grow-1">
              {{ $t("page.guides.alsoReadOtherGuides") }}
            </h3>
            <AppLink
              class="text-primary fw-bold d-none d-md-flex"
              :title="$t('page.blog.alsoRead')"
              :to="
                localePath({
                  path: `/about-us/guides/groups/${guide.Group.Slug}`,
                  query: { page: 1 },
                })
              "
            />
          </div>
          <GuidesCard
            v-for="recommendedGuide in recommendedGuides"
            :key="recommendedGuide.Id"
            route-path-prefix="/about-us/guides"
            :guide="recommendedGuide"
          />
        </div>
        <AppLink
          class="button button-primary-outline w-100 fw-bold d-flex d-md-none"
          :title="$t('page.blog.alsoRead')"
          :to="localePath({ path: '/blogs/all', query: { page: 1 } })"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .guides-section .container {
    @media screen and (min-width: $lg) {
      max-width: 1000px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }
  .breadcrumb-container {
    padding: 36px 0;
  }
  .guide__container {
    @media screen and (min-width: $lg) {
      padding: 48px 0;
    }
    @media screen and (min-width: $lg) {
      padding: 64px 0;
    }
    .guide-hr {
      padding: 36px 24px;
      hr {
        width: 100%;
        height: 1px;
        background: #b4b4b4;
      }
    }
  }
  .guide {
    gap: 36px;
    &__image {
      width: 100%;
      img {
        width: 165px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      @media screen and (min-width: $lg) {
        width: 430px;
        flex-shrink: 0;
        img {
          width: 300px;
          margin-left: 0;
        }
      }
    }
    &__content {
      gap: 36px;

      &--title {
        font-size: clamp(24px, 2vw, 48px);
      }
    }
    &__step {
      gap: 8px;
      .step__number {
        width: 24px;
        height: 24px;
        border-radius: 100px;
        background: $primary;
        color: $light;
      }
      .step__content {
        color: $black;
        font-size: 12px;
        font-size: clamp(12px, 2vw, 18px);
      }
      @media screen and (min-width: $md) {
        gap: 20px;
        .step__number {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }
      }
      @media screen and (min-width: $lg) {
        gap: 36px;
        .step__number {
          width: 56px;
          height: 56px;
          font-size: 24px;
          font-weight: 700;
        }
      }
    }
  }

  .guide__recommended {
    gap: 24px;
  }
  .guide__recommended--container {
    gap: 36px;
    padding-bottom: 64px;
    @media screen and (min-width: $md) {
      padding-bottom: 96px;
    }
    @media screen and (min-width: $lg) {
      padding-bottom: 128px;
    }
  }
</style>
