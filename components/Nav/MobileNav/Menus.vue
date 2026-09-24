<script setup lang="ts">
  import MenuItem from "./MenuItem.vue";
  import MenuItems from "./MenuItems.vue";

  const props = defineProps<{ navItemsVisible: boolean }>();

  const localePath = useLocalePath();
  const { navLeftMenus } = await useNav();
</script>

<template>
  <div class="mobile-nav">
    <MenuItems
      v-slot="navItemProps"
      :trigger-reset="!props.navItemsVisible"
      class="container"
      active-item-prefix="left-menu"
    >
      <MenuItem
        v-for="navItem in navLeftMenus"
        :key="navItem.Title"
        :item="{
          Id: navItem.Id,
          Route: localePath(navItem.Route || ''),
          asLink: !!navItem.Route,
          Title: navItem.Title,
          active: navItemProps.isActiveItem(navItem.Id.toString()),
          isLinkActive: navItemProps.isActiveLink(navItem.Route),
          hasChild: !!navItem.Navigations.length,
        }"
        show-underline
        @expend="navItemProps.setActiveItem"
      >
        <template #child-items>
          <MenuItems
            v-slot="menuItemProps"
            :style="navItem.Navigations.length === 1 ? '' : 'padding-left: 24px'"
            :wrapper-class="navItem.Navigations.length === 1 ? 'py-0' : ''"
            active-item-prefix="menu-item"
            :trigger-reset="!navItemProps.isActiveItem(navItem.Id.toString())"
          >
            <MenuItem
              v-for="menuItem in navItem.Navigations"
              :key="menuItem.Title"
              :hide-title="navItem.Navigations.length === 1"
              :item="{
                Id: menuItem.Id,
                Route: menuItem.Route,
                Title: menuItem.Title,
                asLink: false,
                active:
                  navItem.Navigations.length === 1
                    ? true
                    : menuItemProps.isActiveItem(menuItem.Id.toString()),
                hasChild: menuItem.SubNavigations && menuItem.SubNavigations.length ? true : false,
              }"
              @expend="menuItemProps.setActiveItem"
            >
              <template #child-items>
                <MenuItems
                  v-slot="subItemProps"
                  style="padding-left: 24px"
                  active-item-prefix="sub-menu-item"
                  :trigger-reset="
                    navItem.Navigations.length === 1
                      ? !navItemProps.isActiveItem(navItem.Id.toString())
                      : !menuItemProps.isActiveItem(menuItem.Id.toString())
                  "
                >
                  <MenuItem
                    v-for="subMenu in menuItem.SubNavigations"
                    :key="subMenu.Title"
                    :item="{
                      Id: subMenu.Id,
                      Route: subMenu.Route,
                      asLink: false,
                      Title: subMenu.Title,
                      active: subItemProps.isActiveItem(subMenu.Id.toString()),
                      hasChild: !!(subMenu.SubSubNavigations && subMenu.SubSubNavigations.length),
                    }"
                    @expend="subItemProps.setActiveItem"
                  >
                    <template #child-items>
                      <MenuItems
                        v-slot="subSubItemProps"
                        active-item-prefix="sub-sub-menu-item"
                        style="padding-left: 16px; border-left: 1px solid white; margin-left: 8px"
                      >
                        <MenuItem
                          v-for="subSubMenu in subMenu.SubSubNavigations"
                          :key="subSubMenu.Title"
                          link-class="fw-medium"
                          :item="{
                            Id: subSubMenu.Id,
                            Route: subSubMenu.IsStaticRoute ? localePath(subSubMenu.OriginalRoute!) :
                            localePath({
                              path: `/${menuItem.Route}/${subMenu.Route}`,
                              query: { product:subSubMenu.Route }
                            }),
                            Title: subSubMenu.Title,
                            active: subSubItemProps.isActiveItem(subSubMenu.Id.toString()),
                            hasChild: false,
                          }"
                          @expend="subSubItemProps.setActiveItem"
                        />
                      </MenuItems>
                    </template>
                  </MenuItem>
                </MenuItems>
              </template>
            </MenuItem>
          </MenuItems>
        </template>
      </MenuItem>
    </MenuItems>
  </div>
</template>

<style lang="scss" scoped>
  .mobile-nav {
    padding-bottom: 24px;
    width: 100%;
    max-height: 70vh;
    overflow: auto;
    background-color: $secondary;

    .show {
      .nav-coll-title::after {
        width: 100%;
      }
    }
    &__click-mayora {
      padding-top: 10px;
      padding-bottom: 10px;
      gap: 8px;
    }
    &__click-login {
      padding-top: 8px;
      padding-bottom: 8px;
      gap: 8px;
      span {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
  .sub-nav-title {
    color: map-get($neutralColor, "01");
  }
</style>
