<script setup lang="ts">
  const switchLocalePath = useSwitchLocalePath();
  const emits = defineEmits<{
    (e: "closeAllNav"): void;
  }>();
  const { navRightMenus } = await useNav();
  const languageItems = computed(() => {
    const l = navRightMenus.value.find(i => i.slug === "language");
    if (l) {
      return l.subTypes! as { id: string; text: string; icon: string }[];
    }
    return [];
  });
</script>

<template>
  <span
    id="flag-icon"
    class="accordion-header d-inline-flex justify-content-center align-items-center"
  >
    <button
      class="button collapse-btn p-0"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#lang-coll"
      data-bs-parent="#nav-accordion"
      aria-controls="lang-coll"
      aria-expanded="false"
      @click="emits('closeAllNav')"
    >
      <img
        class="d-block"
        :src="`/icons/flags/${$i18n.locale === 'en' ? 'us' : 'id'}.svg`"
        alt="search"
      />
    </button>
  </span>

  <client-only>
    <Teleport to="#lang-accordion">
      <div id="lang-coll" class="collapse collapse-container" data-bs-parent="#nav-accordion">
        <div class="accordion-body navbar-nav container">
          <p class="change-lang-header">{{ $t("navigation.chooseLanguage") }}</p>

          <div class="options">
            <div v-for="item in languageItems" :key="item.id" class="nav-item">
              <nuxt-link
                :to="switchLocalePath(item.id)"
                class="btn-lang text-decoration-none"
                @click="emits('closeAllNav')"
              >
                <img
                  :id="'flag-' + item.id"
                  class="flag"
                  :src="item.icon"
                  :alt="item.text"
                  style="width: 2rem; height: 2rem"
                />

                <span :class="item.id === $i18n.locale ? 'selected' : ''">
                  {{ item.text }}
                </span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </client-only>
</template>

<style scoped lang="scss">
  #lang-coll {
    width: 100%;
    gap: 42px;
    position: relative;
    z-index: 10000;

    img {
      border-radius: 50%;
    }

    .navbar-nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .change-lang-header {
        padding: 0;
        color: map-get($primaryColor, "50");
        font-weight: 700;
        display: inline-block;
        width: fit-content;
        position: relative;

        &::after {
          display: block;
          position: absolute;
          bottom: -8px;
          content: "";
          height: 2px;
          width: 100%;
          background-color: map-get($secondaryColor, "50");
          transition: all 300ms ease-out;
        }
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 1rem;

        .nav-item {
          padding: 0px;

          .btn-lang {
            display: flex;
            align-items: center;
            gap: 1rem;

            span {
              font-weight: 400;
              color: map-get($neutralColor, "09");

              &.selected {
                font-weight: 700;
                color: map-get($secondaryColor, "50");
              }
            }
          }
        }
      }
    }
  }

  #flag-id,
  #flag-en {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50%;
  }
</style>