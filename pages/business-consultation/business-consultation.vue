<script setup lang="ts">
  import { ParameterSettings } from "types/parameter-settings.types";
  import { AppRes } from "types/utils.types";
  const localePath = useLocalePath();

  definePageMeta({
    alias: ["/en/business-consultation", "/business-consultation"],
  });

  const isTabletPlus = inject("isTabletPlus");

  const { data: parameterSettings } = await useAPI<AppRes<ParameterSettings>>("parameter-settings");
  if (!parameterSettings.value) {
    throw createError("Something went wrong. try again!");
  }
  provide("parameter-settings", parameterSettings.value.data);

  const { links, banner, tabs, products, productRes } = await useProductMeta(
    "business-consultation/business-consultation"
  );
  useAppSeo({
    title: productRes.Title,
    ogTitle: productRes.Title,
    ogImage: banner.value.backgroundImage,
    ogUrl: localePath("/business-consultation/business-consultation"),
  });
</script>

<template>
  <div>
    <AppHero
      v-if="banner"
      :background-image="banner.backgroundImage"
      :banner-text="products[0].BannerTitle"
      :banner-title="banner.bannerTitle"
      :links="links"
    />
    <div class="bg-secondary">
      <div class="container tabs-container">
        <AppTabs
          :items="tabs"
          :active-item="'business-consultation'"
          class="text-white"
          @item-click="
            (val: string) => {
              navigateTo(localePath(`/business-consultation/${val}`));
            }
          "
        />
      </div>
    </div>
    <div class="container">
      <div class="row w-100 mx-auto" :class="isTabletPlus ? 'py-5' : 'py-4'">
        <div class="col-12 col-md-5 col-lg-4 px-0 pb-4" :class="!isTabletPlus && 'order-2'">
          <div class="d-flex flex-column gap-4">
            <h3 class="title-es text-primary fw-bold">PT hibank</h3>
            <div>
              <p class="text-secondary fw-bold mb-1">Call Center</p>
              <p class="mb-0">(021) 56966954</p>
            </div>
            <div>
              <p class="text-secondary fw-bold mb-1">E-mail</p>
              <p class="mb-0">customercare@hibank.co.id</p>
            </div>
            <div>
              <p class="text-secondary fw-bold mb-1">Kantor Pusat</p>
              <p class="mb-0">
                Jl. Tomang Raya Kav 21-23<br />
                Jakarta Barat 11440<br />
                <b>Telp.</b> (021) 5655288<br />
                <b>Fax.</b> (021) 5655277
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-7 col-lg-8 px-0">
          <div class="d-flex flex-column gap-4">
            <div>
              <AppTitle color="primary" :size="null" style="font-size: 36px" class="fw-bold mb-0">
                {{ $t("page.consultationService.formTitle") }}
              </AppTitle>
              <AppText color="dark-gray" size="lg">{{
                $t("page.consultationService.formSubTitle")
              }}</AppText>
            </div>
            <BusinessConsultationContact />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  #product-tablet-sidebar {
    .sidebar-title {
      font-weight: bold;
      color: $dark-gray;
    }
  }
</style>

<style lang="scss">
  .tabs-container {
    @media screen and (min-width: $lg) {
      display: flex;
      justify-content: center;
    }
  }
</style>

<style lang="scss" scoped>
  #product-page-content {
    .sidebar-title {
      font-weight: bold;
      color: $dark-gray;
    }
    a {
      color: map-get($secondaryColor, "50");
    }

    a:hover {
      font-weight: bold;
    }
  }
</style>
