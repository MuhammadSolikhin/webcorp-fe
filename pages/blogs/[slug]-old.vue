<script setup lang="ts">
import Breadcrumb from "~/components/Blog/Breadcrumb.vue";
import type { Article } from "~/types/blog.types";
import type { AppRes } from "~/types/utils.types";
import { formatDate } from "~/utils/formatDate";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const route = useRoute("blogs-slug");
const localePath = useLocalePath();
const { locale, t } = useI18n();
const showImageModel = ref(false);
console.log('route', route);


interface ArticleRes {
	article: Article;
	recommendations: Article[];
}

const { data: blogRes, error } = await useAPI<AppRes<ArticleRes>>(
	`articles/${route.params.slug}`
);

if (error.value || !blogRes.value) {
	throw createError({ statusCode: 404, message: "Page Not Found" });
}

// ====== YOUTUBE VISIBILITY GUARD ======
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

onMounted(() => {
  hideYoutube.value = isMobileBrowser() || isAppWebView();
});
// =====================================


const article = blogRes.value.data.article;
const recommendations = blogRes.value.data.recommendations;

const filteredRecommendations = computed(() => {
	if (article.Type == "2" || article.Type == "3") {
		// Show only recommendations with Type 2 or 3 (video types)
		return recommendations.filter(r => r.Type == "2" || r.Type == "3");
	} else {
		// Show only recommendations with Type 1 or null/undefined (articles)
		return recommendations.filter(r => r.Type == "1" || r.Type == null);
	}
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
	if (show) document.body.style.overflow = "hidden";
	else document.body.style.overflow = "auto";
});
const links = computed(() => [
	{ title: t("shared.homePage"), to: localePath("/") },
	{ title: "Blog", to: localePath("/blogs") },
	{ title: t("page.blog.allArticles"), to: localePath("/blogs/all") },
]);

// --- Custom video controls ---
const videoRef = ref<HTMLVideoElement | null>(null);
const videoDuration = ref(0);
const videoCurrent = ref(0);
const isPlaying = ref(false);
const isMuted = ref(false);
const volume = ref(1);
const isFullscreen = ref(false);

// Fix: Only check browser API in onMounted (SSR safe)
let fullscreenChangeHandler: (() => void) | undefined;
let keydownHandler: ((e: KeyboardEvent) => void) | undefined;

onMounted(() => {
	// Listen for fullscreen changes (SSR safe)
	fullscreenChangeHandler = () => {
		if (videoRef.value) {
			isFullscreen.value = !!document.fullscreenElement;
			if (!isFullscreen.value) {
				videoRef.value.classList.remove("fullscreen-active");
			}
		}
	};
	document.addEventListener("fullscreenchange", fullscreenChangeHandler);

	// Listen for Escape key
	keydownHandler = (e: KeyboardEvent) => {
		if (isFullscreen.value && (e.key === "Escape" || e.key === "Esc")) {
			if (document.fullscreenElement) {
				toggleFullscreen();
			}
		}
	};
	window.addEventListener("keydown", keydownHandler);
});

onUnmounted(() => {
	if (fullscreenChangeHandler)
		document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
	if (keydownHandler) window.removeEventListener("keydown", keydownHandler);
});

// Custom PiP support
const isPiPSupported = typeof window !== "undefined" && !!document.pictureInPictureEnabled;
function togglePiP() {
	const video = videoRef.value;
	if (!video) return;
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture();
	} else {
		if (video.requestPictureInPicture) {
			video.requestPictureInPicture();
		} else {
			alert("Browser tidak mendukung Picture-in-Picture!");
		}
	}
}

function onVideoLoaded() {
	if (videoRef.value) {
		videoDuration.value = Math.floor(videoRef.value.duration);
		volume.value = videoRef.value.volume;
		isMuted.value = videoRef.value.muted;
	}
}
function onVideoTimeUpdate() {
	if (videoRef.value) {
		videoCurrent.value = Math.floor(videoRef.value.currentTime);
	}
}
function onPlay() {
	isPlaying.value = true;
}
function onPause() {
	isPlaying.value = false;
}
function onVideoSeek(e: Event) {
	if (videoRef.value && videoDuration.value) {
		const percent = +(e.target as HTMLInputElement).value;
		videoRef.value.currentTime = (percent * videoDuration.value) / 100;
	}
}
function togglePlayPause() {
	if (videoRef.value) {
		if (videoRef.value.paused) videoRef.value.play();
		else videoRef.value.pause();
	}
}
function setVolume(e: Event) {
	const val = +(e.target as HTMLInputElement).value;
	volume.value = val;
	if (videoRef.value) {
		videoRef.value.volume = val;
		isMuted.value = val === 0;
		videoRef.value.muted = val === 0;
	}
}
function toggleMute() {
	if (videoRef.value) {
		isMuted.value = !isMuted.value;
		videoRef.value.muted = isMuted.value;
		if (!isMuted.value && volume.value === 0) {
			volume.value = 0.5;
			videoRef.value.volume = 0.5;
		}
	}
}
function toggleFullscreen() {
	const videoEl = videoRef.value;
	if (!videoEl) return;
	if (!document.fullscreenElement) {
		if (videoEl.requestFullscreen) {
			videoEl.requestFullscreen();
		} else if ((videoEl as any).webkitRequestFullscreen) {
			(videoEl as any).webkitRequestFullscreen();
		}
		isFullscreen.value = true;
		videoEl.classList.add("fullscreen-active");
	} else {
		document.exitFullscreen();
		isFullscreen.value = false;
		videoEl.classList.remove("fullscreen-active");
	}
}
function toMMSS(sec: number) {
	if (!sec) return "00:00";
	const min = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function goBack() {
	if (window.history.length > 1) {
		window.history.back();
	} else {
		window.location.href = localePath('/blogs');
	}
}
</script>

<template>
	<section id="news-page-section" class="py-4">
		<div v-show="showImageModel" class="position-fixed top-0 overflow-scroll py-5"
			style="background: rgba(0, 0, 0, 0.3); height: 100vh; width: 100vw; z-index: 1020">
			<button class="btn btn-noting position-fixed text-white" style="top: 40px; right: 40px"
				@click="showImageModel = false">
				<i class="bx bx-x" style="transform: scale(3)"></i>
			</button>
			<div class="popup-content">
				<!-- image -->
				<img v-if="article.Type === '1' && article.BannerImage" :src="article.BannerImage" :alt="article.Title"
					class="d-block mx-auto image-popup" />
				<!-- video file -->
				<div v-if="article.Type === '2' && article.Video" style="position: relative">
					<video ref="videoRef" controls muted loop controlsList="nodownload noremoteplayback"
						oncontextmenu="return false;" class="d-block mx-auto image-popup" :poster="article.ThumbnailImage || ''"
						:src="article.Video"></video>
					<button v-if="isFullscreen" class="fullscreen-exit-btn" @click="toggleFullscreen"
						aria-label="Keluar dari Fullscreen">
						<i class="bx bx-x"></i>
					</button>
				</div>

				<iframe
					v-if="article.Type === '3' && article.VideoEmbed && !hideYoutube"
					:src="`https://www.youtube.com/embed/${article.VideoEmbed}?autoplay=1&mute=1&controls=1&showinfo=0`"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
					allowfullscreen
					class="d-block mx-auto image-popup"
					style="width: 100%; max-width: 600px; height: 400px">
					</iframe>

					<div
					v-else-if="article.Type === '3' && hideYoutube"
					class="text-center py-5 text-muted">
					Video YouTube tidak tersedia di perangkat ini
					</div>
			</div>
		</div>
		<div class="container">
			<div class="py-3">
				<Breadcrumb class="d-block d-lg-none mb-4" color="dark" :links="links" />
				<div>
					<AppLink back :title="$t('page.home.news.returnToNewsPage')" dir="left" class="back-link" />
				</div>
			</div>
			<template v-if="!error && blogRes">
				<div class="pt-3">
					<div v-if="article" class="row">
						<div class="col-12 col-lg-8">
							<template v-if="article.Type == '2' && article.Video">
								<div class="news-thumb mb-0" style="position: relative">
									<div class="custom-video-canvas">
										<video ref="videoRef" class="img-fluid custom-video" @loadedmetadata="onVideoLoaded"
											@timeupdate="onVideoTimeUpdate" @play="onPlay" @pause="onPause"
											:poster="article.ThumbnailImage || ''" style="background: #fff" :src="article.Video" autoplay
											muted></video>
									</div>
									<button v-if="isFullscreen" class="fullscreen-exit-btn" @click="toggleFullscreen"
										aria-label="Keluar dari Fullscreen">
										<i class="bx bx-x"></i>
									</button>
									<input type="range" class="progress-bar" min="0" max="100" :step="1"
										:value="videoDuration ? Math.floor((videoCurrent / videoDuration) * 100) : 0"
										@input="onVideoSeek" />
									<div class="custom-controls">
										<div class="controls-left">
											<button class="play-pause control-btn" @click="togglePlayPause">
												<i v-if="!isPlaying" class="bx bx-play-circle me-1"></i>
												<i v-else class="bx bx-pause-circle me-1"></i>
											</button>
											<span class="time">
												<span class="current-time">{{ toMMSS(videoCurrent) }}</span>
												<span class="divider"> / </span>
												<span class="total-time">{{ toMMSS(videoDuration) }}</span>
											</span>
										</div>
										<div class="controls-right">
											<button class="mute control-btn" @click="toggleMute">
												<i v-if="isMuted || volume === 0" class="bx bx-volume-mute me-1"></i>
												<i v-else class="bx bx-volume me-1"></i>
											</button>
											<input type="range" class="volume-bar" min="0" max="1" step="0.01" :value="volume"
												@input="setVolume" />
											<button v-if="isPiPSupported" class="pip control-btn" @click="togglePiP"
												title="Picture-in-Picture">
												<i class="bx bx-window me-1"></i>
											</button>
											<button class="fullscreen control-btn" @click="toggleFullscreen">
												<i v-if="!isFullscreen" class="bx bx-fullscreen me-1"></i>
												<i v-else class="bx bx-home-max me-1"></i>
											</button>
										</div>
									</div>
								</div>
								<div class="news-title-block news-title-video">
									<h3 class="news-title" v-html="article.Title"></h3>
									<div class="news-subtitle fw-medium">
										<span>{{ article.Author }}</span>
										<span style="color: #828282" class="mx-2">|</span>
										<span>
											{{
												formatDate(article.PostedDate, {
													locale: locale as "id" | "en",
													formateString: "D MMMM YYYY",
												})
											}}
										</span>
									</div>
								</div>
							</template>
							<template v-else-if="article.Type == '3' && article.VideoEmbed">
								<div class="news-thumb mb-0">
									<iframe class="w-100 img-fluid custom-video"
										:src="`https://www.youtube.com/embed/${article.VideoEmbed}?controls=1&showinfo=0&autoplay=1&mute=1`"
										frameborder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowfullscreen style="background: #eaf5ef"></iframe>
								</div>
								<div class="news-title-block news-title-video">
									<h3 class="news-title" v-html="article.Title"></h3>
									<div class="news-subtitle fw-medium">
										<span>{{ article.Author }}</span>
										<span style="color: #828282" class="mx-2">|</span>
										<span>
											{{
												formatDate(article.PostedDate, {
													locale: locale as "id" | "en",
													formateString: "D MMMM YYYY",
												})
											}}
										</span>
									</div>
								</div>
							</template>
							<template v-else-if="article.Type == '1' || (article.Type == null && article.BannerImage)">
								<div class="news-title-block">
									<h3 class="news-title" v-html="article.Title"></h3>
									<div class="news-subtitle fw-medium">
										<span>{{ article.Author }}</span>
										<span style="color: #828282" class="mx-2">|</span>
										<span>
											{{
												formatDate(article.PostedDate, {
													locale: locale as "id" | "en",
													formateString: "D MMMM YYYY",
												})
											}}
										</span>
									</div>
								</div>
								<div class="news-thumb">
									<img class="w-100 img-fluid" :alt="article.Title" :src="article.BannerImage" />
								</div>
							</template>
							<div class="mt-3 d-block news-content" v-html="sanitizeProductContent(article.Content)"></div>
							<div v-if="article.Footer" class="news-content mt-4" v-html="sanitizeProductContent(article.Footer)">
							</div>
							<ClientOnly>
								<AppSocialMediaSharer :shareTitle="!article.Type || article.Type === '1' ? 'Suka artikel ini?' : 'Suka video ini?'
									" />
							</ClientOnly>
						</div>
						<div v-if="recommendations.length > 0" class="col-12 col-lg-4 blog-recommendations">
							<h3 class="recommendations-title">{{ $t("page.blog.otherArticles") }}</h3>
							<div class="row gap-4 w-100 mx-auto blog-recommendation-body">
								<BlogRecommendation v-for="(recommendation, index) in filteredRecommendations" :key="index" :blog="{
									Title: recommendation.Title,
									Summary: recommendation.Content,
									to: localePath(`/blogs/${recommendation.Slug}`),
									Type: recommendation.Type,
									ThumbnailImage: recommendation.ThumbnailImage,
								}" />
							</div>
							<div class="d-flex">
								<AppLink class="button button-primary-outline w-100 fw-bold read-more" :title="$t('page.blog.alsoRead')"
									:to="localePath({ path: '/blogs/all', query: { page: 1 } })" />
							</div>
						</div>
						<div v-else class="col-12 col-lg-4 blog-recommendations">
							<h3 class="recommendations-title">{{ $t("page.blog.otherArticles") }}</h3>
							<div class="row w-100 mx-auto blog-recommendation-body text-center py-4">
								<span>Data tidak tersedia</span>
							</div>
							<div class="d-flex">
								<AppLink class="button button-primary-outline w-100 fw-bold read-more" :title="$t('page.blog.alsoRead')"
									:to="localePath({ path: '/blogs/all', query: { page: 1 } })" />
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</section>
</template>

<!-- styles unchanged -->

<style lang="scss">
#news-page-section {
	#blog-content img {
		width: 100%;
		display: inline-block;
	}

	.news-content {
		word-break: break-word;
		overflow-wrap: break-word;
		white-space: pre-line;
		max-width: 100%;
		margin-bottom: 32px;

		* {
			max-width: 100%;
			box-sizing: border-box;
		}

		table,
		img,
		pre,
		code {
			max-width: 100%;
			overflow-x: auto;
		}
	}

	.news-content>p {
		margin: 1.5rem 0 !important;
		color: #000;
		font-weight: 500;
	}

	.news-content * {
		font-family: "Open Sans", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
			Roboto, "Helvetica Neue", Arial, sans-serif !important;
	}

	.read-more {
		font-size: 0.9rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;

		svg {
			width: 16px;
			height: 16px;
		}
	}
}
</style>
<style lang="scss" scoped>
.image-popup {
	max-height: 100vh;
	max-width: 100vh;
}

.back-link {
	color: $primary;
	gap: 15px;
}

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
	}

	.card-action {
		margin-top: 25px;
	}
}

.news-title-block {
	padding-bottom: 24px;
	margin-bottom: 36px;
	border-bottom: 1px solid #e6e6e6;

	@media screen and (max-width: 576px) {
		padding: 0;
		border: 0;
		margin-bottom: 24px;
	}

	.news-title {
		text-align: center;
		font-weight: 700;
		margin-bottom: 16px;

		@media screen and (max-width: 576px) {
			margin-bottom: 8px;
		}
	}

	.news-subtitle {
		text-align: center;
		font-size: 16px;
		margin: 0;

		span {
			font-size: 16px;
			line-height: 24px;
			color: #000;
		}
	}
}

.news-title-video {

	.news-title,
	.news-subtitle {
		text-align: left !important;
	}
}

.news-thumb {
	// max-height: 40vw;
	cursor: pointer;
	overflow: hidden;
	margin-bottom: 0;

	img,
	iframe,
	.custom-video,
	.custom-video-canvas {
		height: 498px;

		@media screen and (max-width: 768px) {
			height: 320px;
		}

		@media screen and (max-width: 576px) {
			height: 210px;
		}
	}
}

.custom-video-canvas {
	height: 480px;
	display: block;
	background-color: #000;
	margin: 0 auto !important;
}

/* Tambahan style custom video controls */
.custom-video {
	display: block;
	object-fit: contain;
	height: 100% !important;
	width: auto;
	margin: 0 auto !important;
}

.fullscreen-active {
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	width: 100vw !important;
	height: 100vh !important;
	max-width: 100vw !important;
	max-height: 100vh !important;
	z-index: 9999 !important;
	object-fit: contain !important;
	background: #000 !important;
}

/* ADD THIS FOR THE EXIT BUTTON */
.fullscreen-exit-btn {
	position: fixed;
	top: 32px;
	right: 32px;
	z-index: 10010;
	background: rgba(0, 0, 0, 0.7);
	color: #fff;
	border: none;
	border-radius: 50%;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 2rem;
	transition: background 0.2s;
}

.fullscreen-exit-btn:hover {
	background: rgba(0, 0, 0, 0.9);
}

.progress-bar {
	display: block;
	width: 100%;
	accent-color: #d45214;
	height: 8px;
	background: #fff;
	border-radius: 100px;

	@media screen and (max-width: 576px) {
		height: 4px;
	}
}

.custom-controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #f3f3f3;
	padding: 20px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
	margin-bottom: 24px;
	margin-top: 0;

	@media screen and (max-width: 576px) {
		padding: 12px 16px;
	}
}

.controls-left,
.controls-right {
	display: flex;
	align-items: center;
}

.time {
	font-size: 16px;
	line-height: 24px;
	color: #555;
	min-width: 80px;

	@media screen and (max-width: 576px) {
		font-size: 12px;
		line-height: 18px;
	}
}

.current-time {
	color: #000;
}

.divider {
	color: #b4b4b4;
}

.total-time {
	color: #b4b4b4;
}

.control-btn {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
}

.control-btn i {
	color: #00697f;
	font-size: 20px;
	line-height: 1;
	margin-right: 12px;

	@media screen and (max-width: 576px) {
		font-size: 14px;
		line-height: 1;
	}
}

.volume-bar {
	width: 80px;
	accent-color: #00697f;
	margin: 0 4px;
	background-color: #c1e0e7;

	@media screen and (max-width: 576px) {
		width: 60px;
		height: 4px;
	}
}

.pip {
	margin-left: 4px;
}

.pip i {
	font-size: 20px;
	line-height: 1;

	@media screen and (max-width: 576px) {
		font-size: 14px;
		line-height: 1;
	}
}

.fullscreen {
	margin-left: 4px;
}

.play-pause {
	color: #00697f;
	font-size: 16px;
	line-height: 24px;
}

.play-pause[disabled],
.mute[disabled],
.fullscreen[disabled] {
	opacity: 0.5;
	cursor: not-allowed;
}

.blog-recommendation-body {
	margin-bottom: 36px;
}

.recommendations-title {
	font-size: 18px;
	line-height: 28px;
	font-weight: bold;
	margin-bottom: 36px;
}

.quality-selector {
	display: flex;
	align-items: center;
	margin-bottom: 0;
	margin-right: 8px;
	border-radius: 8px;
	z-index: 10;
	font-size: 16px;

	& label {
		font-size: 16px;
		line-height: 24px;
		color: #000;
		margin-right: 4px !important;

		@media screen and (max-width: 991.98px) {
			display: none;
		}
	}

	& select {
		border: 0;
		background-color: transparent;
		font-size: 16px;
		line-height: 24px;
		color: #000;
		margin-right: 0 !important;

		@media screen and (max-width: 576px) {
			font-size: 12px !important;
			line-height: 18px !important;
		}
	}
}
</style>