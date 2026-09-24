<script lang="ts" setup>
  import VueViewer, { component as VViewer } from "v-viewer";

  const props = defineProps<{
    imageUrl: string;
  }>();
  VueViewer.setDefaults({
    zIndexInline: 0,
    backdrop: false,
    minWidth: 100,
    minHeight: 100,
  });
  let $viewer: Viewer;

  class ImageData {
    thumbnail: string;
    source: string;
    title: string;

    constructor(source: string, thumbnail: string, title: string) {
      this.source = source;
      this.thumbnail = thumbnail;
      this.title = title;
    }
  }

  const sourceImages: ImageData = new ImageData(
    props.imageUrl,
    props.imageUrl,
    "Organization Structure"
  );

  const state = reactive({
    form: {
      zoom: -0.1,
    },
    options: {
      inline: true,
      button: true,
      navbar: false,
      title: false,
      toolbar: false,
      tooltip: false,
      movable: true,
      zoomable: true,
      rotatable: false,
      scalable: true,
      transition: true,
      fullscreen: true,
      keyboard: true,
      url: "data-source",
    },
    images: [sourceImages],
  });

  function inited(viewer: Viewer) {
    $viewer = viewer;
  }
  function zoom(value: number) {
    $viewer.zoom(value || state.form.zoom);
  }

  function reset() {
    $viewer.reset();
  }
</script>

<template>
  <div
    class="d-none d-lg-flex col-lg-3 organization-structure-control justify-content-end flex-column"
  >
    <p class="d-flex w-100 align-items-center">
      <img src="/icons/pinch_zoom_out.svg" class="me-1" style="width: 30px; height: 30px" />
      <span class="text-sm">{{ $t("page.aboutUs.aboutUs.organizationStructureSlide") }}</span>
    </p>
    <div class="w-100 d-flex justify-content-between mt-2">
      <button type="button" class="" @click="zoom(0.5)">
        <span>
          <i class="bx bx-zoom-in"></i>
        </span>
        <span>Zoom In</span>
      </button>
      <button type="button" class="" @click="zoom(-0.5)">
        <span><i class="bx bx-zoom-out"></i></span>
        <span>Zoom Out</span>
      </button>
      <button type="button" class="" @click="reset">
        <span><i class="bx bx-reset"></i></span>
        <span>Reset</span>
      </button>
    </div>
  </div>
  <div class="col-12 col-lg-9 organization-structure-viewer">
    <ClientOnly>
      <VViewer
        ref="viewer"
        :options="state.options"
        :images="state.images"
        rebuild
        class="viewer"
        @inited="inited"
      >
        <template #default="scope">
          <figure class="images">
            <div
              v-for="{ source, thumbnail, title } in scope.images"
              :key="source"
              class="image-wrapper"
            >
              <img style="visibility: hidden" :src="thumbnail" :data-source="source" :alt="title" />
            </div>
          </figure>
        </template>
      </VViewer>
    </ClientOnly>
  </div>
  <div class="col-12 d-block d-lg-none">
    <p class="d-flex w-100 align-items-center">
      <img src="/icons/pinch_zoom_out.svg" class="me-2" style="width: 30px; height: 30px" />
      <span class="text-md">{{ $t("page.aboutUs.aboutUs.organizationStructureSlide") }}</span>
    </p>
  </div>
</template>

<style>
  .viewer-fullscreen {
    display: none;
  }
</style>

<style lang="scss" scoped>
  .organization-structure-control {
    background-color: #f3f3f3;
    padding: 20px 20px;
    @media screen and (min-width: $lg) {
      height: 100%;
    }

    button {
      padding: 4px;
      background: white;
      color: $primary;
      font-weight: 500;
      font-size: 14px;
      border-radius: 16px;
      border: none;
      width: 75px;
      height: 75px;
      span {
        display: block;
        width: 100%;
        i {
          font-size: 26px;
        }
      }
    }
  }
  .organization-structure-viewer {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    img {
      height: 300px;
    }
    @media screen and (min-width: $lg) {
      img {
        height: 100%;
      }
      padding: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
