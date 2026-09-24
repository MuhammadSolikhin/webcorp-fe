<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      activeItemPrefix?: string;
      triggerReset?: boolean;
    }>(),
    {
      activeItemPrefix: "",
      triggerReset: false,
    }
  );
  defineOptions({ inheritAttrs: false });

  const activeItem = ref<string | null>(null);

  const makePrefix = (val: string) => `${props.activeItemPrefix}-${val}`;

  function setActiveItem(item: string | number) {
    if (makePrefix(item.toString()) === activeItem.value) activeItem.value = null;
    else activeItem.value = makePrefix(item.toString());
  }
  const route = useRoute();
  const getRouteBaseName = useRouteBaseName();

  const isActiveLink = computed(() => {
    return (routePath: string | null) => {
      const baseName = getRouteBaseName(route);
      if (routePath === null && baseName === "type-subType") return true;
      else if (
        routePath &&
        routePath.includes("about-us") &&
        baseName &&
        baseName.includes("about-us")
      )
        return true;
      return false;
    };
  });
  const isActiveItem = computed(() => (id: string) => activeItem.value === makePrefix(id));

  watch(
    () => props.triggerReset,
    value => {
      if (value && activeItem.value) {
        activeItem.value = null;
      }
    }
  );
</script>

<template>
  <div :class="$attrs['wrapper-class']">
    <ul v-bind="$attrs" class="navbar-nav mobile-nav__items d-flex align-items-start">
      <slot
        :is-active-link="isActiveLink"
        :is-active-item="isActiveItem"
        :set-active-item="setActiveItem"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  div {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
