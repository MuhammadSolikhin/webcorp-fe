<template>
  <div
    id="desktop-navbar-container"
    class="fixed-top"
    :class="{ 'shrink-nav': shrinkNav }"
    :style="{ zIndex: 9999 }"
  >
    <nav
      id="inner-desktop-navbar"
      class="container navbar navbar-expand-md d-none d-md-flex justify-content-between align-items-end"
    >
      <!-- LOGO -->
      <NuxtLink class="navbar-brand p-0 m-0" :to="localePath('/')">
        <img id="hibank-logo" src="/icons/logo.svg" alt="Hibank" />
      </NuxtLink>
      <!-- Mobile Humbugger Menu -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="d-flex w-100 justify-content-between align-items-center">
        <!-- MAIN MENU -->
        <ul
          class="navbar-nav me-auto mb-lg-0 flex-grow justify-content-center mx-auto align-items-center"
        >
          <li
            v-for="leftMenu in navLeftMenus"
            :key="leftMenu.Id"
            class="nav-item"
            @mouseover="() => (hoveredNavItem = leftMenu.Id)"
            @mouseleave="() => (hoveredNavItem = null)"
          >
            <NuxtLink
              v-if="!leftMenu.Navigations.length"
              class="text-decoration-none nav-link"
              :class="[
                hoveredNavItem === leftMenu.Id && 'active-link',
                // Highlight hi-Literasi if on blog listing or detail page (case-insensitive)
                leftMenu.Title &&
                  leftMenu.Title.toLowerCase() === 'hi-literasi' &&
                  (getRouteBaseName(route) === 'blogs' ||
                    getRouteBaseName(route) === 'blogs-slug' ||
                    getRouteBaseName(route) === 'blogs-all') &&
                  'active-link',
              ]"
              :to="localePath(leftMenu.Route || '')"
              :target="isValidUrl(leftMenu.Route || '') ? '_blank' : '_self'"
            >
              {{ leftMenu.Title }}
            </NuxtLink>
            <button v-else :id="'toggle-' + leftMenu.Id" class="text-decoration-none btn-nothing">
              <component
                :is="leftMenu.Route ? NuxtLink : 'span'"
                class="nav-link"
                :class="[
                  (isActiveLink(leftMenu.Route) || hoveredNavItem === leftMenu.Id) && 'active-link',
                  // Highlight hi-Literasi if on blog listing or detail page (case-insensitive)
                  leftMenu.Title &&
                    leftMenu.Title.toLowerCase() === 'hi-literasi' &&
                    (getRouteBaseName(route) === 'blogs' ||
                      getRouteBaseName(route) === 'blogs-slug' ||
                      getRouteBaseName(route) === 'blogs-all') &&
                    'active-link',
                ]"
                :pseudo-title="leftMenu.Title"
                :to="localePath(leftMenu.Route!)"
              >
                {{ leftMenu.Title }}
                <span class="text-dark arrow-icon">
                  <i v-if="hoveredNavItem !== leftMenu.Id" class="bx bx-chevron-down"></i>
                  <i v-if="hoveredNavItem === leftMenu.Id" class="bx bx-chevron-up"></i>
                </span>
              </component>
            </button>
            <NavDesktopDropDownFull
              v-if="leftMenu.Navigations.length > 0"
              :nav-items="leftMenu.Navigations"
              :opened="hoveredNavItem === leftMenu.Id"
              @closeNav="closeNav"
            />
          </li>
        </ul>
        <!-- RIGHT MENU -->
        <ul class="navbar-nav align-items-center">
          <li
            v-for="rightMenu in navRightMenus"
            :key="rightMenu.slug"
            class="me-4"
            :class="`${hoveredNavItem === rightMenu.slug ? 'opened' : 'closed'}`"
            @mouseover="hoveredNavItem = rightMenu.slug"
            @mouseleave="hoveredNavItem = null"
          >
            <button
              :id="'toggle-' + rightMenu.slug"
              class="btn p-0 d-inline-block"
              style="height: 28px"
              :class="`${hoveredNavItem === rightMenu.slug ? 'opened' : 'closed'}`"
            >
              <img
                v-if="rightMenu.icon"
                :src="rightMenu.icon"
                :style="{ width: rightMenu.iconWidth }"
                :class="rightMenu.slug"
                :alt="rightMenu.slug"
              />
            </button>
            <NavSearch
              v-if="rightMenu.slug === 'search'"
              :menu-slug="rightMenu.slug"
              :opened="hoveredNavItem === rightMenu.slug"
              @update:hovered-nav-item="(routePath: string) => (hoveredNavItem = routePath)"
            />
            <NavDesktopDropDown
              v-if="rightMenu.subTypes && rightMenu.subTypes.length"
              :opened="hoveredNavItem === rightMenu.slug"
              :menu-slug="rightMenu.slug"
              :list-items="rightMenu.subTypes"
              @update:hovered-nav-item="routePath => (hoveredNavItem = routePath)"
              @click:item="item => rightMenuItemClick(rightMenu.slug, item)"
            />
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import NavSearch from "./NavSearch.vue";
  import { isValidUrl } from "~/utils/validurl";
  import { NuxtLink } from "#components";

  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();
  const route = useRoute();

  const { navLeftMenus, navRightMenus, hoveredNavItem } = await useNav();

  function rightMenuItemClick(slug: string, payload: any) {
    if (slug === "language" && payload.id) {
      navigateTo(switchLocalePath(payload.id));
    }
  }
  const shrinkNav = inject<boolean>("shrinkNav");

  const getRouteBaseName = useRouteBaseName();

  const isActiveLink = computed(() => {
    return (routePath: string | null) => {
      const baseName = getRouteBaseName(route);

      if (routePath === null && baseName === "type-subType") return true;
      else if (
        routePath &&
        routePath.includes("about-us") &&
        baseName &&
        baseName.includes("about-us")
      )
        return true;
      return false;
    };
  });

  function closeNav() {
    hoveredNavItem.value = null;
  }
</script>

<style lang="scss">
  #desktop-navbar-container {
    .nav-link {
      &.router-link-active,
      &.active-link {
        &:not(.navbar-brand) {
          color: $dark !important;
          border-bottom: 2px solid $secondary !important;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  #desktop-navbar-container {
    background-color: map-get($neutralColor, "01");
    backdrop-filter: blur(0);
    box-shadow: none;
    transition: all 500ms ease;

    #inner-desktop-navbar {
      .nav-link {
        font-weight: 700;
        color: $nav-link;
        padding: 8px 16px;
        border-bottom: 2px solid transparent;
        margin-left: 25px;
        transition: all 300ms ease;
      }

      .arrow-icon {
        display: inline-block;
        margin-left: 10px;

        i {
          display: inline-block;
          transform: scale(1.4);
          transition: all 500ms ease;
        }
      }
    }

    .btn-nothing {
      padding: 0px;
      margin: 0px;
      color: map-get($neutralColor, "10");
      border: none;
      background-color: transparent;

      &:focus {
        box-shadow: none;
        background-color: transparent;
        border-color: transparent;
      }
    }
  }

  #desktop-navbar-container.shrink-nav {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;

    #inner-desktop-navbar {
      #hibank-logo {
        height: 40px !important;
        // transform: translateY(-3px);
      }

      .nav-link {
        font-size: 15px !important;
        padding-bottom: 5px !important;
      }
    }

    .arrow-up,
    .arrow-down {
      transform: translateY(3px) !important;
    }
  }

  #inner-desktop-navbar {
    padding-top: 24px;
    padding-bottom: 24px;
    gap: 24px;
    align-items: flex-end;

    #hibank-logo {
      height: 64px;
      transition: all 300ms ease;
    }

    #nav-menu-container {
      #nav-menu-main {
        gap: 24px;
      }
    }
  }
</style>