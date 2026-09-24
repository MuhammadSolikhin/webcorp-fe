<script setup lang="ts">
import { computed } from "vue";

const device = useDevice();

const props = defineProps<{
  blog: {
    Title: string;
    Summary: string;
    to: any;
    ThumbnailImage: string;
    VideoDuration: string;
    Type: string | number;
  };
}>();

const blogType = computed(() => Number(props.blog.Type));

const showVideoThumb = computed(() => {
  if (blogType.value === 1 || isNaN(blogType.value)) return false;
  if (blogType.value === 3 && device.isMobile) return false;
  return true;
});
</script>

<template>
  <div class="card text-start overflow-hidden recommendations">
    <nuxt-link class="text-decoration-none article-link" :to="blog.to">
      {{ blog.Title }}
    </nuxt-link>

    <div
      v-if="showVideoThumb"
      class="card-thumb"
      style="height: 210px; position: relative"
    >
      <nuxt-img
        :src="blog.ThumbnailImage"
        class="card-img-top object-fit-cover w-100 h-100"
        alt="Thumbnail"
      />
      <div class="video-overlay">
        <img
          src="/images/button-play.svg"
          alt="Play"
          class="play-btn"
          aria-label="Play Video"
        />
      </div>
    </div>

    <div class="card-body d-flex flex-column gap-2">
      <h3 class="card-title">
        {{ blog.Title }}
      </h3>
      <div class="summary fw-medium" v-html="removeFontFamily(blog.Summary)"></div>
      <div class="d-flex justify-content-end">
        <AppLink :title="$t('shared.fullRead')" :to="blog.to" class="card-link" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.recommendations {
  .card-link {
    svg {
      width: 16px !important;
      height: 16px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.card {
  border: none;
  border-radius: 24px;
  color: #000;
  padding: 0;
  border: 1px solid var(--grey-text-icon-lighter-grey-50, #e6e6e6);
  transition: box-shadow 0.8s cubic-bezier(0, 0.74, 0.47, 1.06);

  &:hover {
    box-shadow: 0px 15px 35px 0px rgba(51, 51, 51, 0.18);
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

  .video-time {
    position: absolute;
    right: 12px;
    bottom: 8px;
    background-color: #686868;
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    padding: 4px 8px;
    border-radius: 8px;
    z-index: 2;
    margin: 0;
  }
}

.card-body {
  padding: 12px 16px 20px;

  .card-title {
    font-weight: 700;
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-link {
    font-size: 12px;
    color: $primary;
  }

  .summary {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-weight: 500 !important;
    font-size: clamp(14px, 3vw, 16px);
    max-height: 54px;
    color: #686868;
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
</style>