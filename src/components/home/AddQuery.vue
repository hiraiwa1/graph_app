<script setup>
import { useGraphDataStore } from "../../store/graphData";
import { useBtnDisabledStore } from "../../store/btnDisabled";
import { useFilesListStore } from "../../store/fileData";

const graphDataStore = useGraphDataStore();
const btnDisabledStore = useBtnDisabledStore();
const filesListStore = useFilesListStore();

const changeQueryText = async (e) => {
  await graphDataStore.setQuery(e.target.value);

  const isFile = await filesListStore.isFileName();
  const isQuery = await graphDataStore.isQueryText();

  btnDisabledStore.isDisabledChack(isFile, isQuery);
};

// watch(text,  (newQuery) => graphDataStore.setQuery(newQuery))
</script>

<template>
  <div class="input-query">
    <hgroup>
      <h2>クエリ記入欄</h2>
      <p>※複数ある場合は一行ずつ記入</p>
    </hgroup>
    <!-- <textarea id="query" placeholder="クリエを入力" v-model="text" ></textarea> -->
    <textarea
      id="query"
      placeholder="クリエを入力"
      @change="changeQueryText"
    ></textarea>
  </div>
</template>

<style scoped>
.input-query {
  margin-bottom: 24px;
}
hgroup {
  margin-bottom: 12px;
}
h2 {
  padding-left: 16px;
  position: relative;
  line-height: 22px;
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
}
h2::before {
  content: "";
  height: 100%;
  width: 8px;
  border-radius: 4px;
  display: block;
  background-color: var(--c-blue);
  position: absolute;
  left: 0;
}
hgroup p {
  font-size: 14px;
  color: #7f8189;
  display: inline-block;
  margin-left: 16px;
}

textarea {
  width: 100%;
  height: 98px;
  resize: none;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #dcdfe5;
  color: #7f8189;
  overflow-y: scroll;

  scrollbar-color: #b4bcd1 transparent;
  scrollbar-width: thin;
}
textarea:focus,
textarea:active {
  border-color: #3f6ef2;
  box-shadow: 0px 0px 4px 0px rgba(62, 108, 237, 0.5);
}
textarea::-webkit-scrollbar {
  padding: 4px;
  border-radius: 8px;
  width: 13px;
}
textarea::-webkit-scrollbar-track {
  background-color: #000;
}
textarea::-webkit-scrollbar-thumb {
  border-radius: 2.5px;
}
textarea::placeholder {
  color: var(--c-gray-l);
}
</style>
