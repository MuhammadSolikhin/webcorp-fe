<script setup lang="ts">
  const props = defineProps<{ navItemsVisible: boolean }>();
  const emits = defineEmits<{
    (e: "closeAllNav"): void;
  }>();
  const search = ref("");
  const { t } = useI18n();
  const localePath = useLocalePath();
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

  function handleSearch() {
    search.value = "";
    emits("closeAllNav");
    navigateTo(
      localePath({
        path: "/search",
        query: { query: search.value },
      })
    );
  }
</script>

<template>
  <span id="search-icon" class="accordion-header d-inline-block">
    <button
      class="button collapse-btn p-0"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#search-coll"
      data-bs-parent="#nav-accordion"
      @click="emits('closeAllNav')"
    >
      <img
        :src="props.navItemsVisible ? '/icons/cil-search-darkmode.svg' : '/icons/cil-search.svg'"
        alt="search"
      />
    </button>
  </span>
  <ClientOnly>
    <Teleport to="#search-accordion ">
      <div id="search-coll" class="collapse collapse-container" data-bs-parent="#nav-accordion">
        <div id="coll-search" class="accordion-body container">
          <form @submit.prevent="handleSearch">
            <div class="mb-4">
              <input
                id="dropdown-input-search"
                v-model="search"
                class="form-control"
                :placeholder="$t('search.input')"
              />
            </div>
          </form>
          <div class="search-history">
            <div v-for="item in searchItems" :key="item.slug" class="sub-search-history history">
              <p class="navbar-text">
                {{ $t(item.name) }}
              </p>
              <nuxt-link
                v-for="subItem in item.results"
                :key="subItem.name"
                class="nav-item text-decoration-none"
                :to="
                  localePath({
                    path: `/search`,
                    query: {
                      query: subItem.name,
                    },
                  })
                "
                @click="emits('closeAllNav')"
              >
                {{ subItem.name }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style lang="scss" scoped>
  #coll-search {
    display: flex;
    flex-direction: column;

    form {
      padding: 0;

      fieldset {
        padding: 0;
        margin: 0;
      }

      #dropdown-input-search {
        border: none;
        border-bottom: 1px solid map-get($primaryColor, "20");
        border-radius: 0px !important;
        padding: 16px 12px;
        font-size: inherit;
      }
    }

    .search-history {
      display: flex;
      flex-direction: column;
      gap: 1.3rem;

      .sub-search-history {
        flex-direction: column;
        display: flex;
        gap: 12px;

        .nav-item {
          padding-left: 1rem;
          font-weight: 500;
        }

        .navbar-text {
          display: inline-block;
          width: fit-content;
          color: map-get($primaryColor, "80");
          font-weight: 700;
          font-size: inherit;
          position: relative;
          padding: 0;
          margin-bottom: 12px;

          &::after {
            display: block;
            position: absolute;
            bottom: -8px;
            content: "";
            height: 2px;
            width: 100%;
            background: map-get($secondaryColor, "50");
          }
        }

        .nav-link {
          font-size: 14px;
          color: map-get($neutralColor, "10");
          padding: 0;
        }
      }
    }
  }
</style>
