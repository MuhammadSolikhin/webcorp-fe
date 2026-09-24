<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";
import type { PaginationAppRes } from "types/utils.types";
import type { Article } from "types/blog.types";

const { apiUrl } = useRuntimeConfig().public;
const { locale, t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const paginationTriggered = ref(false);

const device = useDevice();


const hideYoutube = ref(false);

function isAppWebView(): boolean {
  const ua = navigator.userAgent || "";
  const isAndroidWebView = /\bwv\b/.test(ua);
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/.test(ua);
  return isAndroidWebView || isIOSWebView;
}

function isMobileBrowser(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}


const showMobileNav = useState("showMobileNav");
const showBreadcrumb = ref(true);

onMounted(() => {
  const notInAppWebView = !isAppWebView();
  showMobileNav.value = notInAppWebView;
  showBreadcrumb.value = notInAppWebView;


  hideYoutube.value = isMobileBrowser() || isAppWebView();
});

useAppSeo({
  title: t("page.blog.allArticles"),
  ogTitle: t("page.blog.allArticles"),
  ogUrl: localePath("/blogs/all"),
});

const pageNumber = useState(() => (route.query.page ? +(route.query.page as string) : 1));
const activeTab = ref<"all" | "article" | "video">("all");
const searchValue = ref("");
const debouncedSearchValue = ref("");
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchValue, val => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearchValue.value = val;
  }, 300);
});

watch(pageNumber, val => {
  navigateTo({ query: { page: val } });
});

function getTypeParam(tab: string) {
  if (tab === "article") return "1";
  if (tab === "video") return "video";
  return "";
}

watch(activeTab, (newTab, oldTab) => {
  if (newTab !== oldTab && pageNumber.value !== 1) {
    pageNumber.value = 1;
    navigateTo({ query: { page: 1 } });
  }
});

watch(debouncedSearchValue, () => {
  if (pageNumber.value !== 1) {
    pageNumber.value = 1;
    navigateTo({ query: { page: 1 } });
  }
});

const { data: articlesRes, error, status } =
  await useAsyncData<PaginationAppRes<Article[]>>(
    "articles",
    () => {
      const typeParam = getTypeParam(activeTab.value);
      const params = new URLSearchParams({
        page: pageNumber.value.toString(),
        limit: "9",
      });
      if (typeParam) params.append("type", typeParam);
      if (debouncedSearchValue.value) params.append("search", debouncedSearchValue.value);
      return $fetch(`${apiUrl}/${locale.value}/v2/articles?${params.toString()}`);
    },
    { watch: [() => pageNumber.value, () => activeTab.value, () => debouncedSearchValue.value] }
  );

if (!articlesRes.value || error.value) {
  throw createError("unable to load articles. try again!");
}

const links = computed(() => [
  { title: t("navigation.home"), to: localePath("/") },
  { title: "hi-Literasi", to: localePath("/blogs") },
  { title: t("page.blog.allArticles"), to: localePath("/blogs/all") },
]);

onMounted(() => {
  if (!route.query.page) {
    navigateTo({
      query: { ...route.query, page: 1 },
    });
  }
});

const filteredArticles = computed(() => {
  let articles = articlesRes.value?.data ?? [];
  articles = articles.slice().sort((a, b) => {
    const aDate = a.PostedDate ? new Date(a.PostedDate).getTime() : 0;
    const bDate = b.PostedDate ? new Date(b.PostedDate).getTime() : 0;
    return bDate - aDate;
  });
  return articles;
});

const visibleArticles = computed(() => {
  return hideYoutube.value
    ? filteredArticles.value.filter(a => Number(a.Type) !== 3)
    : filteredArticles.value;
});

function onPagination(p: number) {
  pageNumber.value = p;
  paginationTriggered.value = true;
}

watch(status, () => {
  if (paginationTriggered.value && status.value === "success") {
    paginationTriggered.value = false;
    setTimeout(() => {
      const el = document.getElementById("featured-articles");
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }, 100);
  }
});
</script>

<template>
  <div class="container py-4">
    <BlogBreadcrumb :links="links" color="dark" v-if="showBreadcrumb" />

    <div class="head-box">
      <div class="tabs-box d-flex align-items-center gap-2">
        <button type="button" class="tab-btn" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
          <i class="bx bx-grid-alt me-1"></i> {{ t("tabs.all") }}
        </button>
        <button type="button" class="tab-btn" :class="{ active: activeTab === 'article' }" @click="activeTab = 'article'">
          <i class="bx bx-file me-1"></i> {{ t("tabs.article") }}
        </button>
        <button type="button" class="tab-btn" :class="{ active: activeTab === 'video' }" @click="activeTab = 'video'">
         <i class="bx bx-play-circle me-1"></i> {{ t("tabs.video") }}
        </button>
      </div>

      <div class="search-box">
        <form class="search-input-box container py-4" @submit.prevent="handleSearch">
          <AppInput v-model="searchValue" :placeholder="$t('Search')">
            <template #icon>
              <button type="submit" class="btn btn-nothing text-primary d-flex align-items-center">
                <i class="bx bx-search-alt-2" style="font-size: 24px"></i>
              </button>
            </template>
          </AppInput>
        </form>
      </div>
    </div>

    <template v-if="visibleArticles.length">
      <div id="featured-articles" class="featured-articles section-wrapper">
        <div class="w-100 row mx-auto row-cols-1 row-cols-md-2 row-cols-lg-3 featured-articles__articles">
          <div v-for="article in visibleArticles" :key="article.Id" class="featured-articles__article">
            <BlogArticleCard :blog="article" slug-prefix="/blogs" />
          </div>
        </div>
      </div>

      <div class="py-3 d-flex justify-content-center">
        <BlogPagination
          :current-page="articlesRes.meta.current_page"
          :page-limit="articlesRes.meta.per_page"
          :total-items="articlesRes.meta.total"
          @update:pagination="onPagination"
        />
      </div>
    </template>

    <p v-else class="py-3 text-center fw-bold text-capitalize">{{ $t("shared.noDataFound") }}</p>
  </div>
</template>

<style lang="scss">
:root {
  --article-padding-y: 30px;
}

@media screen and (min-width: $md) {
  :root {
    --article-padding-y: 50px;
  }
}

@media screen and (min-width: $lg) {
  :root {
    --article-padding-y: 70px;
  }
}
</style>

<style lang="scss" scoped>
.section-wrapper {
  padding: var(--article-padding-y) 0;
}

.featured-articles {
  padding-bottom: calc(var(--article-padding-y) - 30px);
  margin-left: -16px;
  margin-right: -16px;
}
</style>


<style lang="scss">
  :root {
    --article-padding-y: 30px;
  }

  @media screen and (min-width: $md) {
    :root {
      --article-padding-y: 50px;
    }
  }

  @media screen and (min-width: $lg) {
    :root {
      --article-padding-y: 70px;
    }
  }
</style>
<style lang="scss" scoped>
  .section-wrapper {
    padding: var(--article-padding-y) 0;

    @media screen and (min-width: $md) {
      padding: var(--article-padding-y) 0;
    }
  }

  .featured-articles {
    padding-bottom: calc(var(--article-padding-y) - 30px);
    margin-left: -16px;
    margin-right: -16px;

    .featured-articles__article {
      flex-basis: 100%;
      margin-bottom: 30px;
      padding: 0 16px;

      @media screen and (min-width: $md) {
        flex-basis: 50%;
      }

      @media screen and (min-width: $lg) {
        flex-basis: 33.3333333%;
      }
    }
  }

  .head-box {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: $lg) {
      flex-direction: column-reverse;
      align-items: flex-start;
    }

    .tabs-box {
      .tab-btn {
        display: flex;
        align-items: center;
        padding: 10px 24px;
        border-radius: 32px;
        border: 1px solid #dadada;
        background-color: transparent;
        font-size: 16px;
        line-height: 24px;
        color: #1a1a1a;
        cursor: pointer;
        transition: background-color 0.3s cubic-bezier(0.4, 0, 0.6, 1),
          color 0.3s cubic-bezier(0.4, 0, 0.6, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.6, 1);

        @media screen and (max-width: $md) {
          padding: 6px 12px;
          font-size: 14px;
          line-height: 20px;
        }

        &.active,
        &:hover {
          background-color: #e9f7fa;
          border-color: #00697f;
          color: #00697f;
        }

        i {
          font-size: 18px;
          margin-right: 6px !important;
        }
      }
    }

    .search-box {
      min-width: 360px;

      @media screen and (max-width: $lg) {
        width: 100%;
        min-width: initial;
      }

      .search-input-box {
        margin: 0;
        padding: 0;
        width: 100%;
      }

      .icon-container {
        left: 14px !important;
      }
    }

    .search-box input {
      padding-left: 46px !important;
      font-size: 16px;
      line-height: 24px;
    }
  }
</style>