<script setup lang="ts">
  import type { Navigation, SubNavigation } from "~/types/nav.types";

  const props = defineProps<{
    navItems: Navigation[];
    opened: boolean;
  }>();
  const emits = defineEmits<{
    (e: "closeNav", id: number | null): void;
  }>();

  const activeNavSubMenuId = ref<null | number>();

  watch(
    () => props.opened,
    open => {
      if (!open && activeNavSubMenuId.value) {
        activeNavSubMenuId.value = null;
      } else {
        activeNavSubMenuId.value = props.navItems[0].Id;
      }
    }
  );
  const activeNavSubMenus = computed(() =>
    props.navItems.find(item => item.Id === activeNavSubMenuId.value)
  );
  const shrinkNav = inject<boolean>("shrinkNav");

  function closeNav() {
    emits("closeNav", null);
    window.scrollTo(0, 0);
  }

  const subMenus = computed(() => {
    if (props.navItems.length <= 1) return activeNavSubMenus.value?.SubNavigations;
    const marged: number[] = [];
    const transformedItems: SubNavigation[] | SubNavigation[][] = [];
    const subMenu = toRaw(activeNavSubMenus.value?.SubNavigations);
    if (!subMenu) return null;
    subMenu.forEach((item, i) => {
      const nextItem = subMenu[i + 1];
      if (nextItem && !marged.includes(i)) {
        const currentItemLength = item.SubSubNavigations.length + 1;
        const nextItemLength = nextItem.SubSubNavigations.length + 1;
        if (currentItemLength + nextItemLength <= 10) {
          marged.push(i, i + 1);
          transformedItems.push([item, nextItem]);
        } else {
          marged.push(i);
          transformedItems.push(item);
        }
      }
      if (!nextItem && !marged.includes(i)) {
        marged.push(i);
        transformedItems.push(item);
      }
    });
    return transformedItems;
  });
</script>

<template>
  <div
    id="mega-container"
    class="position-fixed"
    :class="{ opened: props.opened }"
    :style="{
      top: shrinkNav ? `62px` : `87px`,
      paddingTop: '25px',
    }"
  >
    <div id="mega-inner-container">
      <div
        id="mega-background"
        class="position-absolute h-100"
        :class="props.opened ? 'opened' : 'closed'"
      ></div>
      <div class="row pb-3" style="min-height: 400px">
        <div v-if="props.navItems.length > 1" style="max-width: 20%" class="h-100 w-100 nav-items">
          <button
            v-for="navItem in props.navItems"
            :key="navItem.Route"
            class="nav-submenu text-primary fw-bold w-100 text-start d-flex justify-content-between align-items-center"
            :class="activeNavSubMenuId === navItem.Id && 'active-menu'"
            @mouseover="activeNavSubMenuId = navItem.Id"
          >
            <span class="d-inline-block">
              {{ navItem.Title }}
            </span>
            <span class="icon d-inline-block">
              <i class="bx bx-chevron-right"></i>
            </span>
          </button>
        </div>
        <Transition name="slide-down" :duration="2000">
          <div
            v-if="
              activeNavSubMenus &&
              activeNavSubMenus.SubNavigations &&
              activeNavSubMenus.SubNavigations.length
            "
            :key="activeNavSubMenus.Title"
            class="col nav-dropdown__items h-100 w-100"
            :class="props.navItems.length <= 1 && 'px-5'"
          >
            <NavDesktopGroupColumn
              :parent-route="activeNavSubMenus.Route"
              :columns="subMenus"
              @closeNav="closeNav"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<style>
  .slide-down-enter-active {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-down-enter-from {
    transform: translateY(-0.6rem);
    opacity: 0;
  }
  .slide-down-leave-active,
  .slide-down-leave-to {
    display: none;
  }
</style>

<style lang="scss" scoped>
  #mega-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: -100;
    background-color: transparent;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: all 300ms ease;

    .nav-submenu {
      border: none;
      background: transparent;
      outline: none;
      padding: 16px 16px;
      .icon {
        i {
          transform: scale(1.3);
        }
      }
      &.active-menu {
        background-color: #e7faf2 !important;
      }
    }

    &.opened {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto;
      z-index: 100 !important;

      #mega-inner-container {
        .nav-items,
        #mega-background {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
  #mega-inner-container {
    position: relative;
    cursor: default;
    #mega-background,
    .nav-items {
      transform: translateY(-0.6rem);
      opacity: 0;
    }
    .nav-items,
    .nav-dropdown__items {
      transition: transform 500ms cubic-bezier(0.25, 0.1, 0.32, 0.94),
        opacity 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      transition-delay: 130ms;
    }
    .nav-dropdown__items {
      transition-delay: 150ms !important;
    }
    #mega-background {
      width: 100%;
      background-color: map-get($neutralColor, "01");
      border: 1px solid map-get($neutralColor, "03");
      z-index: -1;
      transition: transform 500ms cubic-bezier(0.25, 0.1, 0.32, 0.94),
        opacity 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
    }
  }
  .nav-links-columns {
    padding-top: 16px;
    // padding-bottom: 16px;
  }
  .nav-dropdown__items {
    padding-left: 10px;
    padding-right: 10px;
    @media (min-width: 1100px) {
      padding-left: 36px;
      padding-right: 36px;
    }
  }
</style>
