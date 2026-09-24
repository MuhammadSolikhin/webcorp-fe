<template>
  <div class="video-wrapper" @click="onWrapperClick">
    <video
      ref="videoRef"
      class="video-js vjs-default-skin vjs-big-play-centered custom-player"
      playsinline
      muted
    ></video>

    <div
      v-show="showMenu"
      class="quality-menu"
      @click.stop
    >
      <div
        class="quality-item"
        v-for="(q, i) in qualityList"
        :key="i"
        @click="setQuality(i)"
      >
        {{ q.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: "" },
});

const videoRef = ref<HTMLVideoElement | null>(null);
let player: any = null;

const showMenu = ref(false);
const qualityList = ref<
  { index: number; width?: number; height?: number; bitrate?: number; label: string }[]
>([]);
let levels: any = null;

function setQuality(i: number) {
  if (!levels) {
    console.warn("[Quality] levels not ready");
    return;
  }

  for (let x = 0; x < levels.length; x++) {
    levels[x].enabled = x === i;
  }

  const q = qualityList.value[i];
  const real = levels[i];

  console.log("======= QUALITY SWITCH =======");
  console.log("UI Label      :", q.label);
  console.log("Real Width    :", real.width);
  console.log("Real Height   :", real.height);
  console.log("Real P        :", `${real.height}p`);
  console.log("Real Bitrate  :", Math.round((real.bitrate || 0) / 1000), "kbps");
  console.log("Level Index   :", i);
  console.log("==========================================");

  showMenu.value = false;
}

function createQualityButtonDom() {
  const controlBarEl = player?.controlBar?.el?.();
  if (!controlBarEl) return;

  const btn = document.createElement("button");
  btn.className = "vjs-control vjs-button vjs-quality-button";
  btn.type = "button";
  btn.title = "Quality";
  btn.innerText = "Quality";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showMenu.value = !showMenu.value;
    console.log("[UI] Quality button clicked. showMenu =", showMenu.value);
  });

  const fullscreenBtn = controlBarEl.querySelector(".vjs-fullscreen-control");
  if (fullscreenBtn?.parentNode) {
    fullscreenBtn.parentNode.insertBefore(btn, fullscreenBtn);
  } else {
    controlBarEl.appendChild(btn);
  }

  console.log("[UI] Quality button injected into control bar");
}

function onWrapperClick() {
  if (showMenu.value) {
    showMenu.value = false;
    console.log("[UI] Wrapper click, close quality menu");
  }
}

onMounted(() => {
  if (!videoRef.value) return;

  console.log("[VideoJS] init player");

  player = videojs(videoRef.value, {
    muted: true,
    controls: true,
    preload: "auto",
    fluid: false,
    responsive: false,
    poster: props.poster,
    sources: [
      {
        src: props.src,
        type: props.src.endsWith(".m3u8")
          ? "application/x-mpegURL"
          : "video/mp4",
      },
    ],
  });

  player.on("ready", () => {
    console.log("[VideoJS] ready");
    createQualityButtonDom();
  });

  player.on("loadedmetadata", () => {
    console.log("[VideoJS] loadedmetadata");

    if (!props.src.endsWith(".m3u8")) {
      console.log("[Quality] not HLS source, skip qualityLevels");
      return;
    }

    levels = player.qualityLevels();
    qualityList.value = [];

    const FIXED_LABELS = ["720p", "480p", "360p"];

    console.log("======= ALL QUALITY LEVELS (REAL) =======");

    for (let i = 0; i < levels.length; i++) {
      qualityList.value.push({
        index: i,
        width: levels[i].width,
        height: levels[i].height,
        bitrate: levels[i].bitrate,
        label: FIXED_LABELS[i] || "Auto",
      });

      console.log({
        index: i,
        width: levels[i].width,
        height: levels[i].height,
        realP: `${levels[i].height}p`,
        bitrate: Math.round((levels[i].bitrate || 0) / 1000) + " kbps",
      });
    }

    console.log("=========================================");
  });

  player.on("fullscreenchange", () => {
    const menu = document.querySelector(".quality-menu") as HTMLElement;
    const vjsRoot = player.el();
    const wrapper = document.querySelector(".video-wrapper");

    console.log("[VideoJS] fullscreenchange:", player.isFullscreen());

    if (!menu || !vjsRoot || !wrapper) {
      console.warn("[Fullscreen] menu/root/wrapper not found");
      return;
    }

    if (player.isFullscreen()) {
      vjsRoot.appendChild(menu);
      menu.style.position = "absolute";
      menu.style.bottom = "70px";
      menu.style.right = "20px";
      menu.style.zIndex = "9999";
      console.log("[Fullscreen] menu moved to videojs root");
    } else {
      wrapper.appendChild(menu);
      menu.style.position = "absolute";
      menu.style.bottom = "60px";
      menu.style.right = "20px";
      menu.style.zIndex = "1000";
      console.log("[Fullscreen] menu moved back to wrapper");
    }
  });

  player.on("userinactive", () => {
    if (showMenu.value) {
      player.userActive(true);
      console.log("[VideoJS] userinactive ignored, menu still open");
    }
  });

  player.on("error", () => {
    console.error("[VideoJS ERROR]", player?.error());
  });
});

onBeforeUnmount(() => {
  if (player) {
    console.log("[VideoJS] dispose player");
    player.dispose();
    player = null;
  }
});
</script>

<style scoped>
.video-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
}

.video-wrapper .video-js,
.video-wrapper .custom-player {
  width: 100% !important;
  height: 100% !important;
}

.video-wrapper .vjs-tech {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

.vjs-control-bar {
  background: rgba(0, 0, 0, 0.45) !important;
}

.vjs-quality-button {
  color: white !important;
  font-size: 13px;
  margin-left: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.quality-menu {
  position: absolute;
  bottom: 60px;
  right: 20px;
  background: rgba(0, 0, 0, 0.95);
  padding: 6px 0;
  border-radius: 6px;
  width: 110px;
  z-index: 1000;
}

.quality-item {
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
}

.quality-item:hover {
  background: rgba(255, 255, 255, 0.06);
}
</style>