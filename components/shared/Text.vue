<script setup lang="ts">
  interface Props {
    tag: string;
    size: "xl" | "lg" | "md" | "sm" | "md-extend";
    color: null | "primary" | "secondary" | "dark" | "light" | "white" | "dark-gray" | "black";
    htmlContent?: string | undefined;
  }
  const props = withDefaults(defineProps<Props>(), {
    tag: "p",
    size: "sm",
    color: "dark",
    htmlContent: undefined,
  });
  const attrs = useAttrs();
  const color = computed(() =>
    props.color ? (props.color.includes("text-") ? props.color : "text-" + props.color) : ""
  );
  const classs = computed(() => `text-${props.size} ${color.value}`);
</script>
<template>
  <component
    :is="props.tag"
    v-if="props.htmlContent"
    v-thtml="props.htmlContent"
    :class="classs"
    v-bind="attrs"
  >
    <slot />
  </component>
  <component :is="props.tag" v-else :class="classs" v-bind="attrs">
    <slot></slot>
  </component>
</template>
