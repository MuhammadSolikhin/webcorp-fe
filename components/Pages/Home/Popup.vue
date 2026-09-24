<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import type { PopupRes } from "~/types/popup.types";

// Fetching popup announcement data from the API
const { data: popupRes } = await useAPI<PopupRes>("popup-announcement");

// Function to check if the popup has been dismissed and if it is still valid
const isPopupDismissed = () => {
	const dismissed = localStorage.getItem("popupDismissed");
	const expiresAt = localStorage.getItem("popupExpires");

	// Check if the popup was dismissed and if it hasn't expired
	if (dismissed === "true" && expiresAt && Date.now() < parseInt(expiresAt)) {
		return true;
	}

	// Clean up local storage if the popup is not dismissed
	localStorage.removeItem("popupDismissed");
	localStorage.removeItem("popupExpires");
	return false;
};

// Reactive reference to control the visibility of the popup
const showPopup = ref(!isPopupDismissed());
const elPopup = ref(true);
const videoRef = ref<HTMLVideoElement | null>(null);
const videoSource = ref<string | null>(null);

// Function to hide the popup and optionally save the dismissal state to local storage
const handleHidePopup = (saveToStorage = false) => {
	showPopup.value = false;
	document.body.style.overflow = "";

	// Pause the video if it exists
	if (videoRef.value) {
		videoRef.value.pause();
	}

	// Reset the video source to stop playback
	videoSource.value = null;

	// Reset the iframe source to stop playback
	const iframe = document.querySelector('iframe');
	if (iframe) {
		iframe.src = '';
	}

	// Save dismissal state to local storage if specified & Set expiration for 24 hours
	if (saveToStorage) {
		localStorage.setItem("popupDismissed", "true");
		localStorage.setItem("popupExpires", (Date.now() + 24 * 60 * 60 * 1000).toString());
	}
};

// Function to handle video loading and playback
const handleVideoLoaded = () => {
	if (videoRef.value) {
		videoRef.value.play().catch(error => {
			console.error("Error attempting to play the video:", error);
		});
	}
};

// Watcher to update video source when popup data is available
watchEffect(() => {
	if (popupRes.value?.data?.Type === '2' && popupRes.value.data.Video) {
		videoSource.value = popupRes.value.data.Video;
	}
});

// Watcher to play the video when the source is set
watchEffect(() => {
	if (videoSource.value && videoRef.value) {
		handleVideoLoaded();
	}
});

// Lifecycle hook to handle popup display logic on component mount
onMounted(() => {
	if (videoRef.value) {
		videoRef.value.addEventListener('contextmenu', (event) => {
			console.log('Video context menu event:', event);

			event.preventDefault();
		});
	}
	if (popupRes && popupRes.value?.data) {
		if (showPopup.value) {
			document.body.style.overflow = "hidden";
			if (popupRes.value?.data?.Type === '1') {
				setTimeout(() => handleHidePopup(), 15000);
			}
		}
	}
});
</script>

<template>
	<div v-if="elPopup && popupRes && popupRes.data" class="popup" :class="{ 'popup-show': showPopup }">
		<div class="popup-wrapper">
			<button type="button" class="popup-close" @click="handleHidePopup(true)">
				<i class="bx bx-x"></i>
			</button>
			<div class="popup-content">
				<!-- image -->
				<img v-if="popupRes.data.Type === '1' && popupRes.data.Image" :src="popupRes.data.Image"
					:alt="popupRes.data.Title" />
				<!-- video -->
				<video v-if="popupRes.data.Type === '2' && videoSource" ref="videoRef" controls muted loop
					controlsList="nodownload noremoteplayback" oncontextmenu="return false;">
					<source :src="videoSource" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<!-- video embed -->
				<iframe v-if="popupRes.data.Type === '3' && popupRes.data.VideoEmbed"
					:src="`https://www.youtube.com/embed/${popupRes.data.VideoEmbed}?playlist=${popupRes.data.VideoEmbed}&rameborder=0&rel=0&loop=1&autoplay=1&mute=1&modestbranding=1&wmode=transparent&controls=0&showinfo=0`"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen>
				</iframe>

			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1051;
	background: rgba(26, 26, 26, 0.6);
	opacity: 0;
	visibility: hidden;
	overflow-x: hidden;
	overflow-y: auto;
	transition: opacity 0.25s ease .5s;

	&.popup-show {
		opacity: 1;
		visibility: visible;
		transition-delay: 0s;
	}
}

.popup-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 32px;
}

.popup-content {
	width: 944px;
	height: 688px;
	opacity: 0;
	transform: translateY(24px);
	transition: all .35s ease;

	.popup-show & {
		opacity: 1;
		transform: none;
	}

	img,
	iframe,
	video {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.popup-close {
	position: absolute;
	top: 48px;
	right: 48px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 8px;
	outline: 0;
	border: 0;
	background-color: transparent;
	color: #fff;
	opacity: 0;
	transform: translateY(-24px);
	transition: all .3s ease;

	.popup-show & {
		opacity: 1;
		transform: none;
	}

	&:hover {
		i {
			transform: rotate(90deg);
		}
	}

	i {
		font-size: 48px;
		transition: all .3s ease;
	}
}

@media only screen and (max-width: 1199.98px) {
	.popup-close {
		top: 32px;
		right: 32px;
	}

	.popup-content {
		width: 648px;
		height: 480px;
	}
}

@media only screen and (max-width: 992.98px) {
	.popup-close {
		top: 8px;
		right: 8px;
	}

	.popup-content {
		width: 100%;
	}
}

@media only screen and (max-width: 767.98px) {
	.popup-close {
		top: 8px;
		right: 8px;
	}

	.popup-wrapper {
		padding: 112px 24px;
		height: auto;
	}
}

@media only screen and (max-width: 479.98px) {
	.popup-close {
		top: 0;
		right: 0;
	}

	.popup-wrapper {
		height: 100%;
	}

	.popup-content {
		height: 320px;
	}
}

@media only screen and (max-width: 320px) {
	.popup-content {
		height: 280px;
	}
}
</style>
