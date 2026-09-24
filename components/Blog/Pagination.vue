<script setup lang="ts">
  const props = defineProps<{
    currentPage: number;
    totalItems: number;
    pageLimit: number;
    scrollToTop?: boolean | { scroll: boolean; elementId: string; space?: number };
  }>();

  const emits = defineEmits<{
    (e: "update:pagination", pageNumber: number): void;
  }>();

  const page = computed({
    get() {
      return props.currentPage;
    },
    set(newValue) {
      emits("update:pagination", newValue);
    },
  });
  let loaded = false;

  watch(
    () => props.scrollToTop,
    opt => {
      if (!loaded) {
        loaded = true;
        return;
      }
      if (opt && typeof opt === "boolean") window.scrollTo({ top: 0 });
      else if (opt && typeof opt === "object" && opt.scroll) {
        const ele = document.querySelector(opt.elementId) as HTMLDivElement;
        if (ele) {
          const offsetTop = ele.offsetTop;
          window.scrollTo({ top: offsetTop - (opt.space! ? opt.space : 0) });
        }
      }
    }
  );

  function handleFirst() {
    if (props.currentPage > 1) {
      page.value = 1;
    }
  }
  function handleLast() {
    if (props.currentPage < Math.ceil(props.totalItems / props.pageLimit)) {
      page.value = Math.ceil(props.totalItems / props.pageLimit);
    }
  }
</script>

<template>
  <div class="app-pagination">
    <button class="paginate-buttons" @click="handleFirst">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_166_3130"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_166_3130)">
          <path
            d="M6 18V6H8V18H6ZM17 18L11 12L17 6L18.4 7.4L13.8 12L18.4 16.6L17 18Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </button>
    <vue-awesome-paginate
      v-model="page"
      :total-items="props.totalItems"
      :items-per-page="props.pageLimit"
    >
      <template #prev-button>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_166_3133"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_166_3133)">
            <path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="currentColor" />
          </g>
        </svg>
      </template>
      <template #next-button>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_166_3148"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_166_3148)">
            <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="currentColor" />
          </g>
        </svg>
      </template>
    </vue-awesome-paginate>
    <button class="paginate-buttons" @click="handleLast">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_166_3151"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_166_3151)">
          <path
            d="M7.00156 18L5.60156 16.6L10.2016 12L5.60156 7.4L7.00156 6L13.0016 12L7.00156 18ZM16.0016 18V6H18.0016V18H16.0016Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </button>
  </div>
</template>
<style lang="scss">
  .app-pagination {
    display: flex;
    align-items: center;
    .pagination-container {
      display: flex;
      align-items: center;
      column-gap: 10px;
      margin-bottom: 0;
    }
    .paginate-buttons {
      border: none;
      background-color: transparent;
      cursor: pointer;
      color: black;
      font-weight: bold;
      padding: 0 8px;

      display: flex;
      align-items: center;
      &.forward-jump-button,
      &.backward-jump-button,
      &.next-button,
      &.back-button {
        padding: 0 0;
        width: 24px;
        height: 24px;
      }
      &.next-button {
        margin-left: 6px;
      }
      &.back-button {
        margin-right: 6px;
      }
    }
    .paginate-buttons:hover {
      color: $primary;
    }
    .active-page {
      color: $primary;
    }
  }
</style>
