<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-float"
    aria-label="Chat via WhatsApp"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="white"
      width="28"
      height="28"
    >
      <path
        d="M16.004 0C7.165 0 .003 7.16.003 15.997c0 2.82.737 5.576 2.138 8.003L.014 32l8.2-2.148a15.94 15.94 0 0 0 7.79 2.014c8.838 0 15.997-7.16 15.997-15.997C32 7.16 24.842 0 16.004 0zm0 29.2a13.26 13.26 0 0 1-7.06-2.03l-.506-.3-4.87 1.277 1.3-4.75-.33-.525A13.24 13.24 0 0 1 2.67 15.997C2.67 8.636 8.64 2.667 16.004 2.667c7.362 0 13.33 5.97 13.33 13.33 0 7.362-5.968 13.203-13.33 13.203zm7.305-9.897c-.4-.2-2.366-1.167-2.733-1.3-.367-.134-.634-.2-.9.2-.267.4-1.034 1.3-1.267 1.567-.234.267-.467.3-.867.1-.4-.2-1.69-.622-3.22-1.985-1.19-1.06-1.993-2.37-2.227-2.77-.233-.4-.024-.616.176-.816.18-.18.4-.467.6-.7.2-.234.267-.4.4-.667.134-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.234-2.967-.325-.78-.655-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.367-1.4 3.334 0 1.966 1.434 3.866 1.634 4.133.2.267 2.82 4.304 6.832 6.033.955.412 1.7.658 2.28.842.958.305 1.83.262 2.52.16.77-.115 2.366-.968 2.7-1.902.334-.934.334-1.734.234-1.9-.1-.167-.367-.267-.767-.467z"
      />
    </svg>
  </a>
</template>

<script setup lang="ts">
const phoneNumber = "621500910"; // Ganti dengan nomor WhatsApp yang sesuai
const message = "Halo, saya ingin bertanya tentang layanan hibank.";

const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
</script>

<style lang="scss" scoped>
.whatsapp-float {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #25d366;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
