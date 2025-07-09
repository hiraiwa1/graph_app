import { defineStore } from "pinia";

export const useJsonDataStore = defineStore({
  id: "jsonStore",
  state: () => ({
    data: {},
  }),
  actions: {
    async initializa() {
      const origin = location.href;
      const jsonPath = origin + "/data/graphData.json";

      const fetchData = await fetch(jsonPath).then((res) => res.json());

      this.data = fetchData;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
