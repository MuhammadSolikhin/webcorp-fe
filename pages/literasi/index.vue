<template>
	<div class="container">
		<div class="video-list">
			<VideoCard v-for="(video, index) in videos" :key="index" :title="video.title" :image="video.image"
				:description="video.description" :views="video.views" :link="video.link" :stars="video.stars" />
		</div>
	</div>
</template>

<script>
import VideoCard from "@/components/shared/VideoCard.vue";

export default {
	components: { VideoCard },
	data() {
		return {
			videos: [
				{
					title: "Pengantar Literasi Digital",
					image: "https://hibank-tumbu.co.id/thumbnails/4bc5c36f01160b9032640aac9faa7e55.png",
					description: "Video pelatihan ini akan menjelaskan apa itu teknologi digital dan bagaimana cara menggunakannya untuk menjadi lebih produktif.",
					views: 119,
					link: "https://hibank-tumbu.co.id/video/222/pengantar-literasi-digital-menjadi-lebih-produktif-dengan-optimalkan-teknologi-digital",
					stars: 0,
					longDescription: "Video pelatihan ini akan menjelaskan apa itu teknologi digital dan bagaimana fungsinya dalam mendukung aktivitas kehidupan sehari-hari..."
				},
				{
					title: "Mengenal Cara Pencatatan Keuangan Secara Digital",
					image: "https://hibank-tumbu.co.id/thumbnails/p1.jpg",
					description: "Video pada pelatihan kewirausahaan online ini bertujuan untuk membantu pengusaha dalam mencatat keuangan secara digital.",
					views: 95,
					link: "https://hibank-tumbu.co.id/video/217/mengenal-cara-pencatatan-keuangan-secara-digital",
					stars: 0,
					longDescription: "Pelatihan ini memberikan pemahaman tentang pentingnya pencatatan keuangan yang baik dalam bisnis, serta cara mengelola keuangan menggunakan aplikasi digital."
				},
				{
					title: "Menghitung Kebutuhan Modal & Potensi Keuntungan Bisnis Retail",
					image: "https://hibank-tumbu.co.id/thumbnails/992ac5c879b06e14d019c32a0123fe09.png",
					description: "Pelatihan ini membantu menghitung kebutuhan modal dan memprediksi potensi keuntungan dalam bisnis retail.",
					views: 24,
					link: "https://hibank-tumbu.co.id/video/219/menghitung-kebutuhan-modal-potensi-keuntungan-bisnis-retail",
					stars: 0,
					longDescription: "Pelatihan ini membahas cara menghitung kebutuhan modal dan mengestimasi potensi keuntungan dalam bisnis retail, serta tips sukses dalam menjalankan bisnis retail."
				},
				{
					title: "Evaluasi Keuntungan Bisnis dan Membangun Strategi Pengembangannya",
					image: "https://hibank-tumbu.co.id/thumbnails/d7b7dbbf8b94d6a62da1dc304244d6fe.png",
					description: "Video ini bertujuan untuk mengevaluasi keuntungan bisnis dan membangun strategi pengembangan untuk usaha kecil.",
					views: 40,
					link: "https://hibank-tumbu.co.id/video/220/evaluasi-keuntungan-bisnis-dan-membangun-strategi-pengembangannya",
					stars: 5,
					longDescription: "Pelatihan ini mengajarkan cara mengevaluasi keuntungan dari bisnis yang ada dan bagaimana cara merancang strategi pengembangan yang dapat meningkatkan profitabilitas."
				},
				{
					title: "Mengurus Perizinan Bisnis Toko Retail",
					image: "https://hibank-tumbu.co.id/thumbnails/97a70ce3c39366621e85153d699f685f.png",
					description: "Panduan untuk mendapatkan izin usaha retail agar bisnis dapat berkembang dengan legalitas.",
					views: 7,
					link: "https://hibank-tumbu.co.id/video/221/mengurus-perizinan-bisnis-toko-retail",
					stars: 0,
					longDescription: "Panduan lengkap tentang cara mengurus izin usaha untuk toko retail, serta apa saja persyaratan dan tahapan yang perlu dipenuhi untuk mendapatkan izin resmi."
				},
				{
					title: "Mulai Mengurus Pajak untuk Kembangkan Bisnis",
					image: "https://hibank-tumbu.co.id/thumbnails/bbaca581eb4a211153d33e4e1071d504.png",
					description: "Mengenalkan pentingnya pengurusan pajak untuk pengembangan bisnis yang berkelanjutan.",
					views: 4,
					link: "https://hibank-tumbu.co.id/video/223/mulai-mengurus-pajak-untuk-kembangkan-bisnis",
					stars: 0,
					longDescription: "Pelatihan ini membahas pentingnya pengurusan pajak yang benar dalam menjalankan bisnis yang berkelanjutan dan bagaimana mematuhi regulasi perpajakan yang berlaku."
				}
			],
		};
	},
};
</script>

<style>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
}

.video-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
}
</style>
