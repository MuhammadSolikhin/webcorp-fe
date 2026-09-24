<script setup lang="ts">
  const props = defineProps<{ shareTitle: string }>();
  const url = shallowRef("");
  const socialMediaNames = [
    {
      name: "facebook",
      icon: "/icons/facebook-tosca.svg",
    },
    {
      name: "whatsapp",
      icon: "/icons/whatsapp-tosca.svg",
    },
    {
      name: "twitter",
      icon: "/icons/x-social-media-white-round-icon-tosca.svg",
    },
  ];
  onMounted(() => {
    url.value = window.location.href;
  });
</script>

<template>
  <div>
    <div class="mt-3 d-block share">
      {{ props.shareTitle || $t("shared.share") }}
    </div>
    <div class="d-flex mb-3">
      <ShareNetwork
        v-for="socialMediaName in socialMediaNames"
        :key="socialMediaName"
        :url="url"
        title="hibank"
        description="hibank"
        quote="hibank"
        hashtags="hibank"
        twitter-user="hibank"
        :network="socialMediaName.name"
      >
        <div class="mt-1">
          <nuxt-img
            :src="socialMediaName.icon"
            class="pointer-cursor img-fluid social-media-icon"
            style="height: 24px"
            :title="'share to ' + socialMediaName.name"
          />
        </div>
      </ShareNetwork>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.pointer-cursor) {
    cursor: pointer;
  }

  .social-media-icon {
    width: 24px;
    margin-right: 10px !important;
    font-size: 10px;
  }

  .share {
    font-size: 18px;
    line-height: 26px;
    font-weight: 700;
    display: block;
    color: map-get($primaryColor, "50");
  }
</style>
