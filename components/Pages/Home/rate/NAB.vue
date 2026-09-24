<template>
  <div class="justify-content-center row column-gap-4">
    <div v-if="nabByCategory.length" class="row mb-3 col-12 col-lg-6">
      <table class="table fw-bold">
        <thead class="text-center fw-bold">
          <tr>
            <th colspan="2" class="bg-transparent border-0">
              {{ $t("page.home.rate.nabAndPrimeLendingRate.nab.title") }}
            </th>
          </tr>
        </thead>
        <tbody class="d-flex flex-column row-gap-2 mt-2">
          <tr
            v-for="(nab, index) in props.nabByCategory"
            :key="index"
            class="text-size d-flex justify-content-between align-items-center"
            :style="`padding: 16px 24px; background: ${
              index % 2 === 0 ? '#C1E0E7' : '#FFF'
            }; border-radius: 12px;`"
          >
            <td class="text-start bg-transparent fw-medium">{{ nab.category }}</td>
            <td width="125px" class="bg-transparent text-end">
              <AppLink :to="localePath('/nab')" :title="$t('shared.see')" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="row mb-3 col-12 col-lg-6">
      <table class="table fw-bold">
        <thead class="text-center fw-bold">
          <tr>
            <th colspan="2" class="bg-transparent border-0">
              {{ $t("page.home.rate.nabAndPrimeLendingRate.primeLendingRate.title") }}
            </th>
          </tr>
        </thead>
        <tbody class="d-flex flex-column row-gap-2 mt-2">
          <tr
            v-for="(primeLendingRate, index) in props.primeLendingRates"
            :key="index"
            class="text-size d-flex justify-content-between align-items-center"
            :style="`padding: 16px 24px; background: ${
              index % 2 === 0 ? '#F1CDBC' : '#FFF'
            }; border-radius: 12px;`"
          >
            <td class="text-start bg-transparent fw-medium">{{ primeLendingRate.Name }}</td>
            <td width="125px" class="bg-transparent text-end">
              {{ primeLendingRate.Percentage }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import { INAB, PrimeLendingRate } from "~/types/currencies.types";
  const localePath = useLocalePath();
  const props = defineProps<{
    primeLendingRates: PrimeLendingRate[];
    nabByCategory: INAB[];
  }>();
</script>
