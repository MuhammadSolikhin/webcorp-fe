<script setup lang="ts">
import queryString from "query-string";
import type { NewsRes } from "~/types/news.types";

const { locale, t } = useI18n();
const { apiUrl } = useRuntimeConfig().public;
const route = useRoute();
const localePath = useLocalePath();
const loadingIndicator = useCustomLoadingIndicator();
const device = useDevice(); 

const pageNumber = useState(() =>
  route.query.page ? +(route.query.page as string) : 1
);
const searchValue = ref("");
const selectedType = useState(() => route.query.blog_type || "");


const hideYoutubeVideo = computed(() => device.isMobile);

onMounted(() => {
  selectedType.value = route.query.blog_type || "";
});

const {
  data: newsRes,
  status: newsStatus,
  execute,
} = await useAsyncData<NewsRes>(
  "news",
  () => {
    let urlPath = `${apiUrl}/${locale.value}/v2/blogs?limit=3&page=${pageNumber.value}&search=${searchValue.value}`;
    if (selectedType.value)
      urlPath = urlPath + "&blog_type_slug=" + selectedType.value;
    return $fetch(urlPath);
  },
  { watch: [() => pageNumber.value, () => selectedType.value] }
);


const filteredNews = computed(() => {
  if (!newsRes.value) return [];
  if (!hideYoutubeVideo.value) return newsRes.value.data;
  return newsRes.value.data.filter(blog => String(blog.Type) !== "3");
});

watch(newsStatus, status => {
  if (status === "pending") loadingIndicator.start();
  if (status === "error") loadingIndicator.finish();
  if (status === "success") {
    loadingIndicator.finish();
    const offsetTop = (
      document.querySelector(".news-content-section") as HTMLDivElement
    ).offsetTop;
    window.scrollTo(0, offsetTop - 120);
  }
});

watch(selectedType, async (newQuery, oldQuery) => {
  if (newQuery !== oldQuery) {
    const stringVal = queryString.stringify(
      { ...route.query, blog_type: newQuery },
      { skipNull: true, skipEmptyString: true }
    );
    await navigateTo({
      query: queryString.parse(stringVal),
    });
  }
});

watch(
  () => route.query.blog_type,
  async (newQuery, oldQuery) => {
    if (newQuery !== oldQuery) {
      blogByType(newQuery as string);
    }
  }
);

const { links, banner, productRes } = await useProductMeta("news/news");

useAppSeo({
  title: t("page.aboutUs.news.title"),
  ogTitle: t("page.aboutUs.news.title"),
  ogUrl: localePath("/news-mobile"),
});

interface BlogType {
  Id: number;
  Group: string;
  Title: string;
  Slug: string;
}

const { data: blogTypeRes } = await useAPI<{ data: BlogType[] }>("blog-types");

onMounted(() => {
  if (!route.query.page) {
    navigateTo({
      query: { ...route.query, page: 1 },
    });
  }
});

function blogByType(slug: string) {
  if (selectedType.value !== slug) {
    selectedType.value = slug;
    pageNumber.value = 1;
  }
}
</script>

<template>
  <div>
    <section class="news-content-section">
      <!-- blogs -->
      <div id="blog-items" class="container">
        <!-- blog card -->
        <div
          v-if="filteredNews.length"
          class="row row-cols-1 row-cols-md-2 row-cols-lg-3 py-4 w-100 mx-auto"
        >
          <!-- 🔁 ONLY CHANGE HERE -->
          <div v-for="blog in filteredNews" :key="blog.Id" class="col mb-4">
            <BlogNewsCard
              v-bind="{ ...blog, to: localePath(`/news-mobile/${blog.Slug}`) }"
            />
          </div>
        </div>

        <!-- pagination (TIDAK DIUBAH) -->
        <div
          v-if="newsRes && newsRes.data.length"
          class="news-pagination d-flex justify-content-center"
        >
          <BlogPagination
            v-memo="[newsStatus === 'success']"
            :current-page="newsRes.meta.current_page"
            :page-limit="newsRes.meta.per_page"
            :total-items="newsRes.meta.total"
            :scroll-to-top="{
              elementId: '#blog-items',
              scroll: newsStatus === 'success',
              space: 100,
            }"
            @update:pagination="p => (pageNumber = p)"
          />
        </div>

        <p v-else class="py-3 text-center fw-bold">
          {{ $t("shared.noDataFound") }}
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.news-content-section {
  display: flex;
  flex-direction: column;
}
.search-box {
  background-color: $secondary;
  width: 100%;
  @media screen and (min-width: $lg) {
    background-color: transparent;
    max-width: calc($lg - 10%);
    margin: auto;
    margin-top: 1.5rem;
  }
}
#blog-items {
  @media screen and (min-width: $lg) {
    margin-top: 2rem;
  }
}
.tag-item {
  background: transparent;
  border-radius: 100px;
  box-shadow: inset 0px 0px 0px 1px $primary;
  color: $primary;
  padding: 8px 24px;
  font-weight: 500;
  color: $primary;
  border: none;
  cursor: pointer;
  user-select: none;
  @media screen and (min-width: $lg) {
    padding: 6px 26px;
    font-weight: bold;
  }
  &.all-item {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      right: -24px;
      top: 0;
      width: 1px;
      height: 100%;
      background: #686868;
    }
  }
  &.active-item {
    background-color: $primary;
    color: white;
  }
}
.swiper-slide {
  width: max-content;
}
.news-pagination {
  padding: 64px 0;
}
</style>

<style lang="scss">
.news-content-section {
  .swiper {
    margin: 0;
  }
}
.slider-all {
  margin-right: 48px !important;
}
</style>
