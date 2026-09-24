<script setup lang="ts">
  import { ParameterSettings } from "types/parameter-settings.types";
  import { AppRes } from "types/utils.types";

  const { t } = useI18n();

  useAppSeo({
    title: t("navigation.home"),
    description: "Digital First Bank",
    ogTitle: "HiBank | " + t("navigation.home"),
    ogDescription: "Digital First Bank",
    ogImage: "/icons/hi-bank-log-og.svg",
    ogUrl: "",
  });

  const { data: parameterSettings, error } = await useAPI<AppRes<ParameterSettings>>(
    "parameter-settings"
  );

  if (!parameterSettings.value || error.value) {
    throw createError("Something went wrong. try again!");
  }
  provide("parameter-settings", parameterSettings.value.data);
</script>
<template>
  <HomePopup />
  <HomeHero />
  <HomeMSME />
  <HomeKami />
  <HomeVision />
  <HomeWhyHibank />
  <HomeService />
  <HomeHighlights />
  <HomeRate />
  <HomeDownloadApp />
  <HomeCompanyGroup />
</template>
