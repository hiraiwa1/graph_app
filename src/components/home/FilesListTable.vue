<script setup>
import { useFilesListStore } from "../../store/fileData";

const filesList = useFilesListStore();

const removeItem = (key) => {
  filesList.delete(key);
};
</script>

<template>
  <div class="table-area">
    <table>
      <thead>
        <tr>
          <th>CSVファイル名</th>
          <th>
            ラベル
            <span>※必須</span>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[key, item] in filesList.list" :key="key">
          <td>
            {{ item.name }}
          </td>
          <td>
            <input type="text" v-model="item.nameText" />
          </td>
          <td>
            <button @click="removeItem(key)">削除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-area {
  overflow: hidden;
  border-radius: 8px;
}

table {
  width: 100%;
  border-radius: 8px;
  /* border-collapse: collapse; */
  border-collapse: separate;
  border-spacing: 0;
}

thead {
  background-color: var(--c-gray);
}
th {
  font-size: 16px;
  padding: 14px 16px;
  font-weight: bold;
  text-align: center;
}
th span {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  font-weight: normal;
}
tbody td {
  padding: 10px 12px;
  font-size: 14px;
}
tbody input {
  width: 100%;
  height: 100%;
  background-color: #f2f4f7;
  border: 1px solid var(--c-gray);
  padding: 8px;
  border-radius: 6px;
}
/* tbody input:focus-visible {
  outline: var(--c-blue) solid 0.5px;
} */
tbody input:active,
tbody input:focus {
  border-width: 0.5px;
  border-color: var(--c-blue);
  box-shadow: 0px 0px 4px 0px rgba(62, 108, 237, 0.5);
}

/* tbody tr, */
thead,
td {
  border: 1px solid var(--c-gray);
  border-block-width: 0.5px;
}
th {
  border: 0 solid rgba(12, 20, 41, 0.1);
}
th:first-child {
  border-right-width: 1px;
}
th:nth-child(2) {
  border-left-width: 1px;
}
td:first-child {
  border-left-width: 2px;
}
td:nth-child(3) {
  border-right-width: 2px;
}
tr:last-child td {
  border-bottom-width: 2px;
}
tr:last-child td:first-child {
  border-end-start-radius: 8px;
}
tr:last-child td:last-child {
  border-end-end-radius: 8px;
}

td > button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  text-align: center;
  width: 100%;
}
</style>
