import { defineComponent, h, onBeforeUnmount } from "vue";
import { useNuxtApp } from "#app/nuxt";
import { useRouter } from "#app/composables/router";

// @ts-expect-error virtual file
import { globalMiddleware } from "#build/middleware";

export default defineComponent({
  name: "LoadingIndicator",
  props: {
    height: {
      type: Number,
      default: 3,
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)",
    },
  },
  setup(props, { slots }) {
    const indicator = useCustomLoadingIndicator();

    // Hook to app lifecycle
    // TODO: Use unified loading API
    const nuxtApp = useNuxtApp();
    const router = useRouter();

    globalMiddleware.unshift(indicator.start);
    router.onError(() => {
      indicator.finish();
    });
    router.beforeResolve((to, from) => {
      if (
        to === from ||
        to.matched.every(
          (comp, index) =>
            comp.components && comp.components?.default === from.matched[index]?.components?.default
        )
      ) {
        indicator.finish();
      }
    });

    router.afterEach((_to, _from, failure) => {
      if (failure) {
        indicator.finish();
      }
    });

    nuxtApp.hook("page:finish", indicator.finish);
    nuxtApp.hook("vue:error", indicator.finish);

    onBeforeUnmount(() => {
      const index = globalMiddleware.indexOf(indicator.start);
      if (index >= 0) {
        globalMiddleware.splice(index, 1);
      }
      indicator.clear();
    });

    return () =>
      h(
        "div",
        {
          class: "nuxt-loading-indicator",
          style: {
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            pointerEvents: "none",
            width: "auto",
            height: `${props.height}px`,
            opacity: indicator.isLoading.value ? 1 : 0,
            background: props.color || undefined,
            backgroundSize: `${(100 / indicator.progress.value) * 100}% auto`,
            transform: `scaleX(${indicator.progress.value}%)`,
            transformOrigin: "left",
            transition: "transform 0.1s, height 0.4s, opacity 0.4s",
            zIndex: 999999,
          },
        },
        slots
      );
  },
});
