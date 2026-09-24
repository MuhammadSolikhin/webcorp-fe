<template>
  <div>
    <AppTitle :title="$t('page.complaint.complaintPublication.title')" />

    <p class="secondary-color fw-bold mb-0 mt-4 font-family-title">
      {{ $t("page.complaint.complaintPublication.subtitle") }}
    </p>

    <table class="theme-table table-primary-striped">
      <tbody>
        <tr v-for="(publication, index) in data" :key="index">
          <td>{{ publication.Title }}</td>
          <td class="align-middle">
            <a
              :href="publication.Link"
              target="_blank"
              class="text-primary fw-bold text-decoration-none"
              >{{ $t("shared.see") }}</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  export interface Complaint {
    Id: number;
    Title: string;
    Link: string;
  }
  defineProps<{ data: Complaint[] }>();
</script>
