<script setup lang="ts">
withDefaults(
	defineProps<{
		sticky: boolean;
		topOffset: number;
	}>(),
	{
		sticky: true,
		topOffset: 130,
	}
);
</script>

<template>
	<div class="main-wrapper container">
		<div class="row w-100 mx-auto">
			<div class="col-12 col-lg-4 px-0">
				<div class="main-wrapper__bg" :style="sticky ? `position: sticky;top: ${topOffset}px` : ''">
					<div class="sidebar-wrapper container">
						<slot name="sidebar" />
					</div>
				</div>
			</div>
			<div class="col-12 col-lg-8 px-0">
				<div class="content-wrapper container">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main-wrapper {
	&.container {
		@media screen and (max-width: 768px) {
			width: 100% !important;
			max-width: 100% !important;
			padding: 0 !important;
		}
	}

	&__bg {
		@media screen and (max-width: 991.98px) {
			padding: 24px;
			background-color: $secondary;
		}

		@media screen and (max-width: 768px) {
			padding: 24px 32px;
		}

		@media screen and (max-width: 767.98px) {
			padding: 16px 0;
		}
	}

	@media screen and (min-width: $md) {
		padding-top: 40px;
		padding-bottom: 40px;
	}
}

.sidebar-wrapper.container,
.content-wrapper.container {
	@media screen and (min-width: 768px) {
		width: 100% !important;
		max-width: 100% !important;
		padding: 0 !important;
	}
}

.content-wrapper.container {
	@media screen and (max-width: 768px) {
		padding-top: 20px;
		padding-bottom: 20px;
	}
}
</style>
