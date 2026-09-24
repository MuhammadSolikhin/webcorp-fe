<script setup lang="ts">
  const localePath = useLocalePath();

  const props = defineProps<{
    guide: { Question: string; Description: string; Slug: string };
    routePathPrefix?: string;
  }>();
</script>

<template>
  <div class="guides-group__card">
    <div class="guides-group__card--body">
      <div class="guides-group__card--content">
        <h2 class="guides-group__card--question fw-bold" v-html="props.guide.Question"></h2>
        <span
          class="guides-group__card--description text-md fw-medium"
          v-html="props.guide.Description"
        ></span>
        <!-- <h2 class="guides-group__card--question fw-bold">{{ props.guide.Question }}</h2> -->
        <!-- <p class="guides-group__card--description text-md fw-medium">
          {{ props.guide.Description }}
        </p> -->
      </div>
      <div class="guides-group__card--link">
        <AppLink
          class="text-primary"
          :to="localePath(`${props.routePathPrefix}/${props.guide.Slug}`)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .guides-group__card {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    border-radius: 24px;
    @media screen and (min-width: $lg) {
      border-radius: 12px;
    }
    background: $light;
    box-shadow: 0px 15px 35px 0px rgba(0, 0, 0, 0.05);
    &--body {
      display: flex;
      padding: 12px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      flex: 1 0 0;
      @media screen and (min-width: $lg) {
        flex-direction: row;
        padding: 24px 26px;
        gap: 36px;
      }
    }
    &--content {
      flex: 1 1 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      @media screen and (min-width: $lg) {
        gap: 36px;
      }
    }
    &--question {
      font-size: clamp(16px, 2vw, 18px);
    }
    &--description {
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }
    &--link {
      display: flex;
      height: 36px;
      padding: 0px 12px;
      justify-content: flex-end;
      align-items: center;
      align-self: stretch;
      @media screen and (min-width: $lg) {
        align-self: flex-end;
      }
    }
  }
</style>
