<script setup lang="ts">
import { ref, onMounted } from "vue";
import { snip } from "js-snip";
import { Article } from "~/types/blog.types";

const el = ref();

const localePath = useLocalePath();

interface Props {
  blog: Article;
  showThumb: boolean;
  border: boolean;
  slugPrefix: string;
  shadow: boolean;
}

const { locale } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  showThumb: true,
  border: true,
  shadow: true,
  slugPrefix: "",
});


function isAppWebView(): boolean {
  const ua = navigator.userAgent || "";
  const isAndroidWebView = /\bwv\b/.test(ua);
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/.test(ua);
  return isAndroidWebView || isIOSWebView;
}

const hideVideoCard = ref(false);


onMounted(() => {
  if (isAppWebView() && props.blog.Type == "3") {
    hideVideoCard.value = true;
  }

  if (el.value && typeof props.blog.Content === "string" && props.blog.Content) {
    
    snip(el.value, { lines: 3, mode: "css" }, () => {
      
      if (el.value) el.value.innerHTML = props.blog.Content;
    });
  }
});
</script>

<template>
  <div
    v-if="!hideVideoCard"
    class="card overflow-hidden h-100"
    :class="[props.border ? 'rounded-24' : 'border-0', props.shadow ? 'hover-effect' : '']"
  >
    <nuxt-link
      class="text-decoration-none article-link"
      :to="localePath(`${props.slugPrefix || ''}/${props.blog.Slug}`)"
    >
      {{ props.blog.Title }}
    </nuxt-link>

    <!-- Thumbnail -->
    <div
      v-if="props.showThumb && props.blog.ThumbnailImage"
      class="card-thumb"
      style="height: 210px; position: relative"
    >
      <nuxt-img
        :src="props.blog.ThumbnailImage"
        class="card-img-top object-fit-cover w-100 h-100"
        alt="Thumbnail"
      />
      <!-- Show play icon for video (Type 2 or 3) -->
      <div v-if="props.blog.Type == '2' || props.blog.Type == '3'" class="video-overlay">
        <img src="/images/button-play.svg" alt="Play" class="play-btn" aria-label="Play Video" />
      </div>
    </div>

    <div class="card-body d-flex flex-column row-gap-2" :class="!props.border && 'px-0'">
      <!-- Tags -->
      <div class="mb-3" v-if="props.blog.Tags && props.blog.Tags.length">
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
      </div>

      <!-- Title -->
      <AppTitle color="black" :size="null" class="card__title">
        <!-- <nuxt-link
          class="text-decoration-none"
          :to="localePath(`${props.slugPrefix || ''}/${props.blog.Slug}`)"
        >
			</nuxt-link> -->
        {{ props.blog.Title }}
      </AppTitle>

      <!-- Hidden SEO content -->
      <div class="d-none" v-html="props.blog.Content"></div>

      <!-- Snipped content -->
      <div ref="el" class="card-text fw-medium"></div>
    </div>

    <div class="card-footer" :class="!props.border && 'px-0'">
      <span class="d-block">
        by {{ props.blog.Author }}
        <span style="color: #828282" class="mx-2">|</span>
        {{ formatDate(props.blog.PostedDate, { locale, formateString: "D MMMM YYYY" }) }}
      </span>
      <div class="card-action">
        <slot name="action"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border: 2px solid #e6e6e6;
  background: #ffffff;
  color: #000;

  &.hover-effect {
    transition: box-shadow 0.8s cubic-bezier(0, 0.74, 0.47, 1.06);

    &:hover {
      box-shadow: 0px 15px 35px 0px rgba(51, 51, 51, 0.18);
    }
  }

  .card-body,
  .card-footer {
    padding: 1rem;
  }

  &__title {
    font-size: clamp(18px, 1.45vw, 24px) !important;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-action {
    margin-top: 25px;
  }
}

.article-link {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
}

.rounded-24 {
  border-radius: 24px !important;
}

.card-thumb {
  position: relative;

  .card-img-top {
    // border-radius: 24px 24px 0 0;
  }

  .play-btn {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 2;
    width: 54px;
    height: 54px;
    display: block;
    object-fit: cover;
    pointer-events: auto;
  }
}

.card-tag {
  color: #005466;
  background: #e9f7fa;
  font-size: 0.9rem;
}

.card-text {
  max-height: 96px;
  font-weight: 500 !important;
  font-size: clamp(14px, 3vw, 16px);
  color: #686868;

  @media screen and (max-width: $sm) {
    font-weight: 500;
  }
}

.card-footer {
  background: transparent;
  color: black;
  border: none;
  font-weight: 500;
  font-size: 14px;
}
</style>