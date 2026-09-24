<template>
  <nuxt-link
    v-if="!props.back"
    :to="props.to"
    :class="color"
    class="text-decoration-none justify-content-center align-items-center"
  >
    <svg
      v-if="props.dir === 'left'"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.68783 17.5168L0.987826 9.81679C0.871159 9.70013 0.78852 9.57374 0.739909 9.43763C0.691298 9.30152 0.666992 9.15568 0.666992 9.00013C0.666992 8.84457 0.691298 8.69874 0.739909 8.56263C0.78852 8.42652 0.871159 8.30013 0.987826 8.18346L8.68783 0.483461C8.90172 0.269572 9.16908 0.157766 9.48991 0.148044C9.81074 0.138322 10.0878 0.250128 10.3212 0.483461C10.5545 0.69735 10.676 0.964711 10.6857 1.28554C10.6955 1.60638 10.5837 1.88346 10.3503 2.11679L4.63366 7.83346H17.6712C18.0017 7.83346 18.2788 7.94527 18.5024 8.16888C18.726 8.39249 18.8378 8.66957 18.8378 9.00013C18.8378 9.33068 18.726 9.60777 18.5024 9.83138C18.2788 10.055 18.0017 10.1668 17.6712 10.1668H4.63366L10.3503 15.8835C10.5642 16.0974 10.676 16.3696 10.6857 16.7001C10.6955 17.0307 10.5837 17.3029 10.3503 17.5168C10.1364 17.7501 9.86421 17.8668 9.53366 17.8668C9.2031 17.8668 8.92116 17.7501 8.68783 17.5168Z"
        fill="#00697F"
      />
    </svg>

    <span class="fw-bold d-inline-block">
      {{ $t(props.title, props.title) }}
    </span>
    <svg
      v-if="props.dir === 'right'"
      class="d-inline-block"
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_194_5801"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <path d="M0 0H28V28H0V0Z" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_194_5801)">
        <path
          d="M13.1832 22.5166C12.9693 22.3028 12.8575 22.0305 12.8478 21.7C12.838 21.3694 12.9401 21.0972 13.154 20.8833L18.8707 15.1666H5.83317C5.50262 15.1666 5.22553 15.0548 5.00192 14.8312C4.77831 14.6076 4.6665 14.3305 4.6665 14C4.6665 13.6694 4.77831 13.3923 5.00192 13.1687C5.22553 12.9451 5.50262 12.8333 5.83317 12.8333H18.8707L13.154 7.11664C12.9401 6.90275 12.838 6.63053 12.8478 6.29998C12.8575 5.96942 12.9693 5.6972 13.1832 5.48331C13.3971 5.26942 13.6693 5.16248 13.9998 5.16248C14.3304 5.16248 14.6026 5.26942 14.8165 5.48331L22.5165 13.1833C22.6332 13.2805 22.7158 13.4021 22.7644 13.5479C22.813 13.6937 22.8373 13.8444 22.8373 14C22.8373 14.1555 22.813 14.3014 22.7644 14.4375C22.7158 14.5736 22.6332 14.7 22.5165 14.8166L14.8165 22.5166C14.6026 22.7305 14.3304 22.8375 13.9998 22.8375C13.6693 22.8375 13.3971 22.7305 13.1832 22.5166Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </nuxt-link>
  <button
    v-else
    :class="color"
    class="text-decoration-none justify-content-center align-items-center"
    @click.prevent="goBack"
  >
    <svg
      v-if="props.dir === 'left'"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.68783 17.5168L0.987826 9.81679C0.871159 9.70013 0.78852 9.57374 0.739909 9.43763C0.691298 9.30152 0.666992 9.15568 0.666992 9.00013C0.666992 8.84457 0.691298 8.69874 0.739909 8.56263C0.78852 8.42652 0.871159 8.30013 0.987826 8.18346L8.68783 0.483461C8.90172 0.269572 9.16908 0.157766 9.48991 0.148044C9.81074 0.138322 10.0878 0.250128 10.3212 0.483461C10.5545 0.69735 10.676 0.964711 10.6857 1.28554C10.6955 1.60638 10.5837 1.88346 10.3503 2.11679L4.63366 7.83346H17.6712C18.0017 7.83346 18.2788 7.94527 18.5024 8.16888C18.726 8.39249 18.8378 8.66957 18.8378 9.00013C18.8378 9.33068 18.726 9.60777 18.5024 9.83138C18.2788 10.055 18.0017 10.1668 17.6712 10.1668H4.63366L10.3503 15.8835C10.5642 16.0974 10.676 16.3696 10.6857 16.7001C10.6955 17.0307 10.5837 17.3029 10.3503 17.5168C10.1364 17.7501 9.86421 17.8668 9.53366 17.8668C9.2031 17.8668 8.92116 17.7501 8.68783 17.5168Z"
        fill="#00697F"
      />
    </svg>
    <span class="fw-bold d-inline-block">
      {{ $t(props.title, props.title) }}
    </span>
    <svg
      v-if="props.dir === 'right'"
      class="d-inline-block"
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_194_5801"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <path d="M0 0H28V28H0V0Z" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_194_5801)">
        <path
          d="M13.1832 22.5166C12.9693 22.3028 12.8575 22.0305 12.8478 21.7C12.838 21.3694 12.9401 21.0972 13.154 20.8833L18.8707 15.1666H5.83317C5.50262 15.1666 5.22553 15.0548 5.00192 14.8312C4.77831 14.6076 4.6665 14.3305 4.6665 14C4.6665 13.6694 4.77831 13.3923 5.00192 13.1687C5.22553 12.9451 5.50262 12.8333 5.83317 12.8333H18.8707L13.154 7.11664C12.9401 6.90275 12.838 6.63053 12.8478 6.29998C12.8575 5.96942 12.9693 5.6972 13.1832 5.48331C13.3971 5.26942 13.6693 5.16248 13.9998 5.16248C14.3304 5.16248 14.6026 5.26942 14.8165 5.48331L22.5165 13.1833C22.6332 13.2805 22.7158 13.4021 22.7644 13.5479C22.813 13.6937 22.8373 13.8444 22.8373 14C22.8373 14.1555 22.813 14.3014 22.7644 14.4375C22.7158 14.5736 22.6332 14.7 22.5165 14.8166L14.8165 22.5166C14.6026 22.7305 14.3304 22.8375 13.9998 22.8375C13.6693 22.8375 13.3971 22.7305 13.1832 22.5166Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </button>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";

  interface Props {
    invertTextColorOnMobile?: boolean;
    title?: string;
    to: any;
    dir?: "left" | "right";
    showIcon: boolean;
    color: null | "primary" | "secondary" | "dark" | "light" | "white" | "dark-gray" | "black";
    back?: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    invertTextColorOnMobile: false,
    title: "shared.seeMore",
    dir: "right",
    showIcon: true,
    color: "primary",
    back: false,
  });
  const color = computed(() =>
    props.color ? (props.color.includes("text-") ? props.color : "text-" + props.color) : ""
  );

  const router = useRouter();

  function goBack() {
    // Use "from" query param if present, else fallback to props.to or '/blogs/all'
    const from = (router.currentRoute.value.query.from as string) || null;
    console.log("from", from);

    const fallback =
      from ||
      (typeof props.to === "string"
        ? props.to
        : props.to && props.to.path
        ? props.to.path
        : "/blogs/all");
    router.push(fallback);
  }
</script>
<style lang="scss" scoped>
  a,
  .nuxt-link-active,
  .nuxt-link-exact-active {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    text-decoration: none;
  }

  button {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>
