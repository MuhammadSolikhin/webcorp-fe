<template>
  <div class="py-5">
    <div class="container py-0 pb-0">
      <div class="d-flex justify-content-between mb-5">
        <div class="d-flex gap-2 text-primary fw-bold">
          <span> {{ $t("page.career.navigation") }}</span>
          <span>/</span>
          <span>{{ vacancy.VacancyType.Title }}</span>
        </div>
        <AppLink :to="`/careers`" :title="$t('page.career.backToCareerPage')" />
      </div>
    </div>

    <div id="jumbotron">
      <div class="my-5 py-5 container">
        <h2 id="jumbotronTitle" class="fw-bold">{{ vacancy.Title }}</h2>
        <small>
          <img class="social-media-icon img-fluid" src="/icons/time-past.svg" alt="time past" />
          {{ $t("page.career.live", "") }}
          {{ formatDate(vacancy.CreatedAt, { locale }) }}
        </small>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8">
          <div v-if="vacancy.Requirement">
            <p>
              <b class="secondary-color font-family-title">{{ $t("page.career.requirement") }}</b>
            </p>
            <div v-html="vacancy.Requirement"></div>
          </div>
          <div v-if="vacancy.JobDescription">
            <p class="mt-3">
              <b class="secondary-color font-family-title">{{
                $t("page.career.jobDescription")
              }}</b>
            </p>
            <div v-html="vacancy.JobDescription"></div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div v-for="vacancyLink in vacancy.VacancyLinks" :key="vacancyLink.Id">
            <a
              class="w-100 py-2 text-center bg-primary text-white d-block rounded-5"
              :href="vacancyLink.Link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t("page.career.applyFrom") }} {{ vacancyLink.Title }}
            </a>
          </div>
          <ClientOnly>
            <AppSocialMediaSharer />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Vacancy } from "~/types/vacancies.types";
  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute("careers-slug");
  const { apiUrl } = useRuntimeConfig().public;

  useAppSeo({
    title: t("page.career.title"),
    ogTitle: t("page.career.title"),
    ogUrl: localePath(`/careers/${route.params.slug}`),
  });

  const { data } = await useFetch<{ data: Vacancy }>(
    `${apiUrl}/${locale.value}/vacancies/${route.params.slug}`
  );
  if (!data.value) {
    throw createError("vacancy not loaded!");
  }
  const vacancy = data.value.data;
</script>

<style lang="scss" scoped>
  #jumbotron {
    background-color: map-get($primaryColor, "50");
    color: map-get($primaryColor, "10");

    #jumbotronTitle {
      color: map-get($neutralColor, "01");
    }
  }
  a {
    text-decoration: none;
  }
  .title {
    display: block;
    font-weight: bold;
    color: map-get($primaryColor, "50");
  }

  .social-media-icon {
    padding-right: 10px;
    font-size: 10px;
  }
</style>
