<template>
  <div id="comingSoonWrapper">
    <div class="text-center container h-100 d-flex justify-content-center align-items-center">
      <div>
        <img class="img-fluid" src="~/assets/gifs/spinner.gif" alt="spinner" />
        <span class="first-title">
          Something Exciting<br />
          <span class="second-title">is Coming Your Way</span>
        </span>
        <span class="stay-tuned mt-5 mb-1">STAY TUNED</span>
        <span class="release-date">January 2023</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    layout: "empty",
  });
  useHead({
    title: "Coming soon",
  });
</script>

<style lang="scss" scoped>
  #comingSoonWrapper {
    height: 100vh;
    background-color: map-get($secondaryColor, "10");
  }

  img {
    height: 125px;
  }

  .first-title {
    display: block;
    font-size: 30px;
    font-weight: bolder;
    margin-top: 30px;
    color: map-get($primaryColor, "50");
    line-height: 1.2;
  }

  .second-title {
    color: map-get($secondaryColor, "50");
  }

  .stay-tuned {
    display: block;
    font-size: 13px;
    color: map-get($primaryColor, "50");
  }

  .description {
    font-size: 12px;
    display: block;
  }

  .release-date {
    display: block;
    font-size: 26px;
    font-weight: bold;
    color: map-get($primaryColor, "50");
  }

  .follow-us {
    display: block;
    font-size: 10px;
    color: map-get($primaryColor, "50");
  }

  .social-media-icon {
    color: map-get($primaryColor, "50");
  }

  .social-media-icon {
    padding-right: 10px;
    font-size: 10px;
    height: 15px;
    color: green;
  }
</style>
