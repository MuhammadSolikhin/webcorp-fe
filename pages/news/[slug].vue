<template>
	<section id="news-page-section" class="py-4">
		<div v-show="showImageModel" class="position-fixed top-0 overflow-scroll py-5"
			style="background: rgba(0, 0, 0, 0.3); height: 100vh; width: 100vw; z-index: 1020">
			<button class="btn btn-noting position-fixed text-white" style="top: 40px; right: 40px"
				@click="showImageModel = false">
				<i class="bx bx-x" style="transform: scale(3)"></i>
			</button>
			<img :src="newsData.BannerImage" class="d-block mx-auto image-popup" />
		</div>
		<div class="container">
			<!-- breadcrumbs -->
			<div class="py-3">
				<BlogBreadcrumb class="d-block d-lg-none" color="dark" :links="links" />
				<div class="d-none d-lg-block">
					<AppLink :to="localePath('/news')" :title="$t('page.home.news.returnToNewsPage')" dir="left"
						class="back-link" />
				</div>
			</div>
			<!-- blog content -->
			<template v-if="!error && newsData">
				<div class="pt-3">
					<div v-if="newsData" class="row">
						<div class="col-12 col-md-8">
							<div class="news-title-block">
								<h3 class="news-title" v-html="newsData.Title"></h3>
								<div class="news-subtitle fw-medium">{{ newsData.SubTitle }}</div>
							</div>
							<div class="news-thumb" @click="showImageModel = true">
								<img alt="blog image" :src="newsData.BannerImage" />
							</div>

							<div class="mt-3 d-block news-content" v-html="sanitizeProductContent(newsData.Content)"></div>

							<div v-if="newsData.Footer" class="news-content" v-html="sanitizeProductContent(newsData.Footer)"></div>
							<ClientOnly>
								<AppSocialMediaSharer />
							</ClientOnly>
						</div>
						<div v-if="recommendations.length > 0" class="py-4 col-12 col-md-4 blog-recommendations">
							<h3 class="recommendations-title">{{ $t("page.blog.otherArticles") }}</h3>
							<div>
								<div class="row gap-4 w-100 mx-auto blog-recommendation">
									<BlogRecommendation v-for="(recommendation, index) in recommendations" :key="index"
										:blog="{ ...recommendation, to: localePath(`/news/${recommendation.Slug}`) }" />
								</div>
								<div class="d-flex">
									<AppLink class="button button-primary-outline w-100 fw-bold read-more"
										:title="$t('page.blog.alsoRead')" :to="localePath('/news')" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { AppRes } from "~/types/utils.types";
import type { NewsBlog, RecommendationNews } from "~/types/news.types";

interface NewsRes {
	blog: NewsBlog;
	recommendations: RecommendationNews[];
}

const route = useRoute("news-slug");
const localePath = useLocalePath();
const { locale, t } = useI18n();
const { apiUrl } = useRuntimeConfig().public;
const showImageModel = ref(false);

const { data: newsRes, error } = await useFetch<AppRes<NewsRes>>(
	`${apiUrl}/${locale.value}/blogs/${route.params.slug}`
);
if (error.value || !newsRes.value) {
	throw createError({ statusCode: 404, message: "Page Not Found" });
}

const newsData = newsRes.value.data.blog;
const recommendations = newsRes.value.data.recommendations;

useAppSeo({
	title: newsData.Title,
	description: newsData.Title,
	ogTitle: newsData.Title,
	ogUrl: localePath(`/news/${newsData.Slug}`),
	ogImage: newsData.BannerImage,
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
	{ title: t("page.aboutUs.news.title"), to: localePath("/news") },
	{ title: t("page.aboutUs.news.article"), to: localePath(newsData.Slug) },
]);
</script>

<style lang="scss">
#news-page-section {
	#blog-content img {
		width: 100%;
		display: inline-block;
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
.recommendations-title {
  margin-bottom: 20px !important;
}

.blog-recommendation.row,
.blog-recommendation .row {
  row-gap: 12px !important;
}

.blog-recommendation + .d-flex {
  margin-top: 20px !important;
}


.news-thumb {
	width: 100%;
	height: auto;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	cursor: pointer;
	background-color: #f8f9fa;
	/* Optional background color for better loading display */
}

/* Ensure Banner Image Maintains Aspect Ratio */
.news-thumb img {
	width: 100%;
	height: auto;
	object-fit: contain;
	/* Prevent cropping of the image */
	display: block;
}

/* Popup Fullscreen Image Styling */
.image-popup {
	max-height: 100vh;
	max-width: 100vw;
	object-fit: contain;
	/* Ensure no part of the image is cropped in the popup */
	display: block;
}

/* Responsive Adjustments */
@media screen and (max-width: 768px) {
	.news-thumb img {
		width: 100%;
		height: auto;
	}
}
</style>