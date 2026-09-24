<script setup lang="ts">
  import { Collapse } from "vue-collapsed";
  import { NuxtLink } from "#components";

  const closeAllNav = inject("closeAllNav", () => {});

  const props = withDefaults(
    defineProps<{
      item: {
        Id: number;
        Route: string | null;
        Title: string;
        hasChild: boolean;
        active: boolean;
        isLinkActive?: boolean | undefined;
        asLink?: boolean | undefined;
      };
      showUnderline?: boolean;
      hideTitle?: boolean;
    }>(),
    {
      showUnderline: false,
      hideTitle: false,
    }
  );
  const isLink = computed(() => typeof props.item.asLink === "undefined" || props.item.asLink);
  const emits = defineEmits<{
    (e: "expend", id: number): void;
  }>();

  function closeNav() {
    if (isLink.value) {
      closeAllNav();
    }
  }
</script>

<template>
  <li :class="hideTitle && 'py-0'">
    <template v-if="isValidUrl(item.Route || '') || !item.hasChild">
      <NuxtLink
        class="text-decoration-none nav-item-text d-inline-block"
        :to="item.Route || ''"
        :target="isValidUrl(item.Route || '') ? '_blank' : '_self'"
        :class="`${item.active || item.isLinkActive ? 'nav-item-active' : ''} ${
          showUnderline ? 'show-under-line' : ''
        } ${$attrs['link-class']}`"
        @click="closeNav"
      >
        {{ item.Title }}
      </NuxtLink>
    </template>
    <template v-else>
      <div v-if="!hideTitle" class="d-flex align-items-center">
        <component
          :is="isLink ? NuxtLink : 'span'"
          :to="isLink ? item.Route : ''"
          class="nav-item-text d-inline-block text-decoration-none"
          :class="`${item.active || item.isLinkActive ? 'nav-item-active' : ''} ${
            showUnderline ? 'show-under-line' : ''
          } ${$attrs['link-class']}`"
          @click="closeNav"
        >
          {{ item.Title }}
        </component>
        <button
          type="button"
          class="btn d-flex align-items-center p-0 text-start accordion-btn"
          @click="emits('expend', item.Id)"
        >
          <span class="arrow-toggle ms-3">
            <i :class="!item.active ? 'open' : ''" class="bx bx-chevron-down down"></i>
            <i :class="item.active ? 'open' : ''" class="bx bx-chevron-up up"></i>
          </span>
        </button>
      </div>
      <Collapse :when="item.active">
        <slot name="child-items" />
      </Collapse>
    </template>
  </li>
</template>

<style lang="scss" scoped>
  li {
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;
  }
  .nav-item-text {
    display: block;
    padding: 8px;
    font-weight: 700;
    color: white;
    font-size: 14px;
    position: relative;

    &::after {
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 0%;
      height: 2px;
      background-color: #fff;
      transition: all 300ms ease-out;
    }
    &.show-under-line {
      &.router-link-active,
      &.nav-item-active {
        &::after {
          width: 100%;
        }
      }
    }
  }

  .arrow-toggle {
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    .up,
    .down {
      font-size: 22px;
      color: white;
      position: absolute;
      opacity: 0;
    }
    .up {
      transition: opacity 100ms ease-in-out;
      &.open {
        opacity: 1;
        transition: opacity 400ms ease-in-out;
      }
    }
    .down {
      transition: opacity 400ms ease-in-out;
      &.open {
        opacity: 1;
        transition: opacity 100ms ease-in-out;
      }
    }
  }
</style>
