<script setup lang="ts">
import { AppRes } from "types/utils.types";
import WithSidebarLayout from "~/layouts/with-sidebar.vue";
const localePath = useLocalePath();

const { banner, links, tabs, productRes } = await useProductMeta("about-us/questions");

useAppSeo({
	title: "Frequently Asked Questions (FAQ)",
	ogTitle: "Frequently Asked Questions (FAQ)",
	ogUrl: localePath("/about-us/questions"),
	ogImage: banner.value.backgroundImage,
});

const visibleItems = ref(new Set());

function toggleVisibleItems(id: string) {
	const items = visibleItems.value;
	if (items.has(id)) items.delete(id);
	else items.add(id);
}

interface Question {
	Id: number;
	Question: string;
	Answer: string;
}

interface QuestionList {
	Id: number;
	Name: string;
	Questions: Question[];
}

const { data: questions } = await useAPI<AppRes<QuestionList[]>>("questions");

const isTabletPlus = inject("isTabletPlus");

function scrollToGroup(val: { slug: string }) {
	const groupOffsetTop = (document.querySelector(`#question-group-${val.slug}`) as HTMLDivElement)
		.offsetTop;
	window.scrollTo({ top: groupOffsetTop - 100 });
}
</script>

<template>
	<div>
		<AppHero v-if="banner" :background-image="banner.backgroundImage" :banner-text="''"
			:banner-title="banner.bannerTitle" :links="links" />
		<div class="bg-secondary">
			<div class="container tabs-container">
				<AppTabs :items="tabs" :active-item="'questions'" class="text-white" @item-click="val => {
					navigateTo(localePath(`/about-us/${val}`));
				}
					" />
			</div>
		</div>
		<WithSidebarLayout>
			<template #sidebar>
				<AppSidebarList v-if="questions" :title="productRes.SubPage.SidebarTitle" :lists="questions.data.map(item => ({
					name: item.Name,
					slug: item.Id.toString(),
				}))
					" :convert-as-dropdown="true" :selected="questions.data[0].Id.toString()" :as-link="false"
					@update:sidebar="scrollToGroup" />
			</template>
			<template #default>
				<div v-if="questions && questions.data.length">
					<AppTitle v-if="isTabletPlus" color="black" size="sm" class="mb-4">
						Frequently Asked Questions (FAQ)
					</AppTitle>

					<div v-for="questionGroup in questions.data" :id="`question-group-${questionGroup.Id}`"
						:key="questionGroup.Id" class="question-group mb-5">
						<AppText color="secondary" :size="undefined" class="question-group__title mb-4">
							{{ questionGroup.Name }}
						</AppText>
						<div v-for="question in questionGroup.Questions" :key="question.Id" class="d-block question mb-4">
							<div class="collapsed cursor-pointer justify-content-between d-flex py-1" data-bs-toggle="collapse"
								:data-bs-target="'#question-' + question.Id" aria-expanded="true"
								@click="toggleVisibleItems(`#question-${question.Id}`)">
								<AppText class="fw-bold question__title mb-0" :color="null" size="lg">{{
									question.Question
								}}</AppText>
								<span class="question__arrow text-primary">
									<i v-show="visibleItems.has(`#question-${question.Id}`)" class="bx bx-chevron-up"></i>
									<i v-show="!visibleItems.has(`#question-${question.Id}`)" class="bx bx-chevron-down"></i>
								</span>
							</div>
							<div :id="'question-' + question.Id" class="accordion-collapse collapse">
								<AppText color="black" :size="undefined" class="question__answer" :html-content="question.Answer" />
							</div>
						</div>
					</div>
				</div>
				<div v-else class="py-4 text-center">
					<p>question not loaded</p>
				</div>
			</template>
		</WithSidebarLayout>
	</div>
</template>

<style lang="scss" scoped>
.tabs-container {
	@media screen and (min-width: $lg) {
		display: flex;
		justify-content: center;
	}
}

.plus-minus {
	float: right;
	max-width: 20px;
}

.question-group {
	&__title {
		font-size: clamp(18px, 2vw, 21px);
		font-weight: bold;

		@media screen and (min-width: $md) {
			font-weight: 600;
		}
	}

	.question {
		border-bottom: 1px solid #e6e6e6;

		&__title {
			color: black;

			@media screen and (min-width: $md) {
				color: $primary;
			}
		}

		&__arrow {
			font-size: 18px;

			@media screen and (min-width: $lg) {
				font-size: 22px;
			}
		}

		&__answer {
			font-weight: 500;
			font-size: clamp(12px, 1.35vw, 21px);
			background-color: $light-muted;
			padding: 15px;
			margin-bottom: 0;
		}
	}
}
</style>
