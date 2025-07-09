<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import { useBtnDisabledStore } from "../store/btnDisabled";
import { useFilesListStore } from "../store/fileData";
import { useGraphDataStore } from "../store/graphData";
import { useJsonDataStore } from "../store/jsonData";

import Head from "../components/head/HeaderImg.vue";
import AddQuery from "../components/home/AddQuery.vue";
import FilesListTable from "../components/home/FilesListTable.vue";
import AddFlile from "../components/home/AddFile.vue";
import ButtonBase from "../components/button/ButtonBase.vue";

const headImage = ref({
  cls: "top",
  width: 1920,
  height: 100,
});

const btnDisabledStore = useBtnDisabledStore();
const filesListStore = useFilesListStore();
const graphDataStore = useGraphDataStore();
const jsonData = useJsonDataStore();

jsonData.initializa();

const router = useRouter();

window.addEventListener("load", () => {
  const navigationEntries = performance.getEntriesByType("navigation");
  if (navigationEntries.length > 0) {
    const navigationType = navigationEntries[0].type;

    if (navigationType === "reload") {
      graphDataStore.resetData();
      graphDataStore.resetQuery();

      filesListStore.resetFile();
      btnDisabledStore.disableTrue();
    }
  }
});

const semWithDataCustam = (item) => {
  const semSplit = item.split(/,(?=")|(?<="),/);

  const splitData = semSplit.reduce((acc, curr) => {
    let nextData = [];
    if (curr.match(/"/)) {
      nextData.push(curr.replace(/"/g, ""));
    } else {
      const customCurr = curr.replace("\r", "").split(",");
      nextData = [...customCurr];
    }

    return [...acc, ...nextData];
  }, []);

  return splitData;
};

const getDataTypeIndex = (dataTypeText) => {
  const dataType = dataTypeText[0]
    .split(",")
    .map((item) => item.trim().replace("\r", ""));

  // "順位,上位のクエリ,クリック数,表示回数,CTR,掲載順位"
  const dataForm = {
    query: {
      text: "上位のクエリ",
    },
    clickCount: {
      text: "クリック数",
    },
    viewCount: {
      text: "表示回数",
    },
    ctr: {
      text: "CTR",
    },
    ranging: {
      text: "掲載順位",
    },
  };

  for (const key in dataForm) {
    if (dataType.indexOf(dataForm[key].text) >= 0) {
      dataForm[key].index = dataType.indexOf(dataForm[key].text);
    }
  }

  return dataForm;
};

const textDataToObject = async (text, query) => {
  const textArray = text.trim().split("\n");
  const dataTypeText = textArray.slice(0, 1);
  const data = textArray.slice(1);

  const filterData = data.filter((item) => {
    for (const queryText of query) {
      const firstItemIndex = item.indexOf(",");
      const itemQuery = item.slice(0, firstItemIndex);

      if (!item.includes(`,${queryText},`) && itemQuery !== queryText) continue;
      return item;
    }
  });

  const selectData = filterData.reduce((accObj, item) => {
    const dataTypeIndex = getDataTypeIndex(dataTypeText);

    let newItem = [];
    if (item.match(/"/)) {
      newItem = semWithDataCustam(item);
    } else {
      newItem = item.replace("\r", "").split(",");
    }

    const newItemQuery = newItem[dataTypeIndex["query"].index];

    const obj = {
      query: newItemQuery,
      clickCount: newItem[dataTypeIndex["clickCount"].index],
      viewCount: newItem[dataTypeIndex["viewCount"].index],
      ctr: newItem[dataTypeIndex["ctr"].index],
      ranging: newItem[dataTypeIndex["ranging"].index],
    };

    return { ...accObj, [newItemQuery]: obj };
  }, {});

  return selectData;
};

const createFileData = async (file, query) => {
  const fileName = file.nameText;
  const fileTextData = file.fileText;
  const fileData = await textDataToObject(fileTextData, query);

  return {
    fileName,
    fileData,
  };
};

const setDataArray = (fileDataList, query) => {
  const dataArray = [];
  for (const [key, value] of fileDataList) {
    if (value.fileData[query]) {
      const data = {
        fileName: value.fileName,
        fileData: value.fileData[query],
      };

      dataArray.push(data);
    }
  }

  return dataArray;
};

const onGraphView = async () => {
  graphDataStore.setQueryArray();
  const queryArray = graphDataStore.queryArray;

  const fileDataList = new Map();

  for (const [key, item] of filesListStore.list) {
    filesListStore.addFileName(item.nameText);

    const fileData = await createFileData(item, queryArray);

    fileDataList.set(item.nameText, fileData);
  }

  for (const query of queryArray) {
    const setData = await setDataArray(fileDataList, query);

    graphDataStore.setData(query, setData);
  }

  router.beforeEach((to, from, next) => {
    router["referrer"] = from;
    next();
  });

  router.push("/graph");
};

const onGotoList = () => {
  graphDataStore.resetData();
  graphDataStore.resetQuery();

  filesListStore.resetFile();
  btnDisabledStore.disableTrue();

  router.push("/list");
};
</script>

<template>
  <div>
    <Head :headImage="headImage" />

    <main>
      <section>
        <div class="inner">
          <AddQuery />
          <FilesListTable />
          <AddFlile />

          <section class="btn-area">
            <ButtonBase
              cls="blue"
              v-on:clickEvent="onGraphView"
              :isDisabled="btnDisabledStore.disabled"
              >実行する</ButtonBase
            >
            <p>もしくは</p>
            <ButtonBase
              cls="blue-l"
              v-on:clickEvent="onGotoList"
              :isDisabled="false"
              >以前の画面を復元する</ButtonBase
            >
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
main {
  padding-block: 40px;
}

.inner {
  width: 560px;
  max-width: 100%;
  margin-inline: auto;
  padding-inline: 40px;
}
.btn-area {
  margin-block: 42px 40px;
}
.btn-area p {
  text-align: center;
  margin-block: 16px;
}
</style>
