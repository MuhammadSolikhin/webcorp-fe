interface SEO_OPTIONS {
  title: string;
  description?: string;
  ogTitle: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl: any;
}
export function useAppSeo({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: SEO_OPTIONS) {
  return useSeoMeta({
    title: title.replace(/<[^>]*>?/gm, ""),
    description: description || null,
    ogTitle,
    ogDescription: ogDescription || null,
    ogImage: ogImage || null,
    ogUrl,
    twitterTitle: ogTitle,
    twitterCard: ogImage ? "summary_large_image" : "summary",
    twitterDescription: ogDescription || null,
    twitterImage: ogImage || null,
  });
}
