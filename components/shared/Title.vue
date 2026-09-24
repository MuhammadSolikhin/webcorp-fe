<script setup lang="ts">
  interface Props {
    tag: string;
    size: "xl" | "lg" | "md" | "sm" | "es" | null;
    color: "primary" | "secondary" | "dark" | "light" | "white" | "black" | null;
    htmlContent?: string | undefined;
  }
  const props = withDefaults(defineProps<Props>(), {
    tag: "h2",
    size: "md",
    color: "secondary",
    htmlContent: undefined,
  });
  const attrs = useAttrs();
  const color = computed(() =>
    props.color ? (props.color.includes("text-") ? props.color : "text-" + props.color) : ""
  );

  const classs = computed(() => `${props.size ? "title-" + props.size : ""} ${color.value}`);
</script>
<template>
  <component
    :is="props.tag"
    v-if="props.htmlContent"
    v-thtml="props.htmlContent"
    :class="classs"
    v-bind="attrs"
  />
  <component :is="props.tag" v-else :class="classs" v-bind="attrs">
    <slot></slot>
  </component>
</template>
