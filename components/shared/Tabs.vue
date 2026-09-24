<script setup lang="ts">
  interface Item {
    Slug: string;
    Title: string;
  }
  interface TabProps {
    items: Item[];
    activeItem: string;
  }
  const props = withDefaults(defineProps<TabProps>(), {});
  const emits = defineEmits<{
    (e: "itemClick", slug: string): void;
  }>();
  defineOptions({
    inheritAttrs: false,
  });
  const initialSlide = computed(() =>
    props.activeItem ? props.items.findIndex(i => i.Slug === props.activeItem) : 0
  );
</script>

<template>
  <Swiper
    class="py-3"
    :free-mode="false"
    :draggable="props.items.length > 1"
    :grab-cursor="props.items.length > 1"
    :slides-per-view="'auto'"
    :space-between="20"
    :slide-to-clicked-slide="true"
    :initial-slide="initialSlide === -1 ? 0 : initialSlide"
  >
    <!-- <SwiperSlide> -->
    <!-- <button
            class="text-decoration-none d-inline-block tag-item all-item"
            :class="selectedType === '' && 'active-item'"
            @click="emits('itemClick', )"
          >
            All
          </button>
        </SwiperSlide> -->
    <SwiperSlide v-for="tab in props.items" :key="tab.Slug" style="width: max-content">
      <button
        v-bind="$attrs"
        class="text-decoration-none d-inline-block tag-item"
        :class="activeItem === tab.Slug && 'active-item'"
        @click="emits('itemClick', tab.Slug)"
      >
        {{ tab.Title }}
      </button>
    </SwiperSlide>
  </Swiper>
</template>

<style lang="scss" scoped>
  .tag-item {
    color: $primary;
    background: transparent;
    border: none;
    padding: 8px 24px;
    font-weight: 500;
    @media screen and (min-width: $lg) {
      padding: 6px 26px;
      font-weight: bold;
    }
    &.active-item {
      border-bottom: 2px solid currentColor;
      font-weight: 700;
    }
  }
</style>
