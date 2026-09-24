<script setup lang="ts">
  const props = defineProps<{
    opened: boolean;
    menuSlug: string;
  }>();
  const { t } = useI18n();
  const searchItems = computed(() => {
    return [
      {
        name: t("navigation.searchHistory"),
        slug: "history",
        results: [
          { name: "hibank", slug: "test-1" },
          { name: "Promo", slug: "test-2" },
        ],
      },
      {
        name: t("navigation.popularSearch"),
        slug: "popular",
        results: [
          { name: "Promo", slug: "test-1" },
          { name: "Buka Rekening", slug: "test-2" },
          { name: "Reksadana", slug: "test-3" },
          { name: "QR", slug: "test-4" },
        ],
      },
    ];
  });
  const localePath = useLocalePath();
  const shrinkNav = inject<boolean>("shrinkNav");

  const search = ref("");

  const emits = defineEmits<{
    (e: "update:hoveredNavItem", routePath: string): void;
  }>();

  function handleSearch() {
    emits("update:hoveredNavItem", props.menuSlug);
    navigateTo(
      localePath({
        path: "/search",
        query: { query: search.value },
      })
    );
  }
  function onSubNavClick() {
    emits("update:hoveredNavItem", "");
    window.scrollTo(0, 0);
  }
</script>

<template>
  <div
    id="mega-container"
    class="position-fixed"
    :class="{
      opened: props.opened,
    }"
    :style="{
      top: shrinkNav ? `60px` : `80px`,
      paddingTop: shrinkNav ? '28px' : '32px',
    }"
    @mouseover="emits('update:hoveredNavItem', props.menuSlug)"
    @mouseleave="emits('update:hoveredNavItem', '')"
  >
    <div id="mega-inner-container">
      <div
        id="mega-background"
        class="position-absolute h-100"
        :class="props.opened ? 'opened' : 'closed'"
      ></div>

      <div class="nav-search">
        <div class="py-4 search-box" :class="props.opened ? 'opened' : 'closed'">
          <input
            id="input-search"
            v-model="search"
            class="form-control"
            :placeholder="$t('search.input')"
            @keydown.enter="handleSearch"
          />
        </div>
        <ul
          class="sub-nav-container d-flex navbar-nav"
          :class="{ between: props.menuSlug === 'products' }"
        >
          <li
            v-for="searchItem in searchItems"
            :id="'toggle-' + searchItem.slug"
            :key="searchItem.slug"
            class="sub-search-history history flex-col"
            @click="onSubNavClick"
          >
            <span
              class="header-submenu flex-row underlined-text nav-link px-0 mb-4 fs-6"
              :class="props.opened ? 'opened' : 'closed'"
            >
              {{ searchItem.name }}
            </span>
            <div id="submenu-item-container" class="flex-column d-flex">
              <ul
                id="submenu-item-col"
                class="flex-column p-0"
                :class="props.opened ? 'opened' : 'closed'"
              >
                <li
                  v-for="result in searchItem.results"
                  :id="'toggle-' + result.slug"
                  :key="result.slug"
                  style="position: relative"
                  class="nav-item mb-2"
                >
                  <NuxtLink
                    :id="`nav-id-${result.slug}`"
                    :class="'flex-row item-' + result.slug"
                    :to="
                      localePath({
                        path: `/search`,
                        query: {
                          query: result.name,
                        },
                      })
                    "
                    class="submenu-title nav-link px-0 py-0"
                  >
                    {{ result.name }}
                    <span
                      :id="`underline-id-${result.slug}`"
                      style="position: absolute; height: 0; overflow: hidden"
                    ></span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #mega-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: transparent;
    opacity: 1;
    pointer-events: none;
    transition: all 300ms ease;

    &.opened {
      opacity: 1;
      pointer-events: auto;

      #mega-background {
        transform: translateY(0);
        opacity: 1;
        transition: transform 500ms cubic-bezier(0.25, 0.1, 0.32, 0.94),
          opacity 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      }
      .sub-nav-container {
        opacity: 1;
        transition: opacity 500ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      }
      .sub-nav-container {
        gap: 5rem;

        &.between {
          gap: 1rem;
        }
      }
    }
  }
  #mega-inner-container {
    position: relative;
    cursor: default;
  }
  #mega-background {
    width: 100%;
    transform: translateY(-1.6rem);
    background-color: map-get($neutralColor, "01");
    border: 1px solid map-get($neutralColor, "03");
    opacity: 0;
    z-index: -1;
  }
  .sub-nav-container {
    padding-top: 1rem;
    padding-bottom: 1rem;
    cursor: default;
    opacity: 0;

    .nav-link {
      justify-content: start;
    }
    .header-submenu.underlined-text {
      font-size: 14px;
      color: map-get($primaryColor, "80");
      font-weight: 700;
      transform: translateY(0.6rem);

      &.opened {
        transform: translateY(0);
        transition: all 700ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      }
      &::after {
        width: 100% !important;
        bottom: -6px;
      }
    }
  }
  #submenu-item-container {
    cursor: default;
    #submenu-item-col {
      list-style-type: none;
      margin: 0;
      align-items: flex-start;
      text-align: left;
      font-size: 13px;
      gap: 8px;
      transform: translateY(1.5rem);
      &.opened {
        transform: translateY(0);
        transition: all 700ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      }

      .submenu-title {
        position: relative;
        // width: max-content;
        display: inline-block;
        &::after {
          content: "";
          width: 0%;
          display: block;
          height: 1px;
          position: absolute;
          background: map-get($secondaryColor, "50");
          transition: all 300ms ease-out;
        }

        &:hover::after {
          width: 100%;
        }
        &:hover {
          color: map-get($secondaryColor, "50");
        }
      }
    }
  }

  .nav-search {
    width: 100%;
    padding: 0px 240px 40px 240px;
    border: none;
    z-index: 1000;
    gap: 1rem;

    .search-box {
      padding: 0;
      margin: 0;
      z-index: 1000;
      transition: transform 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94),
        opacity 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
      transform: translateY(1rem);
      opacity: 0;
      &.opened {
        transform: translateY(0);
        opacity: 1;
      }
    }

    #input-search {
      border: none;
      border-bottom: 1px solid map-get($primaryColor, "20");
      border-radius: 0px !important;
      padding: 12px 20px;
      font-size: 28px;
      background-color: transparent;
    }

    .search-history {
      gap: 5rem;
      z-index: 1000;

      .sub-search-history {
        align-items: flex-start;
        gap: 8px;

        header.underlined-text {
          color: map-get($primaryColor, "80");
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 12px;
          transform: translateY(1.5rem);

          &.opened {
            transform: translateY(0);
            transition: all 700ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
          }
        }

        a.underlined-text {
          font-size: 13px;
          transform: translateY(2rem);

          &.opened {
            transform: translateY(0);
            transition: all 700ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
          }

          &::after {
            width: 0%;
            bottom: -4px;
            height: 1px;
          }

          &:hover {
            color: map-get($secondaryColor, "50");
            &::after {
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
