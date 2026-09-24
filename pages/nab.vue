<template>
  <div class="pt-3 pb-5">
    <div class="container">
      <h3 class="title font-family-title">{{ $t("page.nab.title") }}</h3>
      <hr />

      <span
        class="d-block"
        v-html="parameterSettings['Kurs - NAB - Title'] || ''"
      ></span>
      <span
        class="d-block"
        v-html="parameterSettings['NAB - NAB Information'] || ''"
      ></span>

      <!-- LOADING -->
      <div v-if="loading" class="my-3">
        Loading NAB...
      </div>

      <!-- CONTENT -->
      <div v-else>
        <div v-for="(category, index) in NABByCategory" :key="index">
          <p class="secondary-color fw-bold mb-0 mt-4 mb-3 font-family-title">
            {{ category.category }}
          </p>

          <template v-if="nabs">
            <div v-for="(nabItem, nabIndex) in nabs" :key="nabIndex">
              <div
                v-if="nabItem.category.trim() === category.category.trim()"
              >
                <h5 class="primary-color d-block fw-bold font-family-title">
                  {{ nabItem.productName }}
                </h5>

                <span class="d-block font-family-title">
                  NAB/Unit: Rp. {{ formatPrice(nabItem.nabUnit!) }}
                </span>

                <table class="theme-table table-primary-striped">
                  <thead>
                    <tr>
                      <th>{{ $t("page.nab.yearToDate") }}</th>
                      <th>{{ $t("page.nab.oneYear") }}</th>
                      <th>{{ $t("page.nab.sixMonths") }}</th>
                      <th>{{ $t("page.nab.threeMonths") }}</th>
                      <th>{{ $t("page.nab.oneMonth") }}</th>
                      <th>{{ $t("page.nab.oneWeek") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="font-family-title">
                      <td>{{ nabItem.ytd }}%</td>
                      <td>{{ nabItem.oneYear ?? "-" }}%</td>
                      <td>{{ nabItem.sixMonth ?? "-" }}%</td>
                      <td>{{ nabItem.threeMonth ?? "-" }}%</td>
                      <td>{{ nabItem.oneMonth ?? "-" }}%</td>
                      <td>{{ nabItem.oneWeek ?? "-" }}%</td>
                    </tr>
                  </tbody>
                </table>

                <span class="d-block mb-4 font-family-title">
                  {{ $t("page.nab.lastUpdate") }}: {{ nabItem.lastUpdate }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <hr />

      <div style="font-size: 10px">
        <p class="mb-0">Informasi lebih lanjut, hubungi:</p>
        <p class="mb-0"><b>Corporate & Marketing Communication</b></p>
        <p class="mb-0">Kantor Pusat</p>
        <p class="mb-0">Rajawali Place, Lantai 22-23</p>
        <p class="mb-0">Jl. H.R. Rasuna Said Kav. B.4</p>
        <p class="mb-0">Setiabudi, Jakarta Selatan - 12910</p>
        <p class="mb-0">Telp. : 021-56966954</p>
        <p class="mb-0">Email : customercare@hibank.co.id</p>
      </div>

      <ClientOnly>
        <AppSocialMediaSharer />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ParameterSettings } from "~/types/parameter-settings.types";
import { formatPrice } from "~/utils/formatPrice";

const { t } = useI18n();
const localePath = useLocalePath();

useAppSeo({
  title: t("page.nab.title"),
  ogTitle: t("page.nab.title"),
  ogUrl: localePath("/nab"),
});

// === LAZY NAB DATA ===
const {
  nabs,
  NABByCategory,
  NABLastUpdatedAt,
  error,
  loadNab,
  loading
} = useNab();

onMounted(() => {
  loadNab();
});

watch(error, (v) => {
  if (v) {
    throw createError("fail to load NAB");
  }
});

const parameterSettings = inject<ParameterSettings>(
  "parameter-settings",
  {} as ParameterSettings
);
</script>

<style lang="scss" scoped>
.title {
  display: block;
  font-weight: bold;
  margin-bottom: 0;
  color: map-get($neutralColor, "10");
}

.share {
  font-size: 0.7rem;
  display: block;
  color: map-get($primaryColor, "50");
}

.social-media-icon {
  padding-right: 10px;
  font-size: 10px;
}
</style>