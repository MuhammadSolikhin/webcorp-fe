<script setup lang="ts">
  import type { SubNavigation } from "~/types/nav.types";

  const props = defineProps<{
    subNav: SubNavigation;
    parentRoute: string;
    border: boolean;
  }>();

  const localePath = useLocalePath();
  const emits = defineEmits<{
    (e: "closeNav"): void;
  }>();

  function closeNav() {
    emits("closeNav");
  }
</script>

<template>
  <ul class="nav-links-column p-0 d-flex flex-column" :class="props.border && 'nav-border'">
    <li>
      <NuxtLink
        :to="
          props.subNav.IsStaticRoute
            ? localePath({ path: props.subNav.Route })
            : localePath({ path: `/${props.parentRoute}/${props.subNav.Route}` })
        "
        class="fw-bold text-decoration-none d-inline-block nav-links-column-item nav-links-column-item-title pb-0"
        style="font-size: 16px"
        @click="closeNav"
      >
        {{ props.subNav.Title }}
      </NuxtLink>
    </li>
    <li v-for="subSubNav in props.subNav.SubSubNavigations" :key="subSubNav.Route">
      <NuxtLink
        :to="subSubNav.IsStaticRoute  ? 
            localePath({
            path: subSubNav.OriginalRoute!.split('#')[0],
            hash: subSubNav.OriginalRoute!.split('#')[1] ? '#' + subSubNav.OriginalRoute!.split('#')[1] : subSubNav.OriginalRoute!.split('?')[1] ? '?' + subSubNav.OriginalRoute!.split('?')[1] : '' 
            }) :
            localePath({
                    path: `/${props.parentRoute}/${props.subNav.Route}`,
                    query: { product:subSubNav.Route },
                })
            "
        class="fw-bold d-inline-block text-primary text-decoration-none nav-links-column-item"
        style="font-size: 14px"
        @click="closeNav"
      >
        {{ subSubNav.Title }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
  .nav-links-column {
    list-style-type: none;
    margin-bottom: 16px;
    &.nav-border {
      border-right: 1px solid $light-gray;
    }
  }
  .nav-links-column-item {
    padding: 8px 16px;
  }
  .nav-links-column-item-title {
    margin-bottom: 16px;
  }
  is-column {
    .nav-links-column {
      border: 0 !important;
    }
    column-rule: 1px solid $light-gray;
  }
</style>
