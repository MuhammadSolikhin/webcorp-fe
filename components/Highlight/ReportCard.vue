<script setup lang="ts">
import type { ReportList } from "~/types/highlight.types";

const { locale } = useI18n();
const props = defineProps<ReportList>();
const getFileName = (url: string) => {
	return url?.split("/").pop() || "download";
};
</script>

<template>
	<div class="card overflow-hidden">
		<div class="card-body d-flex align-items-center row-gap-2">
			<img src="public/icons/document-export.svg" class="card-icon" alt="document" />
			<h5 class="card-title fw-bold">
				{{ props.Title }}
			</h5>
		</div>
		<div class="card-footer d-flex justify-content-between align-items-center">
			<span>{{
				formatDate(props.PublishDate, {
					locale: locale as "id" | "en",
					formateString: "D MMMM YYYY",
				})
			}}</span>
			<a :href="props.FileUrl" :download="getFileName(props.FileUrl)"
				class="text-primary text-decoration-none d-flex justify-content-center align-items-center card-btn"
				target="_blank">
				<span class="fw-bold d-inline-block">Download</span>
				<i class="bx bx-right-arrow-alt"></i>
			</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.card {
	background: #ffffff;
	color: #000;
	border-radius: 16px;
	box-shadow: 0px 15px 35px 0px rgba(0, 0, 0, 0.05);
	border: 0;
	padding: 6px 0;

	.card-body,
	.card-footer {
		padding: 6px 16px;
	}
}

.card-img {
	display: block;
	width: 28px;
	height: 28px;
	object-fit: contain;
}

.card-title {
	font-weight: 700;
	line-height: 28px;
	font-size: 18px;
	margin-left: 16px;
	margin-bottom: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.card-btn i {
	font-size: 16px;
	margin-left: 4px;
}

.card-footer {
	background: transparent;
	color: #9b9b9b;
	border: none;
	font-weight: 500;
	font-size: 14px;
}
</style>
