<script setup lang="ts">
  const accordionVisible = ref(false);
  const random = (Math.random() * 100).toString(36).substring(5);
  const props = defineProps<{
    title: string;
  }>();
</script>

<template>
  <div class="accordion mb-4">
    <div class="accordion-item">
      <h2 :id="`panelsStayOpen-${random}`" class="accordion-header">
        <button
          class="header btn-nothing d-block w-100 text-start accordion-toggle-button justify-content-between d-flex"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="`#panelsStayOpen-collapse${random}`"
          aria-expanded="false"
          :aria-controls="`panelsStayOpen-collapse${random}`"
          @click="accordionVisible = !accordionVisible"
        >
          <span>
            {{ props.title }}
          </span>
          <span>
            <img
              :src="accordionVisible ? '/icons/collapse-minus.svg' : '/icons/collapse-plus.svg'"
              alt=""
            />
          </span>
        </button>
      </h2>
      <div
        :id="`panelsStayOpen-collapse${random}`"
        class="accordion-collapse collapse"
        :aria-labelledby="`panelsStayOpen-${random}`"
      >
        <div class="accordion-body py-0">
          <span class="sub-menu"> <slot></slot></span>
        </div>
      </div>
    </div>
    <hr class="break-line" />
  </div>
</template>

<style lang="scss" scoped>
  .accordion-item {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
  }
  .accordion-toggle-button {
    font-size: 12px;
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    background-color: transparent;
    border: none;
    color: #fff;
  }
  .break-line {
    border-top: 1px solid map-get($primaryColor, "10");
    margin-top: 10px;
    margin-bottom: 10px;
    opacity: 1;
  }
</style>
