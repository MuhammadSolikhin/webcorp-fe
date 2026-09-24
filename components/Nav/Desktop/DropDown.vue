<template>
  <div
    id="right-container"
    class="position-absolute zindex-modal"
    :class="{ opened }"
    :style="{
      top: shrinkNav ? `58px` : `80px`,
      paddingTop: shrinkNav ? '28px' : '32px',
    }"
    @mouseover="emits('update:hoveredNavItem', menuSlug)"
    @mouseleave="emits('update:hoveredNavItem', '')"
  >
    <div id="right-inner-container">
      <ul class="navbar-nav sub-nav-container flex-column" :class="{ opened }">
        <li
          v-for="item in listItems"
          :key="item.text"
          class="nav-item item"
          @click="handleClick(item)"
        >
          <a class="text-decoration-none cursor-pointer" :href="item.url" target="_blank">
            <img :src="item.icon" :alt="item.text" />
            <span class="default">{{ $t(item.text, item.text) }}</span>
          </a>
          <hr class="dropdown-divider" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Item {
    text: string;
    icon: string;
    url?: string;
  }
  defineProps<{
    opened: boolean;
    menuSlug: string;
    listItems: Item[];
  }>();
  const emits = defineEmits<{
    (e: "update:hoveredNavItem", routePath: string): void;
    (e: "click:item", val: Item): void;
  }>();

  function handleClick(item: Item) {
    if (isProxy(item)) emits("click:item", toRaw(item));
    else emits("click:item", toRaw(item));
    emits("update:hoveredNavItem", "");
  }
  const shrinkNav = inject<boolean>("shrinkNav");
</script>

<style lang="scss">
  #right-container {
    width: 258px;
    top: 0px;
    right: 0;
    z-index: 10000;
    background-color: transparent;
    opacity: 1;
    pointer-events: none;
    transition: all 300ms ease;

    &.opened {
      opacity: 1;
      pointer-events: auto;
    }
    #right-inner-container {
      position: relative;
      cursor: default;

      .sub-nav-container {
        padding: 20px 40px;
        width: 100%;
        transform: translateY(-0.6rem);
        background-color: map-get($neutralColor, "01");
        border: 1px solid map-get($neutralColor, "03");
        // border-radius: 0 0 4px 4px;
        opacity: 0;
        &.opened {
          transform: translateY(0);
          opacity: 1;
          background-color: map-get($neutralColor, "01");
          transition: transform 500ms cubic-bezier(0.25, 0.1, 0.32, 0.94),
            opacity 200ms cubic-bezier(0.25, 0.1, 0.32, 0.94);
        }
      }
    }
  }
  .item {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
    a {
      display: flex;
      gap: 20px;
      font-size: 13px;
      align-items: center;
      transition: all 300ms ease;
      &:hover {
        color: map-get($secondaryColor, "50");
      }
    }
    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>