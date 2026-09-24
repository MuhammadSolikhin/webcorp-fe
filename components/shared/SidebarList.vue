<template>
	<div class="sidebar" :class="props.sticky && 'position-sticky'" style="top: 130px">
		<AppText :color="null" :class="props.titleClass ? '' : 'sidebar-title d-none d-lg-block'" size="lg-extend"
			class="sidebar__title" :html-content="props.title" />
		<ul v-if="props.lists" class="list-unstyled flex-column align-items-start"
			:class="!props.convertAsDropdown ? 'd-flex ' : 'd-none d-lg-flex'">
			<li v-for="(list, index) in props.lists" :key="index" :class="{
				selected: selectedItem === list.slug,
			}" @click="onChangeHandler(list)" v-html="list.name"></li>
		</ul>
		<select v-model="selectedItem" :class="props.convertAsDropdown ? 'd-block d-lg-none' : 'd-none'" class="form-select"
			@change="onSelectChange(($event.target as HTMLSelectElement).value)">
			<option v-for="option in props.lists" :key="option.slug" :value="option.slug"
				:selected="option.slug === props.selected">
				{{ option.name }}
			</option>
		</select>
	</div>
</template>
<script setup lang="ts">
interface ListType {
	name: string;
	slug: string;
}
interface Props {
	title: string;
	queryKey?: string;
	lists: ListType[];
	selected: string;
	convertAsDropdown: boolean;
	asLink: boolean;
	sticky: boolean;
	scrollToView?: { elementId: string; offsetTop?: number } | undefined;
	titleClass?: string | undefined;
}
const emits = defineEmits<{
	(e: "update:sidebar", val: ListType): void;
}>();

const props = withDefaults(defineProps<Props>(), {
	title: "",
	selected: "",
	convertAsDropdown: false,
	queryKey: "product",
	asLink: true,
	sticky: true,
});

const localePath = useLocalePath();

const selectedItem = useState(Math.random().toString(36), () => getSelectedItem(props.selected));
watchEffect(() => (selectedItem.value = getSelectedItem(props.selected)));

function onSelectChange(slug: string) {
	if (slug) {
		const item = props.lists.find(item => item.slug === slug);
		if (item) onChangeHandler(item);
	}
}
async function onChangeHandler(listItem?: ListType) {
	if (!listItem) return;
	if (listItem.slug !== selectedItem.value) {
		selectedItem.value = listItem.slug;
	}
	emits("update:sidebar", listItem);
	if (props.asLink) {
		await navigateTo(localePath({ query: { [props.queryKey]: listItem.slug } }));
	}
	if (props.scrollToView) {
		scrollToView(props.scrollToView);
	}
}

function getSelectedItem(item: string) {
	const hasItem = props.lists.find(i => i.slug === item);
	return hasItem ? hasItem.slug : props.lists[0].slug;
}
</script>

<style lang="scss" scoped>
@import "~/assets/scss/color-v2.scss";

.sidebar {
	&__title {
		margin-bottom: 8px;
		font-weight: 500;

		@media screen and (min-width: 768px) {
			margin-bottom: 15px;
			font-weight: 700;
		}
	}

	.sidebar-title {
		color: $light;

		@media screen and (min-width: 768px) {
			color: $dark-gray;
		}
	}

	ul {
		border-left: 1px solid $light-gray;
		padding-left: 16px;
		padding-right: 16px;

		li {
			margin-top: 12px;
			margin-bottom: 12px;
			font-weight: 500;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 100%;
		}

		li:not(.selected) {
			cursor: pointer;
		}

		li:hover {
			font-weight: bold;
		}

		li.selected {
			color: $primary;
			font-weight: bold;
		}
	}
}

select.form-select {
	border-radius: 8px;
	border: none;
	box-shadow: inset 0 0 0 1px #b4b4b4;
	font-weight: 500;
	font-size: 16px;
	padding: 12px 24px;
}

@media only screen and (max-width: 767.98px) {
	select.form-select {
		font-size: 14px;
		padding: 8px 14px;
	}
}
</style>
