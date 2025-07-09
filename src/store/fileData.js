import { defineStore } from "pinia";

export const useFilesListStore = defineStore({
  id: "filesList",
  state: () => ({
    list: new Map(),
    nameList: [],
  }),
  actions: {
    async addFile(files) {
      for await (const file of files) {
        const fileReader = new FileReader();

        const id = file.name.replace(".csv", "");
        let fileText = "";

        fileReader.readAsText(file);
        fileReader.onload = (event) => {
          fileText = event.target.result;
          const nameText = file.name.substring(0, 6);

          this.list.set(id, {
            name: file.name,
            nameText,
            file,
            fileText,
          });
        };
      }
    },
    isFileName(list = this.list) {
      let isBoolean = false;

      if (list.size !== 0) isBoolean = true;

      return isBoolean;
    },
    delete(key) {
      this.list.delete(key);
    },
    addFileName(name) {
      if (!this.nameList[name]) this.nameList.push(name);
    },
    resetFile() {
      this.list = new Map();
      this.nameList = [];
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
