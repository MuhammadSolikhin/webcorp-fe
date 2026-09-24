<script setup lang="ts">
import { ref, watch, computed } from "vue";
import WithSidebar from "~/layouts/with-sidebar.vue";
import type { SubCategoryRes } from "~/types/governance.types";
import { makeSlug } from "~/utils/helpers";

// Injecting a boolean value to determine if the device is mobile
const isMobile = inject<boolean>("isMobile");

// Accessing the current route and locale information
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { apiUrl } = useRuntimeConfig().public;

// Reactive reference to store the title, initialized from local storage or route query
const title = ref<string>(localStorage.getItem("title") || route.query.title);

// Watcher to update the title when the route query changes
watch(
	() => route.query.title,
	(newTitle) => {
		if (newTitle) {
			title.value = String(newTitle);
			localStorage.setItem("title", title.value);
		}
	},
	{ immediate: true }
);

// Setting SEO metadata for the page based on the title
useAppSeo({
	title: title.value,
	ogTitle: title.value,
	ogUrl: localePath("/about-us/governance/" + makeSlug(title.value)),
});

// Fetching product metadata related to governance
const { links } = await useProductMeta("governance/governance");

// Creating a computed property to update links with the correct path
const updatedLinks = computed(() => [
	...links.map(link => ({
		...link,
		to: link.to === "governance" ? "/about-us/governance" : link.to
	})),
	{ title: title.value, to: "" }
]);

// Fetching sub-category data based on the slug from the route parameters
const { data: subCategoryRes } = await useFetch<SubCategoryRes>(
	`${apiUrl}/${locale.value}/v2/governance-sub-category/${route.params?.slug}`
);

// Creating computed properties for data groups and active groups
const dataGroups = computed(() => subCategoryRes.value?.data ?? []);
const activeGroups = computed(() => {
	if (route.query.group) {
		return dataGroups.value.find(item => item.Slug === route.query.group) || dataGroups.value[0];
	}
	return dataGroups.value[0];
});

// Reactive reference to store active tabs for each group
const activeTabs = ref<Record<string, number>>({});

// Reactive reference to store detailed data for the selected group
const dataDetails = ref<any>(null);

// Watcher to fetch details when the active group changes
watch(activeGroups, async (newGroup) => {
	if (!newGroup) return;

	// Ensure each group has an active tab value in `activeTabs`
	if (!(newGroup.Slug in activeTabs.value)) {
		activeTabs.value[newGroup.Slug] = 0;
	}

	try {
		// Fetching detailed data for the selected group
		const response = await fetch(
			`${apiUrl}/${locale.value}/v2/governance-sub-category/${route.params?.slug}?detail=${newGroup.Slug}&group=${activeTabs.value[newGroup.Slug]}`
		);
		if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
		const data = await response.json();
		dataDetails.value = data;
	} catch (err) {
		console.error("Error fetching governance group details:", err);
		dataDetails.value = null;
	}
}, { immediate: true });

// Watcher to update active tabs based on route query changes
watch(
	() => route.query,
	(query) => {
		if (query.group) {
			const group = dataGroups.value.find(item => item.Slug === query.group);
			if (group) {
				activeTabs.value[query.group] = activeTabs.value[query.group] || 0;
			}
		} else {
			activeTabs.value[activeGroups.value.Slug] = activeTabs.value[activeGroups.value.Slug] || 0;
		}
	}
);

// Function to set the active tab and fetch corresponding data
const setActiveTab = async (groupSlug: string, tabIndex: number) => {
	activeTabs.value[groupSlug] = tabIndex;

	try {
		// Fetching data for the selected tab
		const response = await fetch(
			`${apiUrl}/${locale.value}/v2/governance-sub-category/${route.params?.slug}?detail=${groupSlug}&group=${tabIndex}`
		);
		const data = await response.json();

		if (data && data.data) {
			dataDetails.value = data;
		}
	} catch (err) {
		console.error("Error fetching tab data:", err);
	}
};

// Initialize the active tab for the first group if data groups exist
if (dataGroups.value.length > 0) {
	activeTabs.value[activeGroups.value.Slug] = 0;
}

// Lifecycle hook to set the title from local storage on component mount
onMounted(() => {
	const storedTitle = localStorage.getItem("title");
	if (storedTitle) {
		title.value = storedTitle;
	}
});

</script>

<template>
	<div class="governance-breadcrumb">
		<div class="container">
			<BlogBreadcrumb v-if="updatedLinks.length" :links="updatedLinks" color="black" />
		</div>
	</div>
	<div class="governance-title-page">
		<div class="container">
			<h2 class="governance-title-page-text" v-html="title"></h2>
		</div>
	</div>
	<WithSidebar>
		<template #sidebar>
			<AppSidebarList v-if="dataGroups.length" title="Kategori"
				:lists="dataGroups.map(item => ({ name: item.Title, slug: item.Slug }))" :convert-as-dropdown="true"
				:selected="activeGroups?.Slug" :as-link="true" query-key="group"
				:scroll-to-view="{ elementId: 'governance', offsetTop: 100 }" />
		</template>
		<template #default>
			<div v-if="dataDetails" id="governance" class="governance-wrapper">
				<h3 class="governance-title">
					{{ activeGroups?.Title }}
				</h3>

				<!-- Content for Type 1 -->
				<div v-if="activeGroups.Type === '1'" class="governance-content">
					<div v-if="dataDetails?.data?.length > 0" class="governance-detail">
						<div v-for="(item, index) in dataDetails?.data ?? []" :key="'detail-item-' + index"
							class="governance-detail-row">
							<div v-if="item.ImageDesktop" class="governance-img">
								<img :src="isMobile ? item.ImageMobile : item.ImageDesktop" :alt="route.query.group || item.Id" />
							</div>

							<div v-if="item?.Text" v-html="item.Text"></div>
							<div v-if="item?.Note" v-html="item.Note"></div>

							<div v-if="item?.FileUrl" id="governance-download" class="governance-download">
								<div class="governance-download-box">
									<div class="governance-download-text">
										<img src="public/icons/document-export.svg" class="card-icon" alt="document" />
										<p>{{ item?.Title }}</p>
									</div>
									<a :href="item.FileUrl" class="governance-download-link">Download</a>
								</div>
							</div>

						</div>
					</div>
					<div v-else class="governance-detail">
						<p> - </p>
					</div>
				</div>

				<!-- Content for Type 2 (Tabs) -->
				<div v-if="activeGroups.Type === '2'" class="governance-tabs">
					<ul v-if="dataDetails?.data?.group" class="governance-tabs-list">
						<li v-for="(item, index) in dataDetails?.data?.group ?? []" :key="'tabs-item' + index"
							:class="{ active: activeTabs[activeGroups.Slug] != 0 ? item.Id === activeTabs[activeGroups.Slug] : index === activeTabs[activeGroups.Slug] }"
							@click="setActiveTab(activeGroups.Slug, item.Id)">
							{{ item.Title }}
						</li>
					</ul>

					<ul v-if="dataDetails?.data?.document?.length > 0" class="governance-tabs-group">
						<li v-for="(item, index) in dataDetails?.data?.document ?? []" :key="'tabs-group-' + index"
							class="governance-tabs-group-item border-0 d-flex justify-content-between align-items-center"
							:class="index % 2 === 0 ? 'table-orange' : 'table-light'">
							<span class="d-inline-block">{{ item.Title }}</span>
							<a class="d-inline-block text-decoration-none fw-bold" :href="item.FileUrl" target="_blank">
								Download
							</a>
						</li>
					</ul>
					<p v-else>-</p>

				</div>

				<!-- Content for Type 3 (Team) -->
				<div v-if="activeGroups.Type === '3'" class="governance-team">
					<div v-if="dataDetails?.data?.length > 0" class="governance-team-list">
						<div v-for="(item, index) in dataDetails?.data ?? []" :key="'team-item-' + index"
							class="governance-team-item">
							<div class="governance-team-img">
								<img :src="item.Image" :alt="item.Name" />
							</div>
							<h5 class="governance-team-name">{{ item.Name }}</h5>
							<p class="governance-team-position">{{ item.Position }}</p>
						</div>
					</div>
					<div v-else class="governance-detail">
						<p> - </p>
					</div>
				</div>
			</div>
		</template>
	</WithSidebar>
</template>

<style lang="scss">
.governance-breadcrumb {
	padding: 24px 0;
}

.governance-title-page {
	padding: 48px 0 48px 8px;
	background-color: $light-muted;

	@media screen and (max-width: 991.98px) {
		padding: 40px 0;
	}

	@media screen and (max-width: 479.98px) {
		padding: 32px 0;
	}

	&-text {
		font-size: 36px;
		font-weight: 700;
		color: $primary;
		margin: 0;

		@media screen and (max-width: 991.98px) {
			font-size: 32px;
		}

		@media screen and (max-width: 479.98px) {
			font-size: 28px;
		}

		@media screen and (max-width: 320px) {
			font-size: 24px;
		}
	}
}

.governance-wrapper {
	@media screen and (max-width: 768px) {
		padding: 24px 32px;
	}

	@media screen and (max-width: 767.98px) {
		padding: 16px 0;
	}

	@media screen and (max-width: 479.98px) {
		padding: 0;
	}
}

.governance-title {
	font-size: 28px;
	color: $primary;
	font-weight: 700;
	margin-bottom: 24px;

	@media screen and (max-width: 479.98px) {
		font-size: 24px;
		margin-bottom: 16px;
	}

	@media screen and (max-width: 320px) {
		font-size: 20px;
	}
}

.governance-content {
	margin-bottom: 16px;

	p {
		font-size: 16px;

		@media screen and (max-width: 479.98px) {
			font-size: 14px;
		}
	}

	ol {
		@media screen and (max-width: 479.98px) {
			padding-left: 18px;
		}
	}

	blockquote {
		margin-bottom: 18px;
		font-size: 16px;
		border-left: 2px solid $border-description;
		padding-left: 24px;

		@media screen and (max-width: 767.98px) {
			padding-left: 18px;
		}

		@media screen and (max-width: 479.98px) {
			font-size: 14px;
		}
	}
}

.governance-detail {
	margin-bottom: 16px;

	&:last-child {
		margin-bottom: 0;
	}
}

.governance-download {
	margin-bottom: 18px;

	&-label {
		font-size: 16px;

		@media screen and (max-width: 479.98px) {
			font-size: 14px;
			line-height: 18px;
		}
	}

	&-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 14px 36px;
		background-color: $table-orange;
		border-radius: 12px;

		@media screen and (max-width: 767.98px) {
			flex-direction: column;
			align-items: flex-start;
			padding: 14px 24px;
		}
	}

	&-text {
		display: flex;
		align-items: center;

		@media screen and (max-width: 767.98px) {
			margin-bottom: 16px;
		}

		p {
			margin-left: 8px;
			margin-bottom: 0;

			@media screen and (max-width: 479.98px) {
				font-size: 14px;
				line-height: 18px;
			}
		}

		img {
			display: block;
			width: 28px;
			height: 28px;
		}
	}

	a {
		text-decoration: none;
		font-size: 16px;
		font-weight: 700;

		@media screen and (max-width: 479.98px) {
			font-size: 14px;
		}
	}
}

.governance-team {
	border-bottom: 1px solid $border-team;
	padding: 16px 0;

	&-list {
		display: flex;
		flex-wrap: wrap;
		margin-right: -10px;
		margin-left: -10px;
	}

	&-item {
		width: 33.3333333%;
		padding: 0 10px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;

		@media screen and (max-width: 1199.98px) {
			width: 50%;
		}

		@media screen and (max-width: 479.98px) {
			width: 100%;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	&-img {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background-color: $bg-item-team;
		overflow: hidden;
		margin-bottom: 20px;

		& img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			position: relative;
			top: 10px;
		}
	}

	&-name {
		font-size: 24px;
		margin-bottom: 8px;

		@media screen and (max-width: 479.98px) {
			font-size: 22px;
		}
	}

	&-position {
		margin: 0;
		font-size: 16px;
	}
}

.governance-tabs {
	&-list {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0 0 32px;
		overflow: hidden;
		overflow-x: auto;
		flex-wrap: nowrap;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			-webkit-appearance: none;
			display: none;
			width: 0;
		}

		@media only screen and (max-width: 991.98px) {
			justify-content: flex-start;
			margin-left: -24px;
			margin-right: -24px;
			padding-right: 24px;
			padding-left: 24px;
		}

		@media only screen and (max-width: 767.98px) {
			margin-bottom: 24px;
		}

		li {
			flex: 0 0 auto;
			position: relative;
			cursor: pointer;
			font-size: 16px;
			font-weight: bold;
			padding: 10px 0;
			margin-right: 24px;
			color: $dark-gray;

			@media only screen and (max-width: 767.98px) {
				font-size: 14px;
			}

			&:last-child {
				margin-right: 0;
			}

			&.active {
				font-weight: bold;
				color: $secondary;
				opacity: 1;

				&::after {
					content: "";
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					height: 2px;
					background-color: $secondary;
				}
			}
		}
	}

	&-group {
		list-style: none;
		padding: 0;
		margin: 0;

		&-item {
			border-radius: 16px;
			padding: 15px 20px;
			margin-bottom: 15px;
		}
	}

	.table-light {
		background-color: $light;
	}

	.table-gray {
		background-color: $table-gray;
	}

	.table-orange {
		background-color: $table-orange;
	}
}

.governance-img {
	width: 100%;
	height: auto;
	margin-bottom: 16px;

	& img {
		width: 100%;
		display: block;
		object-fit: contain;
	}
}
</style>
