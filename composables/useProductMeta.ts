import { ISubTypePage } from "types/subtype.types";

export const useProductMeta = async (path: string) => {
  const { locale } = useI18n();
  const device = useDevice();
  const { apiUrl } = useRuntimeConfig().public;
  const url = `${apiUrl}/${locale.value}/v2/products/${path}`;
  const { data: productRes } = await useAsyncData<{ data: ISubTypePage }>(path, () => $fetch(url), {
    transform: input => {
      input.data.SubPages.forEach(item => {
        item.Active = item.Slug === path;
      });
      return input;
    },
  });

  // if (!productRes.value || !productRes.value.data) {
  //   throw createError(path + " data not loaded");
  // }

  const products = computed(() => productRes.value!.data.SubPage.Products);

  const links = [
    {
      to: productRes.value!.data.Route || "",
      title: productRes.value!.data.Title,
    },
    {
      to: productRes.value!.data.SubPage.Slug,
      title: productRes.value!.data.SubPage.Title,
    },
  ];
  const tabs = productRes.value!.data.SubPages.map(item => ({
    Slug: item.Slug,
    Title: item.Title,
  }));

  const banner = computed(() => ({
    backgroundImage: device.isMobile
      ? products.value[0].MobileHeroImage
      : products.value[0].HeroImage,
    bannerTitle: products.value[0].BannerTitle,
    bannerType: products.value[0].BannerType,
  }));

  return { productRes: readonly(productRes.value!.data), links, tabs, banner, products };
};
