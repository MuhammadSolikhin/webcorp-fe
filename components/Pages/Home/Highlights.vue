<script setup lang="ts">
import { ref, inject, computed } from "vue";
import type { ParameterSettings } from "~/types/parameter-settings.types";
import type { HighlightRes } from "~/types/highlight.types";

const parameterSettings = inject<ParameterSettings>("parameter-settings")!;
const localePath = useLocalePath();

// Ambil data dari API
const { data: highlightRes } = await useAPI<HighlightRes>("highlight");

// Filter hanya highlight yang memiliki List dengan isi
const filteredHighlights = computed(() => {
  return (
    highlightRes.value?.data?.filter(
      (item) => Array.isArray(item.List) && item.List.length > 0
    ) ?? []
  );
});

// Atur tab aktif pertama berdasarkan hasil filter
const activeTab = ref(
  filteredHighlights.value.length ? filteredHighlights.value[0].Id : null
);

const ps = {
	title: parameterSettings["Highlights - Title"],
	description: parameterSettings["Highlights - Description"],
	linkColor: parameterSettings["Highlights - Navigation Link - Color"],
	link: parameterSettings["Highlights - Navigation Link - Link"],
	linkText: parameterSettings["Highlights - Navigation Link - Title"],
};
</script>

<template>
	<section class="home-page-section-padding overflow-hidden">
		<div class="container">
		<AppTitle size="lg" :html-content="ps.title" />
		<AppText
			size="md-extend"
			:color="null"
			class="mb-4 description"
			:html-content="ps.description"
		/>

		<!-- Jika ada highlight yang punya data -->
		<div v-if="filteredHighlights.length">
			<!-- Tab Item -->
			<div class="tabs-container">
			<div
				v-for="highlight in filteredHighlights"
				:key="highlight.Id"
				class="tabs-item"
			>
				<button
				class="tab-button"
				:class="{ active: activeTab === highlight.Id }"
				@click="activeTab = highlight.Id"
				>
				{{ highlight.Name }}
				</button>
			</div>
			</div>

			<!-- Tab Content -->
			<div class="tabs-content">
			<div v-for="highlight in filteredHighlights" :key="highlight.Id">
				<div v-if="highlight.Id === activeTab">
				<!-- === TYPE 1: Blog / News === -->
				<div v-if="highlight.Type === 1">
					<div class="d-block d-lg-none mb-3">
					<Swiper
						:slides-per-view="'auto'"
						:space-between="10"
						:modules="[SwiperPagination]"
						class="mySwiper"
						:free-mode="false"
						:draggable="true"
						:grab-cursor="true"
						:pagination="{
						el: '.highlights-swiper-pagination',
						type: 'bullets',
						clickable: true,
						}"
					>
						<SwiperSlide
						v-for="blog in highlight.List"
						:key="blog.Id"
						style="width: 254px"
						>
						<HighlightNewsCard
							v-bind="blog"
							:to="localePath(`/news/${blog.Slug}`)"
						/>
						</SwiperSlide>
					</Swiper>
					<div class="highlights-swiper-pagination mt-3"></div>
					</div>

					<div class="d-none d-lg-block">
					<div class="row row-cols-lg-4">
						<div
						v-for="blog in highlight.List"
						:key="blog.Id"
						class="col"
						>
						<HighlightNewsCard
							v-bind="blog"
							:to="localePath(`/news/${blog.Slug}`)"
						/>
						</div>
					</div>
					</div>
				</div>

				<!-- === TYPE 2: Financial Reports === -->
				<div v-if="highlight.Type === 2">
					<div class="row row-gap-4 row-report">
					<div
						v-for="report in highlight.List"
						:key="report.Id"
						class="col-lg-6 px-lg-4"
					>
						<HighlightReportCard v-bind="report" />
					</div>
					</div>
				</div>

				<!-- === Navigation link (if any) === -->
				<div v-if="ps.linkText" class="py-4 text-center">
					<AppLink
					:color="null"
					:style="`color: ${ps.linkColor}`"
					:to="localePath(highlight.Link)"
					>
					{{ ps.linkText }}
					</AppLink>
				</div>
				</div>
			</div>
			</div>
		</div>

		<!-- Fallback jika semua kosong -->
		<div v-else class="text-center py-4 text-gray-500">
			Tidak ada highlight yang tersedia.
		</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
section {
	background: #faeee9;
}

.description {
	color: $dark-gray;

	@media screen and (min-width: $lg) {
		color: $body-color;
	}
}

.tabs-container {
	display: flex;
	justify-content: flex-start;
	gap: 16px;
	overflow-x: auto;
	overflow-y: hidden;
	flex-wrap: nowrap;
	padding: 0 24px;
	margin: 0 -24px 32px;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		-webkit-appearance: none;
		display: none;
		width: 0;
	}

	.tab-button {
		background-color: transparent;
		outline: 0;
		padding: 6px 20px;
		font-weight: $btn-font-weight;
		cursor: pointer;
		color: $dark-gray;
		border-radius: $btn-border-radius;
		border: 1px solid $dark-gray;
		transition: all 0.3s ease;

		&:hover,
		&.active {
			color: $white;
			background-color: $primary;
			border-color: $primary;
		}
	}
}

@media only screen and (min-width: 992px) {
	.row-report {
		margin-left: -24px;
		margin-right: -24px;
	}
}
</style>