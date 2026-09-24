import type { NAVData } from "~/types/nav.types";

export const useNav = () => {
  const navRightMenusData = useState(() => [
    {
      type: "right-menu",
      slug: "search",
      icon: "/icons/cil-search.svg",
      iconWidth: "1.6rem",
    },
    // {
    //   type: "right-menu",
    //   slug: "bank-access",
    //   icon: "/icons/internet-banking.png",
    //   iconWidth: "2.5rem",
    //   subTypes: [
    //     {
    //       text: "navigation.login",
    //       icon: "/icons/fi-sr-power.svg",
    //       url: "https://clickmayora.com/",
    //     },
    //     {
    //       text: "navigation.register",
    //       icon: "/icons/fi-file.svg",
    //       url: "https://registration.clickmayora.com/home/",
    //     },
    //   ],
    // },
    {
      type: "right-menu",
      slug: "language",
      icon: null,
      iconWidth: "1.7rem",
      subTypes: [
        {
          id: "id",
          text: "Bahasa Indonesia",
          icon: "/icons/flags/id.svg",
        },
        {
          id: "en",
          text: "English",
          icon: "/icons/flags/us.svg",
        },
      ],
    },
  ]);
  const navStore = useState<NAVData | null>(() => null);
  const { locale } = useI18n();
  const navData = readonly(
    computed(() => (navStore.value ? navStore.value["Navigation Bar"] : null))
  );
  const footerData = readonly(
    computed(() => (navStore.value ? navStore.value.Footer : { "Left Menu": [], "Right Menu": [] }))
  );
  const navLeftMenus = readonly(computed(() => (navData.value ? navData.value["Left Menu"] : [])));
  const hoveredNavItem = shallowRef<null | number>(null); // slug or Route path of hover nav item
  const navRightMenus = readonly(
    computed(() => {
      return navRightMenusData.value.map(item => {
        if (item.slug === "language") {
          item.icon = `/icons/flags/${locale.value === "en" ? "us" : "id"}.svg`;
        }
        return item;
      });
    })
  );
  return { navStore, navData, footerData, navRightMenus, navLeftMenus, hoveredNavItem };
};