<script setup lang="ts">
  import { snip } from "js-snip";
  import { Article } from "~/types/blog.types";
  import { formatDate } from "~/utils/formatDate";
  const el = ref();

  const { locale } = useI18n();
  const localePath = useLocalePath();

  const props = defineProps<{ blog: Article }>();

  const isVideoType = computed(
    () => props.blog && (String(props.blog.Type) == "2" || String(props.blog.Type) == "3")
  );

  onMounted(() => {
    if (el.value && props.blog.Content) {
      snip(el.value, { lines: 5, mode: "css" }, () => {
        el.value.innerHTML = props.blog.Content;
      });
    }
  });
</script>

<template>
  <div v-if="props.blog" class="col">
    <div class="card blog-action-card rounded-4 overflow-hidden h-100">
      <div class="row w-100 mx-auto">
        <div class="col-12 col-md-6">
          <div class="blog-thumb">
            <nuxt-img
              :src="props.blog.ThumbnailImage"
              class="card-img-top object-fit-cover w-100 h-100"
              alt="..."
            />
            <div v-if="isVideoType" class="video-overlay">
              <img
                src="/images/button-play.svg"
                alt="Play"
                class="play-btn"
                aria-label="Play Video"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 card-body-col">
          <div class="card-body d-flex flex-column p-0">
            <div class="tags-container">
              <span
                v-for="tag in props.blog.Tags"
                :key="tag.Id"
                class="tag me-2"
                :class="tag.TagClassName"
              >
                {{ tag.Title }}
              </span>
            </div>
            <div class="blog-content-box">
              <AppTitle :size="null" class="card__title" color="black">
                <nuxt-link
                  class="text-decoration-none"
                  :to="localePath(`/blogs/${props.blog.Slug}`)"
                >
                  {{ props.blog.Title }}
                </nuxt-link>
              </AppTitle>
              <!-- for seo -->
              <div class="d-none" v-html="props.blog.Content"></div>
              <div ref="el" class="card-text fw-medium"></div>
            </div>
          </div>
          <div class="card-text card-footer">
            <span class="d-block">
              by {{ props.blog.Author }}
              <span style="color: #828282" class="mx-2">|</span>
              {{ formatDate(props.blog.PostedDate, { locale, formateString: "D MMMM YYYY" }) }}
            </span>
            <AppButton
              :to="localePath(`/blogs/${props.blog.Slug}`)"
              color="primary"
              size="md"
              height="medium"
              class="read-more text-sm"
            >
              {{ $t("page.blog.readMore") }}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .card {
    border: none;
    background: #ffffff;
    color: #000;

    .card-body-col {
      display: flex;
      flex-direction: column;
    }

    .card__title {
      font-size: clamp(18px, 3vw, 28px);
      font-weight: bold;
    }

    @media screen and (max-width: $md) {
      .col-12 {
        padding: 0;
      }

      .card-body {
        .tags-container {
          margin: 25px 0;
        }
      }
    }

    @media screen and (min-width: $md) {
      flex-direction: row;

      .col-12:first-child {
        padding-left: 0;
      }

      .col-12:last-child {
        padding-right: 0;
      }

      .tags-container {
        margin-bottom: 10px;
      }

      .blog-content-box {
        margin-top: auto;
        margin-bottom: auto;
      }
    }

    .blog-thumb {
      height: 210px;
      position: relative;

      @media screen and (min-width: $md) {
        height: 100%;
      }
    }

    .video-overlay {
      position: absolute;
      left: 24px;
      bottom: 24px;
      z-index: 2;
      width: 54px;
      height: 54px;
      display: block;
      object-fit: cover;
      pointer-events: auto;
    }

    .card-body,
    .card-footer {
      padding-left: 0;
      padding-left: 0;
    }

    .card-footer {
      margin-top: 25px;

      .read-more {
        margin-top: 25px;
      }

      @media screen and (min-width: $md) {
        margin-top: 10px;

        .read-more {
          margin-top: 15px;
        }
      }
    }

    .card-img-top {
      border-radius: 16px !important;
      max-height: 360px;

      @media screen and (max-width: 576px) {
        max-height: 210px;
      }
    }
  }

  .card-text {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-weight: 500;
    font-size: clamp(14px, 1.25vw, 18px);

    @media screen and (min-width: $sm) {
      font-weight: 600;
    }
  }

  .card-footer {
    background: transparent;
    border: none;

    span {
      font-size: clamp(12px, 1.25vw, 16px);
      font-weight: 500;
    }
  }
</style>
