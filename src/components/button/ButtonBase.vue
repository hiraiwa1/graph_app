<script setup>
import { ref } from "vue";

const props = defineProps(["cls", "isDisabled"]);
const clsText = ref("btn");
clsText.value =
  props.cls !== "" ? `${clsText.value} ${props.cls}` : clsText.value;

const emit = defineEmits();

const clickEvent = () => {
  emit("clickEvent");
};
</script>

<template>
  <div :class="clsText">
    <button @click="clickEvent" :disabled="props.isDisabled">
      <slot />
    </button>
  </div>
</template>

<style scoped>
.btn {
  margin-top: 3px;
}
button {
  display: block;
  width: 214px;
  height: 48px;
  border-radius: 24px;
  padding: 16px;
  margin-inline: auto;
  line-height: 1;
  font-size: 16px;
  font-weight: bold;
  border-width: 0;
  /* box-shadow: 0 3px var(--c-btn-shadow); */
  transform: translateY(-3px);
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}

button:hover:not([disabled]) {
  box-shadow: 0 0;
  transform: translateY(0px);
  cursor: pointer;
}

.blue button {
  background-color: var(--c-blue);
  color: var(--c-white);
  box-shadow: 0 3px var(--c-btn-shadow);
}
.blue button:hover:not([disabled]) {
  box-shadow: 0 0 var(--c-btn-shadow);
}
.blue-l button {
  background-color: var(--c-blue-l);
  box-shadow: 0 3px var(--c-btn-l-shadow);
}
.blue-l button:hover:not([disabled]) {
  box-shadow: 0 0 var(--c-btn-l-shadow);
}

button[disabled] {
  opacity: 0.8;
}

.file-icon button {
  font-size: 14px;
  padding: 6px 27px;
  height: fit-content;
  width: fit-content;
}
.file-icon button::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 20px;
  background: no-repeat center;
  background-image: url(/images/parts/icon_file.svg);
  background-size: contain;
  vertical-align: sub;
  margin-right: 8px;
}
</style>
