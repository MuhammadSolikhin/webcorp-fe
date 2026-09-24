<template>
  <div>
    <div class="card p-4">
      <SharedTitle class="mb-3" :title="`Simulasi Perhitungan Angsuran ${props.title}`" />
      <div class="row mt-4">
        <div class="col-12 col-md-5 text-end pe-4 primary-color fw-bold my-auto">
          {{ $t("calculator.creditLimit") }}
        </div>
        <div class="col-12 col-md-7 position-relative">
          <span class="floating-prepend">Rp</span>
          <VueNumeric
            v-model="calculator.creditLimit"
            class="form-control form-control-sm"
            separator="."
          ></VueNumeric>
        </div>
      </div>
      <div class="row my-4">
        <div class="text-end pe-4 primary-color fw-bold my-auto col col-12 col-md-5">
          {{ $t("calculator.timePeriod") }}
        </div>
        <div class="col-12 col-md-7">
          <div class="row">
            <div class="col-9">
              <input
                v-model="calculator.timePeriod"
                placeholder="0"
                type="number"
                class="form-control"
              />
            </div>
            <div class="col col-3 my-auto ps-0 text-start">
              {{ $t("calculator.year") }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-5 text-center pe-4 text-md-end primary-color fw-bold my-auto">
          {{ $t("calculator.interestRate") }}
        </div>
        <div class="col-12 col-md-7">
          <div class="row">
            <div class="col-9">
              <input
                v-model="calculator.interestRate"
                class="form-control"
                placeholder="0.00"
                type="number"
              />
            </div>
            <div class="col my-auto ps-0 text-start">
              {{ $t("calculator.annual") }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-0 col-md-5"></div>
        <div class="text-center text-md-start mt-4 col-12 col-md-7">
          <div class="row">
            <div class="my-auto col-12 col-lg-6">
              <button
                :disabled="!inputCompleted"
                class="btn primary-btn pt-2 px-5"
                @click="calculate()"
              >
                {{ $t("calculator.calculate") }}
              </button>
            </div>
            <div class="my-auto col-12 col-lg-6">
              <span class="primary-color fw-bold ms-3 reset" @click="reset()">
                {{ $t("calculator.reset") }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 row">
        <div class="text-center pe-4 text-md-end primary-color fw-bold my-auto col-12 col-md-5">
          {{ $t("calculator.installmentValue") }}
        </div>
        <div class="col-12 col-md-7 position-relative">
          <span class="floating-prepend">Rp</span>
          <input
            id="installmentvalue"
            v-model="calculator.installmentValue"
            class="me-sm-2 form-control"
            placeholder="0.00"
            readonly
          />
        </div>
      </div>
    </div>
    <small class="text-start latest-update mt-2">
      *{{ $t("calculator.disclaimer") }}<br />
      {{ $t("calculator.interestRateSystem") }} {{ props.type.toUpperCase() }} in Arrear
    </small>
  </div>
</template>
<script setup lang="ts">
  import VueNumeric from "@handcrafted-market/vue3-numeric";

  import { IPMT, PMT, PPMT } from "./calculate";
  const props = defineProps<{ title: string; type: string }>();

  const calculator = useState("calculator", () => ({
    creditLimit: 400000000 as null | number,
    timePeriod: 60 as null | number,
    interestRate: 9 as null | number,
    installmentValue: null as null | string,
  }));
  const inputCompleted = computed(() => {
    const { creditLimit, interestRate, timePeriod } = calculator.value;
    return creditLimit !== null && timePeriod !== null && interestRate !== null;
  });
  function calculate() {
    if (!inputCompleted.value) return;
    let installmentValue = null;
    const { interestRate, timePeriod, creditLimit } = calculator.value;

    const RATE = interestRate! / 100 / 12;
    const YEAR = timePeriod! * 12;

    if (props.type === "flat") {
      const ppmt = PPMT({
        rate: RATE,
        per: 1,
        nper: YEAR,
        pv: creditLimit! * -1,
        fv: 0,
        type: 0,
      });
      const pmt = PMT({
        rate: RATE,
        nper: YEAR,
        pv: creditLimit! * -1,
        fv: 0,
        type: 0,
      });
      const ipmt = IPMT({ pv: creditLimit! * -1, pmt, rate: RATE, per: 0 });
      installmentValue = formatPrice((ppmt! + ipmt).toFixed(2));
    } else {
      const installment = creditLimit! / YEAR;
      const pmt = PMT({
        rate: RATE,
        nper: YEAR,
        pv: creditLimit! * -1,
        fv: 0,
        type: 0,
      });
      const ipmt = IPMT({ pv: creditLimit! * -1, pmt, rate: RATE, per: 0 });

      installmentValue = formatPrice((ipmt + installment).toFixed(2));
    }

    calculator.value.installmentValue = installmentValue;
  }
  function reset() {
    calculator.value.creditLimit = null;
    calculator.value.installmentValue = null;
    calculator.value.interestRate = null;
    calculator.value.timePeriod = null;
  }
  onMounted(() => {
    reset();
  });
</script>

<style lang="scss" scoped>
  #installmentvalue {
    background: white;
  }

  .card {
    outline: 0;
    border: 0;
    border-radius: 15px;
    background-color: map-get($primaryColor, "10");
  }
  .reset {
    cursor: pointer;
  }
  .floating-prepend {
    position: absolute;
    left: -15px;
    top: 3px;
  }
</style>
