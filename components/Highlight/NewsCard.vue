<script setup lang="ts">
import { snip } from "js-snip";
import type { BlogList } from "~/types/highlight.types";
const { locale } = useI18n();
const el = ref();
interface IBlog extends BlogList {
	to: any;
}
const props = defineProps<IBlog>();
function handleStyling(blogType: string): string {
	const pressRelease = ["Siaran Pers", "Press Release", "Press Conference"];
	return pressRelease.includes(blogType) ? "color: #A6471A; background-color: #FAEEE9;" : "";
}
onMounted(() => {
	if (el.value && props.Summary) {
		snip(el.value, { lines: 3, mode: "css" }, () => {
			el.value.innerHTML = props.Summary;
		});
	}
});
</script>

<template>
	<div class="card overflow-hidden h-100 w-100">
		<nuxt-link class="card-link text-decoration-none" :to="props.to" />
		<div style="height: 210px">
			<nuxt-img :src="props.BannerImage" :quality="80" class="card-img-top object-fit-cover w-100 h-100" alt="..." />
		</div>
		<div class="card-body d-flex flex-column row-gap-2">
			<div class="mb-3">
				<span class="card-tag d-inline-blog px-3 py-1 fw-bold rounded-5" :style="handleStyling(props.BlogType.Title)">
					{{ props.BlogType.Title }}
				</span>
			</div>
			<h5 class="card-title fw-bold">
				{{ props.Title }}
			</h5>
			<!-- for seo -->
			<div class="d-none" v-html="props.Summary"></div>
			<div ref="el" class="card-text fw-medium"></div>
		</div>
		<div class="card-footer">
			{{
				formatDate(props.PostedDate, {
					locale: locale as "id" | "en",
					formateString: "D MMMM YYYY",
				})
			}}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.card {
	position: relative;
	border: 2px solid #e6e6e6;
	background: #ffffff;
	color: #000;
	border-radius: 16px;
	transition: box-shadow 0.8s cubic-bezier(0, 0.74, 0.47, 1.06);

	&:hover {
		box-shadow: 0px 15px 35px 0px rgba(51, 51, 51, 0.18);
	}

	.card-body,
	.card-footer {
		padding: 1rem;
	}
}

.card-link {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	opacity: 0;
	width: 100%;
	height: 100%;
}

.card-tag {
	color: #005466;
	background: #e9f7fa;
	font-size: 0.9rem;
}

.card-title {
	line-height: 25px;
	font-size: 16px;
}

.card-text {
	font-size: 14px;
}

.card-footer {
	background: transparent;
	color: #9b9b9b;
	border: none;
	font-weight: 500;
	font-size: 14px;
}
</style>
