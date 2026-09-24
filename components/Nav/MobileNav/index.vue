<script setup lang="ts">
import Menus from "./Menus.vue";
const localePath = useLocalePath();
const navItemsVisible = useState(() => false);
const menuCollRef = ref();
const route = useRoute();

// Define an array of routes where you want to hide the navbar
const hiddenNavRoutes = ["/about-us/questions-mobile", "/news-mobile", "/news-mobile/"];

// Check if the current path matches any hiddenNavRoutes or starts with '/news-mobile'
// const shouldHideNav = hiddenNavRoutes.includes(location.pathname);
// Check if the current path matches any hiddenNavRoutes or starts with '/news-mobile'
const shouldHideNav = ref(
	hiddenNavRoutes.includes(route.path) || route.path.startsWith("/news-mobile/")
);

function closeAllNav() {
	if (navItemsVisible.value) navItemsVisible.value = false;
	document.querySelectorAll(".collapse.show").forEach(item => {
		item.classList.remove("show");
	});
}
watch(navItemsVisible, visible => {
	const nuxtRoot = document.querySelector("#__nuxt") as HTMLDivElement;
	if (visible) nuxtRoot.style.overflow = "hidden";
	else nuxtRoot.style.overflow = "unset";
});

provide("closeAllNav", closeAllNav);

onMounted(() => {
	const navMenuCollapse = document.querySelector("#menu-coll.collapse");
	if (navItemsVisible.value && !navMenuCollapse?.className.includes("show")) {
		navMenuCollapse?.classList.add("show");
	}
	if (!navItemsVisible.value && navMenuCollapse?.className.includes("show")) {
		navMenuCollapse?.classList.remove("show");
	}
	if (menuCollRef.value) {
		menuCollRef.value.addEventListener("show.bs.collapse", menuColl => {
			if ((menuColl.target as HTMLDivElement).id === "menu-coll") {
				navItemsVisible.value = true;
			}
		});
		menuCollRef.value.addEventListener("hidden.bs.collapse", menuColl => {
			if ((menuColl.target as HTMLDivElement).id === "menu-coll") {
				navItemsVisible.value = false;
			}
		});
	}
});
</script>

<template>
	<div v-if="!shouldHideNav" id="mobile-navbar">
		<nav id="nav-accordion" class="navbar" :class="{ 'menu-open': navItemsVisible }">
			<div class="container p-0">
				<div class="nav-mobile">
					<NuxtLink class="navbar-brand p-0 m-0" :to="localePath('/')" @click="closeAllNav">
						<img id="hibank-logo" :src="navItemsVisible ? '/icons/logo-mobile.svg' : '/icons/logo.svg'" alt="Hibank" />
					</NuxtLink>

					<div id="nav-toggler">
						<NavMobileNavSearch :nav-items-visible="navItemsVisible" @close-all-nav="closeAllNav" />
						<NavMobileNavLanguage @close-all-nav="closeAllNav" />
						<span id="menu-burger-icon" class="accordion-header">
							<!--  -->
							<button class="button collapse-btn p-0 overflow-hidden" type="button" data-bs-toggle="collapse"
								data-bs-target="#menu-coll">
								<img :src="`/icons/${navItemsVisible ? 'fi-sr-cross.svg' : 'fi-sr-menu-burger.svg'}`" alt="menu"
									:class="navItemsVisible ? 'menu-cross-icon' : ''" />
							</button>
						</span>
					</div>
				</div>
			</div>
			<div id="search-accordion" class="w-100 position-absolute top-0 bg-white" style="transform: translateY(73px)">
			</div>
			<div id="lang-accordion" class="w-100 position-absolute bg-white top-0" style="transform: translateY(73px)"></div>
			<div id="menu-coll" ref="menuCollRef" class="collapse position-absolute w-100 bg-white top-0 z-2"
				style="transform: translateY(73px)" data-bs-parent="#nav-accordion">
				<Menus :nav-items-visible="navItemsVisible" @close-all-nav="closeAllNav" />
			</div>
		</nav>
	</div>
</template>

<style scoped lang="scss">
@import "~/assets/scss/color-v2.scss";

:deep(.button) {
	background: transparent;
	border: none;
	outline: none !important;
	border: none !important;
	box-shadow: none !important;
}

#mobile-navbar {
	background: #fff;

	.navbar {
		transition: all 200ms ease-in-out;
		padding: 0px;

		// change color on menu open
		&.menu-open {
			background-color: $secondary;

			.nav-mobile {
				border-bottom: 1px solid $secondary;
			}
		}

		.nav-mobile {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
			padding: 16px 0;
			border-bottom: 1px solid map-get($neutralColor, "02");

			#nav-toggler {
				display: flex;
				align-items: center;
				gap: 24px;
				margin: 0;
			}
		}
	}

	.navbar-brand {
		padding: 0;
		margin: 0;

		img {
			width: 100px;
			height: 40px;
		}
	}
}

:deep(.nav-mobile-right) {
	width: 100%;
	display: flex;
	gap: 1.5rem;

	.navbar-toggler {
		border: none;
		padding: 0;
	}

	#toggle-search,
	#toggle-lang,
	#nav-menu {
		width: 1.2rem;
	}
}

:deep(.collapse-container) {
	padding-top: 1.5rem;
	padding-bottom: 2.5rem;

	.coll-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 400px;
		margin: auto;

		.change-lang-header {
			position: relative;
			display: inline-block;
			width: fit-content;
			font-weight: 700;
			color: map-get($primaryColor, "60");
			padding: 0;

			&::after {
				display: block;
				position: absolute;
				bottom: -10px;
				content: "";
				height: 2px;
				width: 100%;
				background-color: #fff;
				transition: all 300ms ease-out;
			}
		}

		.options {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 0 1rem;

			.nav-item {
				list-style: none;

				a {
					padding: 0;
				}
			}
		}
	}
}

:deep(.collapse-btn) {
	display: inline-block;
	height: 100%;
}

:deep(.collapse-btn) img {
	width: 24px;
}

#menu-burger-icon img {
	width: 28px;
}

.menu-cross-icon {
	width: 22px !important;
}

#lang-accordion,
#search-accordion,
#menu-coll {
  z-index: 99999;
}

#mobile-navbar {
  position: relative;
  z-index: 99999;
}
</style>