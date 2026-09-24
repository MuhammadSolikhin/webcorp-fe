<script setup lang="ts">
const { assetUrl } = useRuntimeConfig().public;
const { locale } = useI18n();

const imageUrl = computed(() => {
  const image =
    locale.value === "id"
      ? "flow-pengaduan.jpeg"
      : "flow-complaint-en.jpg";

  return `${assetUrl}/uploads/Media/ComplaintPublication/${image}`;
});
</script>

<template>
  <div>
    <AppTitle :title="$t('page.complaint.complaintProcess')" />

    <p class="secondary-color fw-bold mb-0 mt-4 font-family-title">
       {{ $t("page.complaint.processTitle") }}
    </p>

    <ol>
      <li class="mt-3">
        {{ $t("page.complaint.step1") }}
      </li>
      <!-- div -->
      <li class="row">
        <div class="col-12 col-lg-6">
          <table class="theme-table table-neutral--02 text-center">
            <tbody>
              <tr>
                <td class="align-middle">
                  <NuxtImg src="/icons/call.svg" class="img-fluid" />
                  <span class="d-block mt-3 primary-color fw-bold">
                     {{ $t("page.complaint.call") }}<br />
                     {{ $t("page.complaint.callCenter") }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="align-middle">
                  <NuxtImg src="/icons/website.svg" class="img-fluid" />
                  <span class="d-block mt-3 primary-color fw-bold">
                    {{ $t("page.complaint.website") }}<br />
                    {{ $t("page.complaint.websiteUrl") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-12 col-lg-6">
          <table class="theme-table table-neutral--02 text-center">
            <tbody>
              <tr>
                <td class="align-middle">
                  <NuxtImg src="/icons/mail.svg" class="img-fluid" />
                  <span class="d-block mt-3 primary-color fw-bold">
                    {{ $t("page.complaint.email") }}<br />
                    {{ $t("page.complaint.emailAddress") }}
                  </span>
                </td>
              </tr>
              <tr class="mt-3">
                <td class="align-middle">
                  <NuxtImg src="/icons/building.svg" class="img-fluid" />
                  <span class="d-block mt-3 primary-color fw-bold">
                     {{ $t("page.complaint.visitOffice") }}<br />
                     {{ $t("page.complaint.bankName") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>

      <li class="mt-3">
        {{ $t("page.complaint.step2") }}
      </li>

      <li class="mt-3">
        {{ $t("page.complaint.step3") }}
      </li>

      <li class="mt-3 text-justify">
        {{ $t("page.complaint.step4") }}
      </li>

      <li class="mt-3 text-justify">
        {{ $t("page.complaint.step5") }}
      </li>

    </ol>

    <p class="secondary-color fw-bold mb-0 mt-4 font-family-title">
        {{ $t("page.complaint.complaintChannel") }}
    </p>
    <NuxtImg :src="imageUrl" class="img-fluid" />
  </div>
</template>