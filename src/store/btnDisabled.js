import { defineStore } from "pinia";

export const useBtnDisabledStore = defineStore({
  id: "disabled",
  state: () => ({
    disabled: true,
  }),
  actions: {
    isDisabledChack(isFileName, isQueryText) {
      this.disabled = false;
      console.log(isFileName, isQueryText);

      if (!isFileName || !isQueryText) {
        this.disabled = true;
      }
    },
    disableTrue() {
      this.disabled = true;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
