<template>
	<div class="container">
		<!-- Video Detail Section -->
		<div v-if="playerData" class="video-detail">
			<!-- Breadcrumbs Menu -->
			<div class="breadcrumbs py-3">
				<Breadcrumb v-if="links" class="d-block d-lg-none" color="dark" :links="links" />
				<div class="d-none d-lg-block">
					<AppLink :to="localePath('/literasi')" :title="$t('Kembali')" dir="left" class="back-link" />
				</div>
			</div>

			<!-- Media Player Section -->
			<!-- <h2 class="video-detail__title">{{ playerData.title }}</h2> -->
			<media-player>
				<media-provider v-for="(source, index) in playerData.sources" :key="index" :src="source.src">
					<template v-if="source.type === 'video'">
						<!-- Video player with autoplay and consistent size -->
						<video :src="source.src" :poster="source.poster" controls autoplay class="video-player"></video>
					</template>
				</media-provider>
			</media-player>


			<!-- Video Info Section -->
			<div class="video-info">
				<h1 class="video-info__title">{{ playerData.title }}</h1>
				<div class="video-info__stats">
					<p><strong>Ditonton:</strong> {{ playerData.views }} kali</p>
					<div class="star-ratings" :title="`${playerData.stars} Stars`">
						<span v-for="i in 5" :key="i" class="star-container">
							<i :class="[
								'fa-solid',
								i <= playerData.stars ? 'fa-star text-yellow-400' : 'fa-star text-gray-400'
							]"></i>
						</span>
					</div>
				</div>
				<p class="video-info__description">{{ playerData.description }}</p>
			</div>

			<!-- Long Description Section -->
			<div class="video-long-description">
				<h2>Detail Video</h2>
				<p v-html="playerData.longDescription"></p>
			</div>
		</div>

		<!-- Error Handling -->
		<div v-else class="error-message">
			<h1>Video tidak ditemukan</h1>
			<p>Silakan kembali ke daftar video Literasi.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { PlayerSrc } from './types/media-player.types';

// Video Data Source
const videos = [
	{
		id: 1,
		title: "Pengantar Literasi Digital",
		image: "https://hibank-tumbu.co.id/thumbnails/4bc5c36f01160b9032640aac9faa7e55.png",
		description:
			"Video pelatihan ini akan menjelaskan apa itu teknologi digital dan bagaimana cara menggunakannya untuk menjadi lebih produktif.",
		views: 119,
		stars: 4,
		longDescription:
			"Video pelatihan ini menjelaskan apa itu teknologi digital, bagaimana fungsinya, dan cara memanfaatkannya.",
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
	},
	{
		id: 2,
		title: "Mengenal Cara Pencatatan Keuangan Secara Digital",
		image: "https://hibank-tumbu.co.id/thumbnails/p1.jpg",
		description: "Video pada pelatihan kewirausahaan online ini bertujuan untuk membantu pengusaha dalam mencatat keuangan secara digital.",
		views: 95,
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
		stars: 0,
		longDescription: "Pelatihan ini memberikan pemahaman tentang pentingnya pencatatan keuangan yang baik dalam bisnis, serta cara mengelola keuangan menggunakan aplikasi digital."
	},
	{
		id: 3,
		title: "Menghitung Kebutuhan Modal & Potensi Keuntungan Bisnis Retail",
		image: "https://hibank-tumbu.co.id/thumbnails/992ac5c879b06e14d019c32a0123fe09.png",
		description: "Pelatihan ini membantu menghitung kebutuhan modal dan memprediksi potensi keuntungan dalam bisnis retail.",
		views: 24,
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
		stars: 0,
		longDescription: "Pelatihan ini membahas cara menghitung kebutuhan modal dan mengestimasi potensi keuntungan dalam bisnis retail, serta tips sukses dalam menjalankan bisnis retail."
	},
	{
		id: 4,
		title: "Evaluasi Keuntungan Bisnis dan Membangun Strategi Pengembangannya",
		image: "https://hibank-tumbu.co.id/thumbnails/d7b7dbbf8b94d6a62da1dc304244d6fe.png",
		description: "Video ini bertujuan untuk mengevaluasi keuntungan bisnis dan membangun strategi pengembangan untuk usaha kecil.",
		views: 40,
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
		stars: 5,
		longDescription: "Pelatihan ini mengajarkan cara mengevaluasi keuntungan dari bisnis yang ada dan bagaimana cara merancang strategi pengembangan yang dapat meningkatkan profitabilitas."
	},
	{
		id: 5,
		title: "Mengurus Perizinan Bisnis Toko Retail",
		image: "https://hibank-tumbu.co.id/thumbnails/97a70ce3c39366621e85153d699f685f.png",
		description: "Panduan untuk mendapatkan izin usaha retail agar bisnis dapat berkembang dengan legalitas.",
		views: 7,
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
		stars: 0,
		longDescription: "Panduan lengkap tentang cara mengurus izin usaha untuk toko retail, serta apa saja persyaratan dan tahapan yang perlu dipenuhi untuk mendapatkan izin resmi."
	},
	{
		id: 6,
		title: "Mulai Mengurus Pajak untuk Kembangkan Bisnis",
		image: "https://hibank-tumbu.co.id/thumbnails/bbaca581eb4a211153d33e4e1071d504.png",
		description: "Mengenalkan pentingnya pengurusan pajak untuk pengembangan bisnis yang berkelanjutan.",
		views: 4,
		videoSrc:
			"https://storage.googleapis.com/webcorporate-dev-uat-bucket/dev/uploads/Media/Literasi/Welcome-to-hibank.mp4",
		stars: 0,
		longDescription: "Pelatihan ini membahas pentingnya pengurusan pajak yang benar dalam menjalankan bisnis yang berkelanjutan dan bagaimana mematuhi regulasi perpajakan yang berlaku."
	}
];

// Get Video Based on Route Params
const route = useRoute();
const video = computed(() => {
	const titleVideo = route.params.title;
	return videos.find((v) => v.title === titleVideo);
});


// Map the Video to PlayerSrc Type
const playerData = computed(() => {
	if (!video.value) return null;
	return {
		title: video.value.title,
		sources: [
			{
				type: 'video',
				src: video.value.videoSrc,
				poster: video.value.image,
			},
		],
		views: video.value.views,
		stars: video.value.stars,
		description: video.value.description,
		longDescription: video.value.longDescription,
	};
});
</script>

<style scoped>
.container {
	max-width: 800px;
	margin: 20px auto;
	padding: 0 15px;
}

.video-detail {
	font-family: Arial, sans-serif;
	line-height: 1.6;
	color: #333;
}

.video-info__title {
	font-size: 20px;
	margin-bottom: 10px;
}

.video-info__stats {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.video-info__description {
	font-size: 14px;
	margin-bottom: 20px;
}

.star-ratings {
	display: flex;
}

.star-container {
	margin-right: 2px;
}

.fa-star {
	font-size: 1.25rem;
}

.text-yellow-400 {
	color: #fbbf24;
}

.text-gray-400 {
	color: #d1d5db;
}

.video-long-description {
	margin-top: 20px;
}

.video-long-description h2 {
	font-size: 18px;
	margin-bottom: 10px;
}

.error-message {
	text-align: center;
	padding: 50px;
	color: red;
}

/* CSS for ensuring the video poster is centered and static */
.video-player {
	width: 100%;
	height: auto;
	background-size: cover;
	background-position: center center;
	object-fit: cover;
}
</style>
