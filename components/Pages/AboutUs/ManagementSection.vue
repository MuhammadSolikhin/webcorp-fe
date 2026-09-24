<script setup lang="ts">
  import { Management } from "~/types/management.types";
  import { ParameterSettings } from "~/types/parameter-settings.types";
  interface ManagementsRes {
    Id: number;
    Name: string;
    Managements: Management[];
  }
  const { t } = useI18n();

  const parameterSettings = inject<ParameterSettings>("parameterSettings", {} as ParameterSettings);
  const { data: managementsRes } = await useAPI<ManagementsRes[]>("managements");
  const activeManagementTab = useState(() => {
    if (managementsRes && managementsRes.value && managementsRes.value.length)
      return managementsRes.value[0];
    return null;
  });
  const selectedManagement = useState("selectedManagement", () => {
    return activeManagementTab.value && activeManagementTab.value.Managements.length
      ? activeManagementTab.value.Managements[0].Id.toString()
      : "";
  });
  watch(activeManagementTab, val => {
    if (val && val.Id !== "organization-structure") {
      selectedManagement.value =
        val && val.Managements.length ? val.Managements[0].Id.toString() : "";
    }
  });

  const managementTabs = computed(() => {
    return managementsRes
      .value!.map(item => ({ Slug: item.Id.toString(), Title: item.Name }))
      .concat(
        parameterSettings["About Us - Organization Structure - Image"]
          ? {
              Slug: "organization-structure",
              Title: t("page.aboutUs.aboutUs.organizationStructure"),
            }
          : { Slug: "", Title: "" }
      );
  });

  function handleTabChange(id: string) {
    if (id === "organization-structure") {
      // update active tab
      activeManagementTab.value = { Id: "organization-structure" };
    } else {
      activeManagementTab.value =
        managementsRes.value!.find(item => item.Id.toString() === id) || null;
    }
  }
</script>
<template>
  <section v-if="activeManagementTab" id="our-load" class="home-page-section-padding">
    <div class="container">
      <div>
        <AppTitle
          size="lg"
          class="our-lead-title"
          :html-content="parameterSettings['About Us - Management - Title']"
        />
        <AppText
          size="lg"
          color="dark-gray"
          class="our-lead-description"
          :html-content="parameterSettings['About Us - Management - Description']"
        />
        <div class="tags-container">
          <AppTags
            :active-item="activeManagementTab.Id.toString()"
            :items="managementTabs"
            @itemClick="handleTabChange"
          />
        </div>
        <div class="mt-2">
          <div
            class="row w-100 mx-auto managements-container"
            :class="
              activeManagementTab.Id === 'organization-structure' ? 'organization-structure' : 'p-0'
            "
          >
            <template v-if="activeManagementTab.Id === 'organization-structure'">
              <AboutUsOrganizationStructure
                :image-url="parameterSettings['About Us - Organization Structure - Image']"
              />
            </template>
            <template v-else>
              <AboutUsManagement
                v-model="selectedManagement"
                :managements="activeManagementTab.Managements"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
  #our-load {
    @media screen and (min-width: $lg) {
      .our-lead-title {
        text-align: center;
      }
      .our-lead-description {
        text-align: center;
      }
    }
    .tags-container {
      display: block;
      @media screen and (min-width: $lg) {
        display: flex;
      }
    }
    .managements-container {
      border-radius: 16px;
      overflow: hidden;
      padding: 15px;
      gap: 20px;
      .managements-container-col {
        @media screen and (max-width: $lg) {
          padding: 0;
        }
      }
      &.organization-structure {
        background-color: #f3f3f3;
        height: 450px;
        @media screen and (min-height: $lg) {
          height: 500px;
        }
      }
      @media screen and (min-width: $lg) {
        gap: 0;
        border: 1px solid $light-gray;
        border-radius: 24px;
        overflow: hidden;
        padding: 0;

        .col-12 {
          padding: 0;
        }
        .col-lg-3 {
          padding-top: 25px;
          padding-bottom: 25px;
          padding-left: 20px;
          background: white;
        }
        .col-lg-9 {
          padding-right: 0px !important;
          @media screen and (max-width: $lg) {
            background: #f3f3f3;
          }
        }
      }
    }
    .member {
      background: $light-muted;
      border-radius: 16px;
      @media screen and (min-width: $lg) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .management-data-description {
        font-weight: 500;
        font-size: clamp(12px, 2vw, 18px);
        max-height: 300px;
        overflow: auto;
        @media screen and (min-width: $lg) {
          font-weight: 400;
        }
      }
    }
    img {
      max-width: 260px;
    }

    .management-sidebarlist {
      list-style: none;
      border-left: 1px solid $light-gray;
      li {
        cursor: pointer;
        opacity: 0.7;
        &.active-sidebar {
          border-left: 2px solid $secondary;
          opacity: 1;

          .management-name {
            color: $primary;
          }
        }
      }
    }
    .managements-label {
      font-weight: 500;
      @media screen and (min-width: $lg) {
        color: $dark-gray;
        font-weight: 700;
      }
    }
  }
</style>
