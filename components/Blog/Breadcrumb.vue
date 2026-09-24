<template>
	<div aria-label="breadcrumb">
		<ol class="breadcrumb mb-0">
			<li v-for="link in props.links" :key="link.to" class="breadcrumb-item fw-medium" :class="color" v-bind="$attrs">
				<nuxt-link class="text-decoration-none" :to="link.to"><span v-html="link.title"></span></nuxt-link>
			</li>
		</ol>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});
export interface BreadcrumbLink {
	to: any;
	title: string;
}
const props = defineProps<{
	links: BreadcrumbLink[];
	color: null | "primary" | "secondary" | "dark" | "light" | "white" | "dark-gray" | "black";
}>();
const color = computed(() =>
	props.color ? (props.color.includes("text-") ? props.color : "text-" + props.color) : ""
);
</script>

<style scoped lang="scss">
.breadcrumb-item {

	&::before,
	&::after {
		color: currentColor !important;
	}
}
</style>
