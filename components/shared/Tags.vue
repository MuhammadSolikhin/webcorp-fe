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
    (e: "itemClick", val: string): void;
  }>();
  defineOptions({
    inheritAttrs: false,
  });
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
        v-if="tab.Title"
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
    background: transparent;
    border-radius: 100px;
    box-shadow: inset 0px 0px 0px 1px $primary;
    color: $primary;
    padding: 8px 24px;
    font-weight: 500;
    border: none;
    @media screen and (min-width: $lg) {
      padding: 6px 26px;
      font-weight: bold;
    }
    // &.all-item {
    //   position: relative;
    //   &::before {
    //     content: "";
    //     position: absolute;
    //     right: -20px;
    //     top: 0;
    //     width: 1px;
    //     height: 100%;
    //     background: #686868;
    //   }
    // }
    &.active-item {
      background-color: $primary;
      color: white;
    }
  }
</style>
