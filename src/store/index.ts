import Vue from "vue";
import Vuex from "vuex";
const data = require("@/assets/cc-cedict.json");

import { IDictionaryItem } from "@/types";
import { sortSearchResults } from "@/utils";

// Modules
import { bookmarks } from "@/store/modules/bookmarks";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bookmarks
  },
  state: {
    loading: false,
    dictionary: [] as IDictionaryItem[],
    singleCharacterDictionary: [] as IDictionaryItem[],
    searchResults: [] as IDictionaryItem[],
    searchInput: "",
    translatorInput: "",
    translatorDictionaryItems: [] as IDictionaryItem[],
    translatorResults: [] as (IDictionaryItem | string)[],
    currentDictionaryItem: null as IDictionaryItem | null,
    currentTranslatorDictionaryItem: null as IDictionaryItem | null
  },
  mutations: {
    initDictionary: state => {
      state.dictionary = data;
    },
    initSingleCharacterDictionary: state => {
      state.singleCharacterDictionary = state.dictionary.filter(
        (item: IDictionaryItem) => item.s.length === 1
      );
    },
    setSearchResults: (state, payload) => {
      // Sets the search results using the user's search input after sorting
      const sortedResults = sortSearchResults(payload, state.searchInput);
      state.searchResults = sortedResults;
    },
    setTranslatorResults: (state, payload) => {
      state.translatorResults = payload;
    },
    setSearchInput: (state, payload) => {
      state.searchInput = payload;
    },
    setTranslatorInput: (state, payload) => {
      state.translatorInput = payload;
    },
    setCurrentDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentDictionaryItem = payload;
    },
    setCurrentTranslatorDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentTranslatorDictionaryItem = payload;
    },
    setLoading: (state, payload: boolean) => {
      state.loading = payload;
    }
  },
  actions: {
    // Setting initial state
    // Runs once at the start of the application when App.vue is created
    init: ({ state, commit }) => {
      // Set cc-cedict.json dictionary to dictionary in vuex
      commit("initDictionary");
      // Set single character dictionary entries for easy access
      commit("initSingleCharacterDictionary");
      // Set bookmarks
      commit("bookmarks/initBookmarks");
      // Set bookmarked dictionary items
      const bookmarkedDictionaryItems = state.dictionary.filter(
        (item: IDictionaryItem) => state.bookmarks.bookmarks.includes(item.id)
      );
      commit(
        "bookmarks/initBookmarkedDictionaryItems",
        bookmarkedDictionaryItems
      );
    }
  },
  getters: {}
});
