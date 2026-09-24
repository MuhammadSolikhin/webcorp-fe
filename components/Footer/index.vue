<script setup lang="ts">
  const { footerData } = await useNav();
  const route = useRoute();

  // Define an array of routes where you want to hide the navbar
  const hiddenFooterRoutes = ["/about-us/questions-mobile", "/news-mobile", "/news-mobile/"];

  // Check if the current path matches any hiddenNavRoutes or starts with '/news-mobile'
  const shouldHideFooter = ref(
    hiddenFooterRoutes.includes(route.path) || route.path.startsWith("/news-mobile/")
  );

  const footerLeftMenu = computed(() =>
    footerData.value["Left Menu"].map(i => ({ text: i.Title, slug: i.Route as string }))
  );
  const footerRightMenu = computed(() =>
    footerData.value["Right Menu"].map(item => ({ link: item.Route as string, text: item.Title }))
  );
</script>

<template>
  <footer class="py-4" v-if="!shouldHideFooter">
    <div class="container">
      <div class="d-md-none">
        <FooterAccordion :title="$t('shared.footer.headOffice')">
          <div v-html="$t('shared.footer.headOfficeAddress')"></div>
        </FooterAccordion>
        <FooterAccordion :title="$t('shared.footer.companyInformation')">
          <FooterCompanyInformation :informations="footerLeftMenu" />
        </FooterAccordion>
        <FooterAccordion :title="$t('shared.footer.help')">
          <FooterSupport :support-links="footerRightMenu" />
        </FooterAccordion>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 mb-3 d-none d-md-block">
          <span class="header">
            {{ $t("shared.footer.headOffice") }}
          </span>
          <div class="d-none d-md-block">
            <span class="sub-menu" v-html="$t('shared.footer.headOfficeAddress')"></span>
          </div>
          <FooterSocialMedia />
        </div>
        <div class="col-12 col-md-3 mb-3 d-none d-md-block">
          <span class="header">
            {{ $t("shared.footer.companyInformation") }}
          </span>
          <div class="d-none d-md-block">
            <FooterCompanyInformation :informations="footerLeftMenu" />
          </div>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <span class="header d-none d-md-inline-block">
            {{ $t("shared.footer.help") }}
          </span>
          <div class="d-none d-md-block">
            <FooterSupport :support-links="footerRightMenu" />
          </div>
          <a href="tel:1500910">
            <img
              class="call-center-icon img-fluid"
              src="/icons/call-center.png"
              alt="call center"
            />
          </a>
          <div class="d-md-none">
            <FooterSocialMedia />
          </div>
        </div>
        <div class="mb-md-3 col-12 col-md-3">
          <span class="header d-block">{{ $t("shared.footer.download") }}</span>
          <a
            href="https://apps.apple.com/id/app/hi-by-hibank/id6474590911?l=id"
            target="_blank"
            class="me-2"
          >
            <img src="/icons/ios.png" alt="ios" class="app-store-icon" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.hibank.mobile"
            target="_blank"
          >
            <img class="app-store-icon img-fluid" src="/icons/android.png" alt="android" />
          </a>
        </div>
      </div>
      <hr id="footerBorder" />
      <div class="row">
        <div class="col-md-3">
          <span class="header mb-0"> {{ $t("shared.footer.copyright") }} © 2024 </span>
          <span class="sub-menu">PT Bank Hibank Indonesia, all rights reserved.</span>
        </div>
        <div class="col-md-6">
          <span class="sub-menu">{{ $t("shared.footer.license") }}</span>
          <span class="sub-menu">{{ $t("shared.footer.deposit_guarantee_info") }} <a href="https://apps.lps.go.id/BankPesertaLPSRate" target="_blank">{{ $t("shared.footer.deposit_guarantee_info_here") }}</a></span>
        </div>
        <div class="col-md-3">
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
  footer {
    background-color: map-get($primaryColor, "50");
    color: #ffffff;

    .social-media-icon {
      padding-right: 10px;
      font-size: 10px;
      height: 15px;
    }

    .call-center-icon {
      max-height: 30px;

      @media screen and (max-width: 768px) {
        max-height: 50px;
      }
    }

    #footerBorder {
      border-top: 1px solid white;
      opacity: 1 !important;
    }

    .app-store-icon {
      max-height: 45px;
      margin-bottom: 9px;
    }

    .regulator-icon {
      max-width: 100px;

      @media screen and (max-width: 768px) {
        max-width: 150px;
      }
    }

    .plus-minus {
      float: right;
      max-width: 20px;
    }

    .plus {
      margin-top: 5px;
      margin-right: 5px;
    }
  }

  .header {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #fff;
    display: inline-block;
  }

  .sub-menu {
    font-size: 10px;
    line-height: 1.5;
    display: block;
    margin-bottom: 10px;
    color: map-get($neutralColor, "01");

    &.underlined-text {
      &::after {
        width: 0%;
        bottom: -4px;
      }

      &:hover::after {
        width: 100%;
      }
    }
  }
</style>
