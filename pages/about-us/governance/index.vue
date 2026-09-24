<script setup lang="ts">
import type { GovernanceCategoryRes } from "~/types/governance.types";

// Accessing the current route and locale information
const route = useRoute();
const { locale } = useI18n();
const { apiUrl } = useRuntimeConfig().public;
const localePath = useLocalePath();

// State to manage the current page number, defaulting to 1 if not specified in the query
const pageNumber = useState(() => (route.query.page ? +(route.query.page as string) : 1));

// Fetching product metadata related to governance
const { products, banner, links } = await useProductMeta("governance/governance");

// Fetching governance category data asynchronously
const {
	data: categoryRes,
	status: categoryStatus,
} = await useAsyncData<GovernanceCategoryRes>(
	"governance-category",
	() => {
		// Constructing the API URL for fetching governance categories
		const urlPath = `${apiUrl}/${locale.value}/v2/governance-category?limit=6&page=${pageNumber.value}`;
		return $fetch(urlPath);
	},
	{ watch: [() => pageNumber.value] }
);

// Setting SEO metadata for the page based on the fetched banner data
useAppSeo({
	title: banner.value.bannerTitle,
	ogTitle: banner.value.bannerTitle,
	ogImage: banner.value.backgroundImage,
	ogUrl: localePath("/about-us/governance"),
});

// Lifecycle hook to handle navigation when the component is mounted
onMounted(() => {
	// Check if the page query parameter is not set
	if (!route.query.page) {
		navigateTo({
			query: { ...route.query, page: 1 },
		});
	}
});
</script>

<template>
	<AppHero v-if="banner" :background-image="banner.backgroundImage" :banner-text="banner.bannerTitle"
		:banner-title="products[0].Title" :links="links" />
	<section class="home-page-section-padding overflow-hidden">
		<div class="container">
			<div v-if="categoryRes && categoryRes.data.length > 0" id="governance-list" class="governance__row">
				<div v-for="(category, index) in categoryRes?.data" :key="index" class="governance-card">
					<div class="governance-card__box">
						<a :href="localePath(`/about-us/governance/${category.Slug}?title=${encodeURIComponent(category.Title)}`)"
							class="governance-card__link">{{
								category.Title
							}}</a>
						<div class="governance-card__img">
							<nuxt-img :src=category.Icon class="governance-card__img__icon" :alt=category.Title :quality="80" />
							<img class="governance-card__img__bg" src="/public/icons/dot-fade-scales-right.svg" alt="dots">
						</div>
						<div class="governance-card__text">
							<h3 class="governance-card__title" v-html="category.Title"></h3>
							<p class="governance-card__desc" v-html="category.Description"></p>
						</div>
					</div>
				</div>
			</div>
			<!-- pagination -->
			<div v-if="categoryRes && categoryRes.data.length" class="w-100 d-flex justify-content-center">
				<BlogPagination :current-page="categoryRes.meta.current_page" :page-limit="categoryRes.meta.per_page"
					:total-items="categoryRes.meta.total" :scroll-to-top="{
						elementId: '#governance-list',
						scroll: categoryStatus === 'success',
						space: 100,
					}" @update:pagination="p => (pageNumber = p)" />
			</div>
			<p v-else class="py-3 text-center fw-bold">{{ $t("shared.noDataFound") }}</p>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.governance {
	&__row {
		display: flex;
		flex-wrap: wrap;
		margin: -32px 16px 32px;

		@media only screen and (max-width: 767.98px) {
			margin: -16px -8px 16px;

		}

		@media only screen and (max-width: 479.98px) {
			margin: 0 0 32px;
		}
	}

	&-card {
		$gc: &;
		flex: 0 0 auto;
		width: 33.33333333%;
		padding: 32px 16px;

		@media only screen and (max-width: 991.98px) {
			width: 50%;
		}

		@media only screen and (max-width: 767.98px) {
			padding: 16px 8px;
		}

		@media only screen and (max-width: 479.98px) {
			width: 100%;
			padding: 0;
			margin-bottom: 16px;

			&:last-child {
				margin-bottom: 0;
			}
		}

		&__box {
			position: relative;
			display: flex;
			flex-direction: column;
			height: 100%;
			border-radius: 24px;
			overflow: hidden;
			box-shadow: 0px 15px 35px 0px rgba(0, 0, 0, 0.05);
			transition: all .3s ease;

			&:hover {
				#{$gc} {
					&__title {
						color: $secondary;
					}
				}
			}
		}

		&__link {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		&__img {
			position: relative;
			display: flex;
			align-items: flex-start;
			justify-content: flex-end;
			background-color: $secondary;

			&__icon {
				position: absolute;
				top: 40px;
				left: 40px;
				display: block;
				width: 80px;
				height: 80px;
				object-fit: contain;

				@media only screen and (max-width: 991.98px) {
					width: 64px;
					height: 64px;
				}

				@media only screen and (max-width: 767.98px) {
					width: 48px;
					height: 48px;
					top: 24px;
					left: 24px;
				}

				@media only screen and (max-width: 479.98px) {
					width: 40px;
					height: 40px;
					top: 16px;
					left: 16px;
				}
			}

			&__bg {
				display: block;
				width: 50%;
				height: auto;
				object-fit: contain;
			}
		}

		&__text {
			padding: 16px;
		}

		&__title {
			font-size: 24px;
			font-weight: 700;
			color: $black;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			transition: all .3s ease;

			@media only screen and (max-width: 767.98px) {
				font-size: 20px;
			}

			@media only screen and (max-width: 479.98px) {
				font-size: 16px;
			}
		}

		&__desc {
			overflow: hidden;
			display: block;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;

			@media only screen and (max-width: 479.98px) {
				font-size: 14px;
			}
		}
	}
}
</style>
