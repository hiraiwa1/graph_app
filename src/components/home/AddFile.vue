<script setup>
import { computed } from "vue";
import { useBtnDisabledStore } from "../../store/btnDisabled";
import { useFilesListStore } from "../../store/fileData";
import { useGraphDataStore } from "../../store/graphData";

const addFilesListStore = useFilesListStore();
const btnDisabledStore = useBtnDisabledStore();
const filesListStore = useFilesListStore();
const graphDataStore = useGraphDataStore();

const addFile = async (input) => {
  const target = input.target;
  const files = target.files;

  await addFilesListStore.addFile(files);

  const isFile = await filesListStore.isFileName(files);
  const isQuery = await graphDataStore.isQueryText();

  btnDisabledStore.isDisabledChack(isFile, isQuery);
};

computed(addFile);
</script>

<template>
  <div class="add-file-area">
    <label
      >CSVディレクトリを開く
      <input type="file" accept=".csv" @change="addFile" multiple />
    </label>
  </div>
</template>

<style scoped>
.add-file-area {
  display: block;
  margin-top: 26px;
}

label {
  display: block;
  width: fit-content;
  padding: 8px 14px;
  border: 2px solid var(--c-gray);
  border-radius: 19px;
  font-size: 14px;
  font-weight: bold;
  margin-inline: auto 0px;
  transform: translateY(-2px);
  box-shadow: 0 2px 0 var(--c-gray);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
label:hover {
  transform: translateY(0);
  box-shadow: 0 0 0 var(--c-gray);
  cursor: pointer;
}
label::before {
  content: "";
  display: inline-block;
  height: 18px;
  width: 23px;
  background: no-repeat center;
  background-image: url(/images/parts/icon_folder.svg);
  vertical-align: sub;
  margin-right: 8px;
}
label > input {
  display: none;
  visibility: hidden;
}
</style>
