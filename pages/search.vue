<template>
  <div>
    <div id="jumbotron">
      <div class="py-5 text-center container">
        <div class="mx-auto col-12 col-md-6">
          <input
            id="searchInput"
            :value="search"
            class="mb-3 text-center form-control"
            :placeholder="$t('page.search.input')"
            type="text"
            @input="
              debounce(() => {
                search = ($event.target as HTMLInputElement)!.value;
                navigateTo({ query: { query: ($event.target as HTMLInputElement)!.value } });
              })
            "
          />
        </div>
      </div>
    </div>

    <div id="wrapper">
      <div class="container">
        <div class="py-5 row s-100 mx-auto">
          <div id="sidebar" class="col-12">
            <p class="fw-bold mb-1">
              {{ $t("page.search.searchResult") }}
            </p>
            <p>
              {{ blogs?.length }} {{ $t("page.search.from") }}
              {{ blogs?.length }}
              <span class="text-lowercase">{{ $t("page.search.searchResult") }}</span>
            </p>
            <div
              v-if="blogs && blogs.length > 0"
              class="row row-cols-1 row-cols-md-2 row-cols-lg-3 py-4"
            >
              <div v-for="blog in blogs" :key="blog.Id" class="col">
                <BlogNewsCard v-bind="{ ...blog, to: localePath(`/news/${blog.Slug}`) }" />
              </div>
            </div>
            <div v-else id="notFound" class="text-center my-4">
              <img
                id="notFoundImage"
                class="mt-5 img-fluid"
                src="/icons/placeholder-3.png"
                alt="placeholder"
              />
              <span class="title font-family-title">{{ $t("page.search.notFound") }}</span>
              <span class="description">{{ $t("page.search.notFoundDescription") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { NewsRes, News } from "~/types/news.types";

  const { t } = useI18n();
  const localePath = useLocalePath();
  useAppSeo({
    title: t("page.search.title"),
    description: t("page.search.title"),
    ogDescription: t("page.search.title"),
    ogTitle: t("page.search.title"),
    ogUrl: localePath("/search"),
  });

  const route = useRoute("search");

  const { apiUrl } = useRuntimeConfig().public;
  const { locale } = useI18n();

  const search = ref(route.query.query || "");
  const blogs = ref<News[]>([]);

  const debounce = createDebounce(); // utils function
  watch(search, newValue => {
    if (newValue) searchBlog();
    else if (!newValue) blogs.value = [];
  });
  watch(
    () => route.query.query as string,
    newQuery => {
      search.value = newQuery;
    }
  );
  async function searchBlog() {
    if (!search.value) return;
    try {
      const { data: news } = await $fetch<NewsRes>(
        `${apiUrl}/${locale.value}/blogs?1=1&search=${search.value}`
      );
      blogs.value = news;
    } catch (err) {
      if (blogs.value.length) blogs.value = [];
    }
  }
  onMounted(() => {
    searchBlog();
  });
</script>

<style lang="scss" scoped>
  #wrapper {
    background-color: map-get($neutralColor, "01");

    @media screen and (max-width: 768px) {
      background-color: map-get($secondaryColor, "10");
    }
  }

  #searchInput {
    border: 0;
    border-bottom: 1px solid map-get($primaryColor, "20");
    border-radius: 0 !important;
  }

  #jumbotron,
  input[type="text"] {
    background-color: map-get($fourthColor, "10");
    color: map-get($primaryColor, "60");
  }

  #notFoundImage {
    max-width: 250px;
  }

  #sidebar {
    ul {
      border-left: 1px solid map-get($primaryColor, "20");
      padding-left: 4px;

      li {
        margin-left: 25px;
        margin-right: 25px;
        margin-top: 15px;
        margin-bottom: 15px;
      }

      li:not(.active) {
        cursor: pointer;
      }

      li.active {
        color: map-get($secondaryColor, "50");
        font-weight: bold;
        text-decoration: underline;

        span {
          display: inline-block;
          border-bottom: 1px solid map-get($secondaryColor, "50");
          padding-bottom: 2px;
        }
      }
    }

    .title {
      color: map-get($primaryColor, "50");
      font-weight: bold;
    }
  }

  table {
    .name {
      width: 40%;
    }
  }

  #notFound {
    .title {
      display: block;
      color: map-get($primaryColor, "50");
      font-size: 30px;
      font-weight: bolder;
      margin-top: 30px;
    }

    .description {
      font-size: 12px;
      display: block;
    }
  }
</style>
