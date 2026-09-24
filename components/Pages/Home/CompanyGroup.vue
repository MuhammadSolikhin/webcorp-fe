<script setup lang="ts">
  import { AppRes } from "~/types/utils.types";
  import type { ParameterSettings } from "~/types/parameter-settings.types";
  const { data: companyGroup } = await useAPI<AppRes<{ Image: string }[]>>("company-groups");
  const parameterSettings = inject<ParameterSettings>("parameter-settings")!;

  const ps = {
    title: parameterSettings["Company Group - Title"],
    description: parameterSettings["Company Group - Description"],
  };
</script>

<template>
  <section class="text-center">
    <div class="container">
      <AppTitle size="lg" :html-content="ps.title" />
      <AppText size="md" class="description mx-auto" :html-content="ps.description" />
      <div v-if="companyGroup && companyGroup.data.length">
        <div class="row mx-auto mt-4" style="max-width: 900px">
          <img
            v-for="(company, index) in companyGroup?.data"
            :key="index"
            class="company-icon pe-2 img-fluid col-6 col-lg mb-4"
            :src="company.Image"
            :alt="company.Image"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  section {
    background: #f3f3f3;
    padding-top: 36px;
    padding-bottom: 36px;
  }
  .company-icon {
    height: 40px;
    @media screen and (max-width: $md) {
      height: 60px;
    }
  }
  .description {
    max-width: 550px;
    @media screen and (min-width: $lg) {
      max-width: 800px;
    }
  }
</style>
