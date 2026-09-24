import type { RouterOptions } from "@nuxt/schema";

function setScrollPosition(to: any, from: any, savedPosition: any) {
  if (to.hash) {
    return { el: to.hash, top: 100 };
  }
  if (to.path === from.path) return;
  if (savedPosition) {
    return savedPosition;
  } else {
    return { top: 0, behavior: "smooth" };
  }
}

export default <RouterOptions>{
  scrollBehavior(_to, _from, _savedPosition) {
    const nuxtApp = useNuxtApp();
    if (_to.path !== _from.path) window.apploaded = undefined;
    if (window.apploaded) {
      return setScrollPosition(_to, _from, _savedPosition);
    } else {
      return new Promise(resolve => {
        nuxtApp.hook("page:finish", () => {
          window.apploaded = true;
          resolve(setScrollPosition(_to, _from, _savedPosition));
        });
      });
    }
  },
};