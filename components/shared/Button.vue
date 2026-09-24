<script setup lang="ts">
  const NuxtLink = defineNuxtLink({});
  const isMobile = inject("isMobile");

  const localePath = useLocalePath();

  const isExternal = (url: string) => {
    return url?.startsWith("http") || url?.startsWith("//");
  };

  interface PropsType {
    size: "sm" | "md" | "lg" | "xl";
    height: "medium" | "large";
    variant: "fill" | "outline" | "ghost";
    color: "primary";
    colorScheme: "light" | "dark";
    tag: "button" | "link";
    colorClass: string | null;
    fullOnMobile: boolean;
  }

  const props = withDefaults(defineProps<PropsType>(), {
    size: "sm",
    height: "medium",
    variant: "fill",
    colorScheme: "light",
    tag: "button",
    color: "primary",
    colorClass: null,
    fullOnMobile: false,
  });

  const color = computed(
    () =>
      props.colorClass ||
      `button-${props.color}-${props.colorScheme === "light" ? "" : props.colorScheme + "-"}${
        props.variant
      }`
  );
</script>

<template>
  <component
    :is="props.tag === 'link' || $attrs.to || $attrs.href ? NuxtLink : 'button'"
    class="button"
    :class="`${props.fullOnMobile && isMobile ? 'w-100' : `button-size-${props.size}`}  button-${
      props.height
    } ${color}`"
    v-bind="{
      ...$attrs,
      ...( $attrs.to && !isExternal($attrs.to)
        ? { to: localePath($attrs.to) }
        : {}
      ),
      ...( $attrs.href && !isExternal($attrs.href)
        ? { to: localePath($attrs.href) }
        : {}
      )
    }"
  >
    <slot />
  </component>
</template>