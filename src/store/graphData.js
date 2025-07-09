import { defineStore } from "pinia";

export const useGraphDataStore = defineStore({
  id: "graphData",
  state: () => ({
    datas: {},
    queryText: "",
    queryArray: [],
  }),
  actions: {
    setData(query, setData) {
      this.datas[query] = setData;
    },
    resetData() {
      this.datas = {};
    },
    setQuery(text) {
      this.queryText = text;
    },
    resetQuery() {
      this.queryText = "";
      this.queryArray = [];
    },
    setQueryArray() {
      const query = this.queryText;
      const splitQuery = query.split(/\n/);

      const trimQuery = splitQuery.map((text) => text.trim());

      this.queryArray = trimQuery.filter((query) => query !== "");
    },
    isQueryText() {
      const text = this.queryText;
      let isBoolean = true;
      if (!text || text === "") {
        isBoolean = false;
      }
      return isBoolean;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
