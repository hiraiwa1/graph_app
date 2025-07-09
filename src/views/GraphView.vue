<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useBtnDisabledStore } from "../store/btnDisabled";
import { useFilesListStore } from "../store/fileData";
import { useGraphDataStore } from "../store/graphData";
import { useJsonDataStore } from "../store/jsonData";

const graphDataStore = useGraphDataStore();
const filesListStore = useFilesListStore();
const btnDisabled = useBtnDisabledStore();
const jsonData = useJsonDataStore();

const router = useRouter();

import Head from "../components/head/HeaderImg.vue";
import ButtonBase from "../components/button/ButtonBase.vue";
import GraphItem from "../components/graph/GraphItem.vue";

const jsonBtnShow = ref(true);
const jsonFileName = ref("");

if (!router.referrer || router.referrer.name !== "home") {
  console.log("referrer");
  jsonBtnShow.value = false;
}

const headImage = ref({
  cls: "graph",
  width: 1920,
  height: 58,
});

const graphData = ref({
  nameList: filesListStore.nameList,
  data: graphDataStore.datas,
  queryArray: graphDataStore.queryArray,
});

const queryArray = ref(graphDataStore.queryArray);

const isJsonResolve = ref(false);
const jsonResolveState = ref({
  text: "",
  res: null,
});

const setQueryList = () => {
  let list = [];

  for (const queryText of queryArray.value) {
    list.push(graphData.value.data[queryText]);
  }
  return list;
};
const queryList = setQueryList();

const queryListRef = ref(queryList);

const onGoHome = () => {
  graphDataStore.resetData();
  graphDataStore.resetQuery();

  filesListStore.resetFile();
  btnDisabled.disableTrue();

  router.push("/");
};

const submitPhp = async (data) => {
  const url = `${import.meta.env.VITE_URL_ORIGIN}/createJson.php`;

  try {
    const res = await fetch(url, {
      method: "post",
      headers: {
        "Conten-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(res.status);
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const onPutJson = async () => {
  let jsonDataName = jsonFileName.value;
  if (jsonDataName === "") jsonDataName = filesListStore.nameList.join("-");
  const jsonGraphData = await graphData.value;

  const previousData = await jsonData.data;

  previousData[jsonDataName] = jsonGraphData;

  const submitStatus = await submitPhp(previousData);

  if (submitStatus) {
    console.log("Yeah!!Woohoo!!!!");

    jsonResolveState.value.text = "JSONを出力しました";
    jsonResolveState.value.res = true;
  } else {
    jsonResolveState.value.text = "出力に失敗しました";
    jsonResolveState.value.res = false;
  }
  isJsonResolve.value = true;

  setTimeout(() => {
    isJsonResolve.value = false;
    jsonResolveState.value.text = "";
    jsonResolveState.value.res = null;
  }, 5000);
};
</script>

<template>
  <div>
    <Head :headImage="headImage" />

    <main>
      <div class="inner">
        <section class="btn-area">
          <button class="white" @click="onGoHome">最初に戻る</button>
          <div
            :class="`put-json ${isJsonResolve ? 'resolve' : ''}`"
            v-show="jsonBtnShow"
          >
            <input
              type="text"
              v-model="jsonFileName"
              placeholder="データ名を入力"
            />
            <ButtonBase cls="blue file-icon" v-on:clickEvent="onPutJson"
              >JSONで保存</ButtonBase
            >
            <p
              v-if="isJsonResolve"
              :class="`${jsonResolveState.res ? 'success' : 'failure'}`"
            >
              {{ jsonResolveState.text }}
            </p>
          </div>
        </section>

        <section v-if="queryListRef.length > 0 && queryListRef[0].length > 0">
          <div class="graph-list">
            <GraphItem
              :graphData="item"
              v-for="(item, index) of queryListRef"
              :key="item[0].fileData.query"
              :title="item[0].fileData.query"
              :index="index"
            />
          </div>
        </section>
        <section v-else>
          <p>該当、データがありません。</p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  padding-bottom: 40px;
}
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
  margin-block: 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
button.white {
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
button.white:hover {
  transform: translateY(0);
  box-shadow: 0 0 0 var(--c-gray);
  cursor: pointer;
}
button.white::before {
  content: "";
  display: inline-block;
  height: 11px;
  width: 14px;
  background: no-repeat center;
  background-size: contain;
  background-image: url(/images/parts/icon_arrow.svg);
  margin-right: 8px;
}

.put-json {
  display: flex;
  flex-direction: row;
  gap: 14px;
  position: relative;
}
.put-json > input {
  padding-inline: 0.5em;
  border-radius: 8px;
  border: 2px solid var(--c-gray);
}
.put-json > input:active,
.put-json > input:focus {
  border-color: #3f6ef2;
  box-shadow: 0px 0px 4px 0px rgba(62, 108, 237, 0.5);
}
.resolve > P {
  margin-bottom: -0.5em;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  position: absolute;
  bottom: -1lh;
  right: 0;
}
.resolve .success {
  color: #76c832;
}
.resolve .failure {
  color: #c83257;
}

.graph-list {
  display: grid;
  gap: 60px 40px;
  grid-template-columns: repeat(3, calc((100% - 80px) / 3));
  grid-template-rows: auto;
  justify-content: center;
  margin-bottom: 40px;

  @media screen and (width <= 1000px) {
    grid-template-columns: repeat(2, calc((100% - 80px) / 2));
  }
}
</style>
<style>
.resolve:has(> .success) button {
  animation: successAnim 1s both;
}
@keyframes successAnim {
  0% {
    transform: scale(1, 1) translate(0%, -2px);
  }
  15% {
    transform: scale(0.9, 0.9) translate(0%, 5%);
  }
  30% {
    transform: scale(1.3, 0.8) translate(0%, 10%);
  }
  50% {
    transform: scale(0.8, 1.3) translate(0%, -10%);
  }
  70% {
    transform: scale(1.1, 0.9) translate(0%, 5%);
  }
  100% {
    transform: scale(1, 1) translate(0%, -2px);
  }
}
.resolve:has(> .failure) button {
  animation: failureAnim 1s both;
}
@keyframes failureAnim {
  0% {
    transform: scale(1, 1) translate(0%, 0%);
  }
  15% {
    transform: scale(0.9, 0.9) translate(5%, 0%);
  }
  30% {
    transform: scale(0.9, 0.8) translate(-5%, 0%);
  }
  50% {
    transform: scale(1, 1) translate(10%, 0%);
  }
  70% {
    transform: scale(0.9, 0.8) translate(-12%, 0%);
  }
  100% {
    transform: scale(1, 1) translate(0%, 0%);
  }
}
</style>
