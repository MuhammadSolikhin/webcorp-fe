<template>
  <div class="d-flex flex-column sitemap__table">
    <div class="fw-bold w-100 sitemap__table-title">
      <nuxt-link :to="tableItems && tableItems.Route ? localePath(tableItems.Route) : ''">{{
        tableText
      }}</nuxt-link>
    </div>
    <div
      v-if="tableItems && tableItems.Navigations.length"
      class="sitemap__table-items d-flex flex-wrap justify-content-between"
    >
      <div
        v-for="navItem in tableItems.Navigations"
        :key="navItem.Id"
        class="flex-grow-1 flex-shrink-0 d-flex sitemap__table-item"
        :class="tableItems.Navigations.length > 1 ? 'flex-column' : 'flex-row'"
        :style="tableItems.Navigations.length > 1 ? 'max-width: 230px' : ''"
      >
        <nuxt-link
          v-if="tableItems.Navigations.length > 1"
          :to="localePath(`${tableItems.Route || ''}/${navItem.Route}`)"
          exact
          class="text-decoration-none fw-bold text-primary d-inline-block item-title"
        >
          {{ navItem.Title }}
        </nuxt-link>
        <div v-for="subNav in navItem.SubNavigations" :key="subNav.Id">
          <nuxt-link
            :to="`${navItem.Route}/${subNav.Route}`"
            class="text-decoration-none d-inline-block text-dark sub-item-title"
            :class="tableItems.Navigations.length > 1 ? 'fw-medium' : 'fw-bold'"
          >
            {{ subNav.Title }}
          </nuxt-link>
          <div class="d-flex flex-column sub-sub-item-container">
            <nuxt-link
              v-for="subSubItem in subNav.SubSubNavigations"
              :key="subSubItem.Id"
              :to="
                    subSubItem.IsStaticRoute  ? 
                      localePath(subSubItem.OriginalRoute!)
                    :
                    localePath({
                          path: `/${navItem.Route}/${subNav.Route}`,
                          query: navItem.Id === 2 ? { product:subSubItem.Route }: {}
                        })
                  "
              class="text-decoration-none d-inline-block fw-medium text-dark-gray sub-sub-item"
            >
              {{ subSubItem.Title }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useLocalePath } from "#i18n";
  import { TMenu } from "~/types/nav.types";

  defineProps<{
    tableText: string;
    tableItems?: TMenu;
  }>();

  const localePath = useLocalePath();
</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
  }
  .sitemap__table {
    gap: 8px;
    &-title {
      padding: 14px 24px;
      border-radius: 16px;
      background: #cbdddf;
    }
    &-items {
      padding: 16px 16px;
    }
    &-item {
      gap: 8px;

      .item-title {
        padding: 16px 0;
      }
    }
    .sub-item-title {
      padding-top: 8px;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .sub-sub-item {
      padding-top: 8px;
      padding-bottom: 8px;
    }
    .sub-sub-item-container {
      padding-left: 16px;
    }
  }
</style>
