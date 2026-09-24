<script lang="ts" setup>
import type { AppRes } from "types/utils.types";
import type { Article } from "types/blog.types";
import { ref, onMounted, computed } from "vue";

const { t } = useI18n();
const localePath = useLocalePath();
const device = useDevice();

const isClient = ref(false);


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
  isClient.value = true;

  const notInAppWebView = !isAppWebView();
  showMobileNav.value = notInAppWebView;
  showBreadcrumb.value = notInAppWebView;


  hideYoutube.value = isMobileBrowser() || isAppWebView();
});

interface ArticlesRes {
  lastArticle: Article | null;
  featuredArticles: Article[];
  recommendedArticles: Article[];
}

const { data: articlesRes } = await useAPI<AppRes<ArticlesRes>>("articles/home");
if (!articlesRes.value) {
  throw createError("unable to load blogs. try again!");
}

useAppSeo({
  title: "hi-Literasi",
  ogTitle: "hi-Literasi",
  description: articlesRes.value.data.lastArticle?.MetaDescription || "",
  ogImage: articlesRes.value.data.lastArticle?.BannerImage,
  ogUrl: localePath("/blogs"),
});

const links = computed(() => [
  { title: t("navigation.home"), to: localePath("/") },
  { title: "hi-Literasi", to: localePath("/blogs") },
]);

const filteredFeaturedArticles = computed(() => {
  const list = articlesRes.value?.data.featuredArticles ?? [];
  return hideYoutube.value
    ? list.filter(a => Number(a.Type) !== 3)
    : list;
});

const filteredRecommendedArticles = computed(() => {
  const list = articlesRes.value?.data.recommendedArticles ?? [];
  return hideYoutube.value
    ? list.filter(a => Number(a.Type) !== 3)
    : list;
});

</script>

<template>
  <div class="container page-section-padding-b">
    <!-- breadcrumbs -->
    <BlogBreadcrumb v-if="showBreadcrumb" :links="links" color="dark" />

    <!-- Only show the BlogActionCard if lastArticle exists -->
    <div v-if="articlesRes?.data.lastArticle" class="page-section-padding-t">
      <BlogActionCard :blog="articlesRes.data.lastArticle" />
      <div class="home-page-section-padding-md">
        <hr />
      </div>
    </div>

    <div
      class="featured-articles d-flex flex-column"
      :class="{ 'mt-4': !articlesRes?.data.lastArticle }"
    >
      <AppTitle size="sm" class="mb-0">
        {{ $t("page.blog.featuredArticles") }}
      </AppTitle>

      <div
        class="row row-cols-md-1 row-cols-md-2 row-cols-lg-3 w-100 mx-auto featured-articles__articles"
      >
        <div
          v-for="featuredArticle in filteredFeaturedArticles"
          :key="featuredArticle.Id"
          class="featured-articles__article"
        >
          <BlogArticleCard :blog="featuredArticle" slug-prefix="/blogs" />
        </div>
      </div>
    </div>

    <div class="home-page-section-padding-md">
      <hr />
    </div>

    <div class="other-articles d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center other-articles__title-block">
        <AppTitle size="sm" class="mb-0">{{ $t("page.blog.otherArticles") }}</AppTitle>
        <AppLink
          class="text-primary d-none d-md-block"
          :title="$t('shared.seeMore')"
          :to="localePath(`/blogs/all`)"
        />
      </div>

      <div
        class="w-100 row mx-auto row-cols-1 row-cols-md-2 row-cols-lg-3 other-articles__articles"
      >
        <div
          v-for="recommendedArticle in filteredRecommendedArticles"
          :key="recommendedArticle.Id"
          class="other-articles__article"
        >
          <BlogArticleCard
            :blog="recommendedArticle"
            :show-thumb="false"
            :border="false"
            slug-prefix="/blogs"
            :shadow="false"
          >
            <template #action>
              <AppButton
                :to="localePath(`/blogs/${recommendedArticle.Slug}`)"
                color="primary"
                size="md"
                height="medium"
                class="read-more text-sm"
              >
                {{ $t("page.blog.readMore") }}
              </AppButton>
            </template>
          </BlogArticleCard>
        </div>
      </div>

      <AppButton
        color="primary"
        variant="outline"
        :to="localePath(`/blogs/all`)"
        class="w-100 d-flex d-md-none"
      >
        <span>{{ $t("shared.seeMore") }}</span>
        <i style="font-size: 20px" class="bx bx-right-arrow-alt"></i>
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
hr {
  width: 100%;
  height: 1px;
  background: $light-gray;
  margin: 0 !important;
}

.featured-articles {
  row-gap: 36px;

  @media screen and (min-width: $md) {
    row-gap: 52px;
  }

  @media screen and (min-width: $lg) {
    row-gap: 64px;
  }

  &__articles {
    row-gap: 36px;
  }

  &__article {
    padding-left: 0;
    padding-right: 0;

    @media screen and (min-width: $md) {
      padding-right: 25px;
    }

    @media screen and (min-width: $lg) {
      padding-right: 35px;
    }
  }
}

.other-articles {
  row-gap: 36px;

  @media screen and (min-width: $md) {
    row-gap: 52px;
  }

  @media screen and (min-width: $lg) {
    row-gap: 64px;
  }

  &__articles {
    row-gap: 36px;
  }

  &__article {
    padding-left: 0;
    padding-right: 0;

    @media screen and (min-width: $md) {
      padding-right: 25px;
    }

    @media screen and (min-width: $lg) {
      padding-right: 35px;
    }
  }
}

.other-articles {
  border: 0 !important;
}

.page-section-padding-t {
  padding-top: 24px;

  @media screen and (min-width: $lg) {
    padding-top: 32px;
  }
}

.page-section-padding-b {
  padding-top: 24px;
  padding-bottom: 36px;

  @media screen and (min-width: $md) {
    padding-top: 24px;
    padding-bottom: 48px;
  }

  @media screen and (min-width: $lg) {
    padding-bottom: 64px;
  }
}
</style>