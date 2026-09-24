<template>
  <NuxtLayout name="default">
    <div id="wrapper" class="text-center">
      <img class="mt-5 img-fluid" src="/icons/placeholder-1.png" :alt="$t('page.notFound.title')" />
      <span class="title font-family-title">{{ errorMessage }}</span>
      <span class="description">{{ $t("page.notFound.description") }}</span>
      <button class="btn" @click="handleError">
        <AppLink to="" class="mt-2 pb-5" :title="$t('page.notFound.back')" />
      </button>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
  import { NAVData } from "~/types/nav.types";
  import { AppRes } from "~/types/utils.types";

  const props = defineProps<{
    error: { statusCode: number; message: string; description: string };
  }>();
  const localePath = useLocalePath();

  const { locale, t } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;

  const { data: navRes } = await useAsyncData<AppRes<NAVData>>(
    "navigations",
    () => {
      return $fetch(`${apiUrl}/${locale.value}/v2/navigations`);
    },
    { watch: [locale] }
  );
  const { navStore } = useNav();
  navStore.value = navRes.value ? navRes.value.data : null;
  watch(navRes, n => {
    navStore.value = n ? n.data : null;
  });

  const handleError = () => clearError({ redirect: localePath({ path: "/" }) });

  const errorMessage = computed(() => {
    if (props.error.statusCode === 404) {
      return t("page.notFound.title");
    }
    if (props.error.statusCode >= 500) {
      return t("shared.wentWrong");
    }
    return props.error.message;
  });
</script>

<style lang="scss" scoped>
  #wrapper {
    background-color: map-get($neutralColor, "01");

    @media screen and (max-width: 768px) {
      background-color: map-get($primaryColor, "10");
    }
  }

  img {
    height: 225px;
  }

  .title {
    display: block;
    color: map-get($primaryColor, "50");
    font-size: 30px;
    font-weight: bolder;
    margin-top: 30px;
  }

  .description {
    font-size: 12px;
    display: block;
  }
</style>
