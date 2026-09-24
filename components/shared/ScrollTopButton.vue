<template>
  <button
    v-show="show"
    class="scroll-to-top-btn"
    @click="scrollToTop"
  >
    <ArrowUpVue :fillColor="'white'" :size="1.6" />
  </button>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef } from 'vue'
import ArrowUpVue from '~/assets/icons/ArrowUp.vue'

const show = shallowRef(false)

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function handleScroll() {
  show.value = window.scrollY >= 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: map-get($secondaryColor, "50");
  border: none;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
}
</style>
