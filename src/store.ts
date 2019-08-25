import Vue from "vue";
import Vuex from "vuex";
const data = require("@/assets/cc-cedict.json");

import { IDictionaryItem } from "@/types";
import { sortSearchResults } from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    dictionary: [] as IDictionaryItem[],
    searchResults: [] as IDictionaryItem[],
    searchInput: "",
    currentDictionaryItem: null as IDictionaryItem | null
  },
  mutations: {
    // Set cc-cedict.json dictionary to dictionary in vuex
    // Runs once at the start of the application when App.vue is created
    setDictionary: state => {
      state.dictionary = data;
    },
    setSearchResults: (state, payload) => {
      // Sets the search results using the user's search input after sorting
      const sortedResults = sortSearchResults(payload, state.searchInput);
      state.searchResults = sortedResults;
    },
    setSearchInput: (state, payload) => {
      state.searchInput = payload;
    },
    setCurrentDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentDictionaryItem = payload;
    },
    setLoading: (state, payload: boolean) => {
      state.loading = payload;
    }
  },
  actions: {}
});
