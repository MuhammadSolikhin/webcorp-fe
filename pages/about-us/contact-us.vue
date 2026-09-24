<script setup lang="ts">
  import { Network } from "~/types/regions.types";
  import { AppRes } from "~/types/utils.types";
  import { Location } from "~/types/networks.types";
  import WithSidebar from "~/layouts/with-sidebar.vue";

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { banner, links, tabs } = await useProductMeta("about-us/contact-us");
  useAppSeo({
    title: t("page.aboutUs.contactUs.title"),
    ogTitle: t("page.aboutUs.contactUs.title"),
    ogUrl: localePath("/about-us/contact-us"),
    ogImage: banner.value.backgroundImage,
  });

  const isTabletPlus = inject("isTabletPlus");

  const { data: locationRes, error } = await useAPI<AppRes<Location[]>>("networks");

  if (!locationRes.value || error.value) {
    throw createError("unable to load networks");
  }

  const locationList = locationRes.value!.data.map(item => ({
    name: item.Name,
    slug: item.Id.toString(),
  }));
  const activeLocation = useState("active-location", () => locationList[0].slug);

  const location = computed(() =>
    locationRes.value!.data.find(item => item.Id.toString() === activeLocation.value)
  );

  const icons = {
    Phone: "/icons/contact-us/ic_customer service.svg",
    Fax: "Fax",
    "E-mail": "/icons/contact-us/ic_email.svg",
  };
  const latLong = pickFields(location.value!.Networks[0], ["Latitude", "Longitude"]);
  const activeNetwork = shallowRef(latLong);
  const centerCoordinate = shallowRef<string[]>([]);

  function updateCenter(location: { Latitude: string; Longitude: string }) {
    const coordinate = [location.Latitude, location.Longitude];
    document.getElementById("sidebar")?.scrollIntoView({
      behavior: "smooth",
    });
    centerCoordinate.value = coordinate;
  }
  watch(location, loc => {
    if (loc) {
      activeNetwork.value = pickFields(loc!.Networks[0], ["Latitude", "Longitude"]);
    }
  });
  watch(activeNetwork, network => {
    updateCenter({ Latitude: network.Latitude, Longitude: network.Longitude });
  });
  function updateNetwork(network: Network) {
    if (process.client) {
      const offsetTop = (document.querySelector("#map") as HTMLDivElement).offsetTop;
      window.scrollTo({ top: offsetTop - 200 });
    }
    activeNetwork.value = pickFields(network, ["Latitude", "Longitude"]);
  }

  const contactOption = computed(() => (type: string, value: string) => {
    if (type === "E-mail") return `mailto:${value}`;
    else if (type === "Phone") return `tel:+62${value}`;
    else if (type === "Fax") return `fax:${value}`;
    return "";
  });

  onMounted(() => {
    if (activeNetwork.value) {
      updateCenter({
        Latitude: activeNetwork.value.Latitude,
        Longitude: activeNetwork.value.Longitude,
      });
    }
  });
</script>

<template>
  <div>
    <AppHero
      v-if="banner"
      :background-image="banner.backgroundImage"
      :banner-text="''"
      :banner-title="banner.bannerTitle"
      :links="links"
    />
    <div class="bg-secondary">
      <div class="container tabs-container">
        <AppTabs
          :items="tabs"
          :active-item="'contact-us'"
          class="text-white"
          @item-click="
            val => {
              navigateTo(localePath(`/about-us/${val}`));
            }
          "
        />
      </div>
    </div>
    <WithSidebar>
      <template #sidebar>
        <AppSidebarList
          :title="$t('page.location.ourLocations')"
          :lists="locationList"
          :convert-as-dropdown="true"
          :selected="activeLocation"
          :as-link="false"
          @update:sidebar="loc => (activeLocation = loc.slug)"
        />
      </template>
      <template #default>
        <div
          v-if="locationRes && locationRes.data.length"
          :class="isTabletPlus ? '' : 'container py-5'"
        >
          <AppTitle color="black" size="sm" class="mb-4">
            {{ $t("page.location.title") }}
          </AppTitle>
          <ClientOnly>
            <LazyLocationMap
              :center-coordinate="centerCoordinate"
              :locations="location!.Networks"
            />
          </ClientOnly>
          <template v-if="location">
            <div v-for="network in location.Networks" :key="network.Id" class="network">
              <h2 class="network__name cursor-pointer" @click="updateNetwork(network)">
                {{ network.Name }}
              </h2>
              <div class="row">
                <div class="col-12 col-md-6">
                  <p class="network__address" v-html="network.Address || ''"></p>
                </div>
                <div class="col-12 col-md-6">
                  <div class="network__contacts">
                    <p
                      v-for="contact in network.Contacts"
                      :key="contact.Type"
                      class="network__contacts__contact"
                    >
                      <span class="network__contacts__icon">
                        <span v-if="contact.Type === 'Fax'" class="network__contacts__icon-text">
                          Fax
                        </span>
                        <img v-else :src="icons[contact.Type]" />
                      </span>
                      <a
                        :href="contactOption(contact.Type, contact.Value)"
                        class="network__contacts__number text-decoration-none"
                      >
                        {{ contact.Value }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </WithSidebar>
  </div>
</template>

<style lang="scss" scoped>
  .tabs-container {
    @media screen and (min-width: $lg) {
      display: flex;
      justify-content: center;
    }
  }

  .network {
    padding: 30px 0;
    &:not(:last-child) {
      border-bottom: 1px solid #e6e6e6;
    }
    &__name {
      font-size: clamp(20px, 2vw, 24px);
      font-weight: 700;
      color: $secondary;
      margin-bottom: 20px;
      @media screen and (min-width: $md) {
        color: $primary;
      }
    }
    &__address,
    &__contacts {
      font-size: clamp(16px, 2vw, 20px);
      font-weight: 500;
      margin-bottom: 20px;
      @media screen and (min-width: $lg) {
        font-weight: 600;
        margin-bottom: 0;
      }
    }
    &__contacts {
      margin-bottom: 0;
      &__contact {
        margin-bottom: 8px;
      }
      &__icon {
        width: 40px;
        display: inline-block;
        img {
          width: 20px;
          @media screen and (min-width: $lg) {
            width: 24px;
          }
        }
        &-text {
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
</style>
