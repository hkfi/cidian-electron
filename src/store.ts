import Vue from "vue";
import Vuex from "vuex";
const data = require("@/assets/cc-cedict.json");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    dictionary: [],
    searchResults: [],
    searchInput: ""
  },
  mutations: {
    // Set cc-cedict.json dictionary to dictionary in vuex
    // Runs once at the start of the application when App.vue is created
    setDictionary: state => {
      state.dictionary = data;
    },
    setSearchResults: (state, payload) => {
      // payload.sort((a: any, b: any) => {
      //   // sort by priority
      //   // 1. exact match after
      //   // 2. exact match after lowercasing the word
      //   // 3.
      //   let priorityA = 0
      //   let priorityB = 0
      //   if (a.d.includes())
      // })

      state.searchResults = payload;
    },
    setSearchInput: (state, payload) => {
      state.searchInput = payload;
    },
    setLoading: (state, payload: boolean) => {
      state.loading = payload;
    }
  },
  actions: {}
});
