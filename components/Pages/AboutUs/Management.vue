<script setup lang="ts">
  import { Management } from "~/types/management.types";
  const props = defineProps<{
    managements: Management[];
  }>();
  const attrs = useAttrs();
  const emits = defineEmits<{
    (e: "update:modelValue", value: string): void;
  }>();
  const selectedManagement = computed({
    get() {
      return attrs.modelValue as string;
    },
    set(value: string) {
      emits("update:modelValue", value);
    },
  });

  const managementData = computed(() => {
    return props.managements.find(item => item.Id.toString() === selectedManagement.value) || null;
  });
  watch(managementData, data => {
    if (data) {
      loadImage(data.Image);
    }
  });

  const loadingImage = ref(false);
  const imageUrl = ref(null);

  function loadImage(imageSrc: string) {
    if (imageUrl.value) imageUrl.value = null;
    loadingImage.value = true;
    const downloadingImage = new Image();
    downloadingImage.onload = function () {
      imageUrl.value = this.src;
      loadingImage.value = false;
    };
    downloadingImage.src = imageSrc;
  }

  onMounted(() => {
    if (managementData.value) {
      loadImage(managementData.value.Image);
    }
  });
</script>

<template>
  <div class="col-12 col-lg-3 managements-container-col">
    <p class="mb-2 managements-label">Anggota</p>
    <div class="d-block d-lg-none">
      <AppFormSelect
        v-model="selectedManagement"
        :options="
          props.managements.map(item => ({
            name: item.Name + ' - ' + item.JobTitle,
            value: item.Id.toString(),
          }))
        "
        :selected="selectedManagement"
      />
    </div>
    <div
      class="py-2 d-none d-lg-block overflow-auto managements-sidebarlist-container"
      :style="{
        maxHeight: props.managements.length > 5 ? '500px' : 'auto',
      }"
    >
      <ul class="p-0 management-sidebarlist">
        <li
          v-for="management in props.managements"
          :key="management.Id"
          class="py-2 mb-3 ps-3"
          :class="selectedManagement === management.Id.toString() && 'active-sidebar'"
          @click="selectedManagement = management.Id.toString()"
        >
          <span class="d-block fw-bold management-name">{{ management.Name }}</span>
          <span class="d-block fw-medium management-job-title">{{ management.JobTitle }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-12 col-lg-9 managements-container-col">
    <div v-if="managementData" class="row member py-4 h-100 w-100 mx-auto align-items-center">
      <div class="col-4">
        <NuxtImg
          v-if="!loadingImage && imageUrl"
          :src="imageUrl"
          :alt="managementData.Name"
          class="w-100 d-block"
          format="webp"
          :quality="60"
          loading="lazy"
        />
        <div v-if="loadingImage" class="d-flex justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div class="col-8">
        <div>
          <AppTitle class="mb-1" size="es">{{ managementData.JobTitle }}</AppTitle>
          <AppText class="mb-3" size="lg">{{ managementData.Name }}</AppText>
          <div class="management-data-description pe-4" v-html="managementData.Description"></div>
        </div>
      </div>
    </div>
  </div>
</template>
