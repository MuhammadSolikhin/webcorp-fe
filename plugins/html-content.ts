export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive("thtml", {
    mounted: (el: HTMLElement, binding: any, _vnode: any) => {
      el.innerHTML = binding && binding.value ? binding.value : "";
    },
    getSSRProps(binding: any) {
      return {
        innerHTML: binding && binding.value ? binding.value : "",
      };
    },
  });
});
