<template>
    <div>
      <div class="container">
        <div class="row my-5 w-100 mx-auto">
          <div cols="col-12">
            <RegisterLoanForm
              v-if="data"
              :business-type-options="data.map(item => ({ text: item.Name, value: item.Code }))"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
<script setup lang="ts">
  const { t, locale } = useI18n();
  const { apiUrl } = useRuntimeConfig().public;
  const localePath = useLocalePath();
  export interface BusinessTypes {
    Id: number;
    Code: string;
    Name: string;
  }
  const { data } = await useFetch<BusinessTypes[]>(
    `${apiUrl}/${locale.value}/business-types`
  );

  useAppSeo({
    title: t("page.registerLoan.title"),
    ogTitle: t("page.registerLoan.title"),
  });
</script>
  