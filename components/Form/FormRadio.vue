<template>
  <div class="input-wrapper">
    <label for="disabledTextInput" class="form-label fw-bold">
      {{ label }}
    </label>
    <div class="d-flex gap-4">
      <div
        v-for="(opt, i) in options"
        :key="opt.text"
        class="form-check pl-0 d-flex align-items-center gap-2"
      >
        <input
          :id="'sendCopy-' + i"
          class="rounded-circle"
          type="radio"
          name="radio-sendCopy"
          :value="opt.value"
          @input="$emit('update:modelValue', ($event.target! as HTMLInputElement).value)"
        />
        <label class="form-check-label fw-bold" :for="'sendCopy-' + i">{{ opt.text }}</label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{ options: { text: string; value: string }[]; label: string }>();
</script>

<style lang="scss" scoped>
  input {
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: $primary;
    width: 20px;
    height: 20px;
    border: 2px solid $primary;
    border-radius: 50%;
    display: inline-block;
    position: relative;
  }
  input[type="radio"]:focus,
  input[type="radio"]:checked {
    border: 2px solid $primary;
  }

  input[type="radio"]::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: 120ms transform ease-in-out;
    background-color: $primary;
  }
  input[type="radio"]:checked::before {
    transform: translate(-50%, -50%) scale(1);
  }
</style>
