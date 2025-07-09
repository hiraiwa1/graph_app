<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import Head from "../components/head/HeaderImg.vue";

import { useJsonDataStore } from "../store/jsonData";
import { useFilesListStore } from "../store/fileData";
import { useGraphDataStore } from "../store/graphData";

const headImage = ref({
  cls: "graph",
  width: 1920,
  height: 58,
});

const putFailure = ref(false);

const jsonData = useJsonDataStore();
const graphDataStore = useGraphDataStore();
const filesListStore = useFilesListStore();

const router = useRouter();

const listData = ref(Object.entries(jsonData.data));

const toGraph = (data) => {
  const graphData = data[1];

  for (const query in graphData.data) {
    graphDataStore.setData(query, graphData.data[query]);
  }
  graphDataStore.queryArray = graphData.queryArray;
  filesListStore.nameList = data[0].nameList;

  router.push("/graph");
};

const removeItem = async (index) => {
  const oldData = { ...listData.value };
  const newData = listData.value.splice(index, 1);
  const data = newData.reduce((acc, curr) => {
    return { ...acc, [curr[0]]: curr[1] };
  }, {});

  const url = "/createJson.php";
  try {
    const res = await fetch(url, {
      method: "post",
      headers: {
        "Conten-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(res.status);
  } catch (error) {
    console.log(error);
    putFailure.value = true;

    listData.value = oldData;

    setTimeout(() => {
      putFailure.value = false;
    }, 5000);
  }
};
</script>

<template>
  <div>
    <Head :headImage="headImage" />

    <main>
      <div class="inner">
        <section class="btn-area">
          <routerLink to="/">最初に戻る</routerLink>
        </section>

        <h1>リストページ</h1>
        <div v-if="putFailure" class="remove-resolve">
          <p>削除に失敗しました。</p>
        </div>
        <section>
          <table>
            <thead>
              <tr>
                <th>データ名</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) of listData" :key="data[0]">
                <td @click="() => toGraph(data)" class="click-title">
                  {{ data[0] }}
                </td>
                <td>
                  <button @click="removeItem(index)">削除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.inner {
  width: 1360px;
  max-width: 100%;
  padding-inline: 40px;
  margin-inline: auto;

  @media screen and (width <= 1000px) {
    width: 1000px;
    max-width: 1000px;
  }
}

.btn-area {
  margin-top: 32px;
}

.btn-area a {
  text-decoration: none;
  color: var(--c-text);
  display: block;
  width: fit-content;
  height: fit-content;
  line-height: 1em;
  padding: 8px 10px;
  background-color: var(--c-white);
  border: 2px solid var(--c-gray);
  border-radius: 19px;
  font-size: 14px;
  font-weight: bold;
  transform: translateY(-2px);
  box-shadow: 0 2px 0 var(--c-gray);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}
a:hover {
  transform: translateY(0);
  box-shadow: 0 0 0 var(--c-gray);
  cursor: pointer;
}
a::before {
  content: "";
  display: inline-block;
  height: 11px;
  width: 14px;
  background: no-repeat center;
  background-size: contain;
  background-image: url(/images/parts/icon_arrow.svg);
  margin-right: 8px;
}

h1 {
  margin-block: 32px;
}

.remove-resolve {
  position: relative;
}
.remove-resolve p {
  text-align: center;
  border-image: linear-gradient(transparent 90%, tomato 90% 100%) 1 fill/ / 5px;
  position: absolute;
  bottom: 1em;
  left: 50%;
  transform: translate(-50%, 0);
  animation: fadeInAnim 1s both;
}
@keyframes fadeInAnim {
  0% {
    clip-path: polygon(0% 0%, 0% 0%, 100% 0%, 100% 0%);
    border-image: linear-gradient(transparent 90%, tomato 100% 100%) 1 fill/ /
      5px;
  }
  90% {
    clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
    border-image: linear-gradient(transparent 90%, tomato 90% 100%) 1 fill/ /
      5px;
  }
  91% {
    clip-path: none;
    border-image: linear-gradient(transparent 90%, tomato 90% 100%) 1 fill/ /
      5px;
  }
  100% {
    clip-path: none;
    border-image: linear-gradient(transparent 90%, tomato 90% 100%) 1 fill/ /
      5px;
  }
}

table {
  width: 560px;
  margin-inline: auto;
  border-radius: 8px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 8px;
}

thead {
  background-color: var(--c-gray);
}
th {
  font-size: 16px;
  padding: 16px;
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
tbody input:focus-visible {
  outline: var(--c-blue) solid 1px;
}
tbody input:focus {
  border-color: var(--c-blue);
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
td:last-child {
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

.click-title {
  cursor: pointer;
}
</style>
