<script setup lang="ts">
  import type { SubNavigation } from "~/types/nav.types";

  const props = defineProps<{
    columns: SubNavigation[] | SubNavigation[][];
    parentRoute: string;
  }>();

  const emits = defineEmits<{
    (e: "closeNav"): void;
  }>();
  //   const columnWidth = 300;
  //   const clientWidth = ref(0);
  //   const columnMaxWidth = computed(() => {
  //     return props.columns.length < 3
  //       ? `${columnWidth * props.columns.length}px`
  //       : clientWidth.value < 1200
  //       ? "auto"
  //       : `${columnWidth * 3}px`;
  //   });

  //   function setClientWidth() {
  //     clientWidth.value = window.innerWidth;
  //   }
  //   onMounted(() => {
  //     setClientWidth();
  //     window.addEventListener("resize", setClientWidth);
  //   });
  //   onBeforeUnmount(() => {
  //     window.removeEventListener("resize", setClientWidth);
  //   });
  //   console.log(props.columns);
</script>

<template>
  <div
    class="h-100 w-100 nav-links-columns d-flex"
    :style="{ gap: props.columns.length <= 3 ? '30px' : '20px' }"
  >
    <template v-for="(col, i) in columns" :key="i">
      <div
        v-if="Array.isArray(col)"
        class="d-flex flex-column"
        :class="i + 1 < columns.length && 'nav-border'"
      >
        <NavDesktopNavItems
          v-for="c in col"
          :key="c.Id"
          :parent-route="props.parentRoute"
          :sub-nav="c"
          :border="false"
          :style="`width:100%; max-width: ${columns.length <= 3 ? 270 : 220}px`"
          @close-nav="emits('closeNav')"
        />
      </div>
      <NavDesktopNavItems
        v-else
        :parent-route="props.parentRoute"
        :border="i + 1 < columns.length"
        :sub-nav="col"
        :style="`width: ${columns.length <= 3 ? 270 : 220}px`"
        @close-nav="emits('closeNav')"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
  .nav-border {
    border-right: 1px solid $light-gray;
  }
</style>
