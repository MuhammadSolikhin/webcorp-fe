<script setup lang="ts">
  const isTabletPlus = inject("isTabletPlus");
</script>

<template>
  <div :class="isTabletPlus ? 'container py-5' : ''">
    <div class="row w-100 mx-auto">
      <div class="col-12">
        <div :class="isTabletPlus ? '' : 'container py-5'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
