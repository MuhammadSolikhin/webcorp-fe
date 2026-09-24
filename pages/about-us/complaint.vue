<script setup lang="ts">
  import type { Complaint } from "~/components/Pages/Complaint/ComplaintPublication.vue";
  import WithSidebar from "~/layouts/with-sidebar.vue";

  const { t } = useI18n();
  const localePath = useLocalePath();

  useAppSeo({
    title: t("page.complaint.title"),
    ogTitle: t("page.complaint.title"),
    ogUrl: localePath("/about-us/complaint"),
    ogImage: "/images/Pengaduan_notxt.jpg",
  });

  const sidebars = computed(() => [
    {
      name: t("page.complaint.complaintProcess"),
      slug: "complaint-process",
    },
    {
      name: t("page.complaint.complaintPublication.title"),
      slug: "complaint-publication",
    },
    {
      name: t("page.complaint.complaintForm"),
      slug: "complaint-form",
    },
  ]);
  const { apiUrl } = useRuntimeConfig().public;
  const { locale } = useI18n();

  const { data: complaintPublications } = await useFetch<Complaint[]>(
    `${apiUrl}/${locale.value}/complaint-publications`,
    {
      default: () => [],
    }
  );
  const route = useRoute("about-us-complaint");
  const currentPage = route.query.tab && sidebars.value.find(item => item.slug === route.query.tab);
  const activeSidebar = useState(
    Math.random().toString(36),
    () => currentPage || sidebars.value[0]
  );

  const links = computed(() => [
    { title: t("page.aboutUs.aboutUs.title"), to: localePath("/about-us") },
    { title: t("page.aboutUs.complaint.heroTitle"), to: localePath("/about-us/complaint") },
  ]);

  onMounted(() => {
    navigateTo(localePath({ query: { tab: activeSidebar.value.slug } }));
  });
</script>

<template>
  <div>
    <AppHero
      :links="links"
      background-image="/images/Pengaduan_notxt.jpg"
      :banner-title="t('page.aboutUs.complaint.heroTitle')"
      :banner-text="''"
    />
    <WithSidebar>
      <template #sidebar>
        <AppSidebarList
          :title="$t('page.complaint.sidebarTitle')"
          :lists="sidebars"
          :selected="activeSidebar?.slug"
          :convert-as-dropdown="true"
          :as-link="true"
          query-key="tab"
          @update:sidebar="val => (activeSidebar = val)"
        />
      </template>
      <template #default>
        <div id="dynamicContent">
          <ComplaintProcess v-if="activeSidebar?.slug === 'complaint-process'" />
          <ComplaintPublication
            v-else-if="activeSidebar?.slug === 'complaint-publication'"
            :data="complaintPublications!"
          />
          <ComplaintForm v-else-if="activeSidebar?.slug === 'complaint-form'" />
        </div>
      </template>
    </WithSidebar>
  </div>
</template>
