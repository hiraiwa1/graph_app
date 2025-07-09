<script setup>
import { provide, reactive } from "vue";
import { RouterView } from "vue-router";

provide("queryText", reactive(new Map()));

provide("graphDatas", reactive(new Map()));
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
