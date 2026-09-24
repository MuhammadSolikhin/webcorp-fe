<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import Breadcrumb from "~/components/Blog/Breadcrumb.vue";
import type { Article } from "~/types/blog.types";
import type { AppRes } from "~/types/utils.types";
import { formatDate } from "~/utils/formatDate";
import AppVideoPlayer from "~/components/shared/AppVideoPlayer.vue";

const route = useRoute("blogs-slug");
const localePath = useLocalePath();
const { locale, t } = useI18n();
const device = useDevice();
const isClient = ref(false);

const showImageModel = ref(false);

interface ArticleRes {
  article: Article;
  recommendations: Article[];
}

const { data: blogRes, error } = await useAPI<AppRes<ArticleRes>>(
  `articles/${route.params.slug}`
);

const backToList = computed(() => {
  const currentPath = route.path


  
  const basePath = currentPath.replace(/\/[^\/]+$/, '')


  const finalPath = localePath(`${basePath}/all?page=1`)


  return finalPath
})

if (error.value || !blogRes.value) {
  throw createError({ statusCode: 404, message: "Page Not Found" });
}

const article = blogRes.value.data.article;
const recommendations = blogRes.value.data.recommendations;

const isVideoArticleHidden = computed(() => {
  return isClient.value && device.isMobile && article.Type == "3";
});

const hideYoutubeVideo = computed(() => {
  return !isClient.value || device.isMobile;
});

const filteredRecommendations = computed(() => {
  let list = recommendations;

  if (isClient.value && device.isMobile) {
    list = list.filter(r => String(r.Type) !== "3");
  }

  if (article.Type == "2" || article.Type == "3") {
    return list.filter(r => r.Type == "2" || r.Type == "3");
  }

  return list.filter(r => r.Type == "1" || r.Type == null);
});

useAppSeo({
  title: article.Title,
  description: article.MetaDescription || article.Title,
  ogTitle: article.Title,
  ogDescription: article.MetaDescription || article.Title,
  ogImage: article.BannerImage,
  ogUrl: localePath(`/blogs/${article.Slug}`),
});

function sanitizeProductContent(content: string): string {
  return content.replace(/table theme-table/g, "theme-table");
}

watch(showImageModel, show => {
  document.body.style.overflow = show ? "hidden" : "auto";
});

const $src = ref("");
const $hlsSrc = ref("");

if (article && Number(article.Type) === 2) {
  if (article.VideoHls) {
    $hlsSrc.value = article.VideoHls;
  } else if (article.Video) {
    $src.value = article.Video;
  }
}

let fullscreenChangeHandler: any;
let keydownHandler: any;

onMounted(() => {
  isClient.value = true;
  fullscreenChangeHandler = () => {};
  document.addEventListener("fullscreenchange", fullscreenChangeHandler);

  keydownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showImageModel.value) {
      showImageModel.value = false;
    }
  };
  window.addEventListener("keydown", keydownHandler);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
  window.removeEventListener("keydown", keydownHandler);
});
</script>

<template>
  <section
    v-show="!isVideoArticleHidden"
    id="news-page-section"
    class="py-4"
  >
    <div
      v-show="showImageModel"
      class="position-fixed top-0 overflow-scroll py-5"
      style="background: rgba(0, 0, 0, 0.3); height: 100vh; width: 100vw; z-index: 1020"
    >
      <button
        class="btn btn-noting position-fixed text-white"
        style="top: 40px; right: 40px"
        @click="showImageModel = false"
      >
        <i class="bx bx-x" style="transform: scale(3)"></i>
      </button>

      <div class="popup-content d-flex justify-content-center align-items-center" style="height: 100%">
        <img
          v-if="article.Type === '1' && article.BannerImage"
          :src="article.BannerImage"
          :alt="article.Title"
          class="d-block mx-auto image-popup"
        />

        <div v-if="article.Type === '2'" class="modal-video-container">
          <AppVideoPlayer :src="$hlsSrc || $src" :poster="article.ThumbnailImage || ''" />
        </div>

        <iframe
          v-if="article.Type === '3' && !hideYoutubeVideo"
          :src="`https://www.youtube.com/embed/${article.VideoEmbed}?mute=1&controls=1`"
          class="d-block mx-auto image-popup"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="container">
      <div class="py-3">
        <Breadcrumb class="d-block d-lg-none mb-4" color="dark" :links="links" />

       
       <AppLink
          :title="$t('page.home.news.returnToHiLiterasiPage')"
          dir="left"
          class="back-link"
          :to="backToList"
        />

      </div>

      <template v-if="!error && blogRes">
        <div class="pt-3">
          <div v-if="article" class="row">
            <div class="col-12 col-lg-8">
              <template v-if="article.Type == '2'">
                <div class="video-fluid-wrapper">
                  <AppVideoPlayer :src="$hlsSrc || $src" :poster="article.ThumbnailImage || ''" />
                </div>

                <div class="news-title-block news-title-video">
                  <h3 class="news-title" v-html="article.Title"></h3>
                  <div class="news-subtitle fw-medium">
                    <span>{{ article.Author }}</span>
                    <span class="mx-2" style="color:#828282">|</span>
                    <span>{{ formatDate(article.PostedDate, { locale, formateString: "D MMMM YYYY" }) }}</span>
                  </div>
                </div>
              </template>

              <template v-else-if="article.Type == '3' && !hideYoutubeVideo">
                <div class="yt-wrapper">
                  <iframe
                    :src="`https://www.youtube.com/embed/${article.VideoEmbed}?mute=1&controls=1&playsinline=1`"
                    frameborder="0"
                    allow="encrypted-media"
                    allowfullscreen
                  ></iframe>
                </div>
              </template>

              <template v-else>
                <div class="news-title-block">
                  <h3 class="news-title" v-html="article.Title"></h3>
                  <div class="news-subtitle fw-medium">
                    <span>{{ article.Author }}</span>
                    <span class="mx-2" style="color:#828282">|</span>
                    <span>{{ formatDate(article.PostedDate, { locale, formateString:"D MMMM YYYY" }) }}</span>
                  </div>
                </div>
                <div class="news-thumb">
                  <img class="w-100 img-fluid" :src="article.BannerImage" :alt="article.Title" />
                </div>
              </template>

              <div class="mt-3 d-block news-content" v-html="sanitizeProductContent(article.Content)"></div>
              <div v-if="article.Footer" class="news-content mt-4" v-html="sanitizeProductContent(article.Footer)"></div>

              <ClientOnly>
                <AppSocialMediaSharer
                  :share-title="!article.Type || article.Type === '1' ? 'Suka artikel ini?' : 'Suka video ini?'"
                />
              </ClientOnly>
            </div>

            <div v-if="recommendations.length > 0" class="col-12 col-lg-4 blog-recommendations">
              <h3 class="recommendations-title">{{ $t("page.blog.otherArticles") }}</h3>

              <div class="row gap-4 w-100 mx-auto blog-recommendation-body">
                <BlogRecommendation
                  v-for="(recommendation, index) in filteredRecommendations"
                  :key="index"
                  :blog="{
                    Title: recommendation.Title,
                    Summary: recommendation.Content,
                    to: localePath(`/blogs/${recommendation.Slug}`),
                    Type: recommendation.Type,
                    ThumbnailImage: recommendation.ThumbnailImage
                  }"
                />
              </div>

              <div class="d-flex mt-3">
                <AppLink
                  class="button button-primary-outline w-100 fw-bold read-more"
                  :title="$t('page.blog.alsoRead')"
                  :to="localePath({ path: '/blogs/all', query: { page: 1 } })"
                />
              </div>
            </div>

            <div v-else class="col-12 col-lg-4 blog-recommendations">
              <h3 class="recommendations-title">{{ $t("page.blog.otherArticles") }}</h3>
              <div class="row w-100 mx-auto text-center py-4">
                <span>Data tidak tersedia</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="scss">
.video-fluid-wrapper {
  width: 100%;
  max-width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;

  .video-js.vjs-fluid {
    padding-top: 56.25% !important;
  }

  .video-js {
    width: 100% !important;
    height: auto !important;
  }
}

.yt-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.yt-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.yt-frame {
  width: 100%;
  height: 100%;
  border: 0;
}

.modal-video-container {
  width: 90%;
  max-width: 900px;
  background: #000;

  .video-js.vjs-fluid {
    padding-top: 56.25% !important;
  }
}

.image-popup {
  max-height: 100vh;
  max-width: 100%;
}

.news-thumb img {
  border-radius: 10px;
}
</style>

<style scoped lang="scss">
.back-link { color: $primary; }
</style>