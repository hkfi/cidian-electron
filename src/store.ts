import Vue from "vue";
import Vuex from "vuex";
const data = require("@/assets/cc-cedict.json");
import ElectronStore from "electron-store";
const electronStore = new ElectronStore();

import { IDictionaryItem } from "@/types";
import { sortSearchResults } from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    bookmarks: [] as number[],
    dictionary: [] as IDictionaryItem[],
    bookmarkedDictionaryItems: [] as IDictionaryItem[],
    searchResults: [] as IDictionaryItem[],
    searchInput: "",
    translatorInput: "",
    translatorDictionaryItems: [] as IDictionaryItem[],
    translatorResults: [] as (IDictionaryItem | string)[],
    currentDictionaryItem: null as IDictionaryItem | null,
    currentBookmarkedDictionaryItem: null as IDictionaryItem | null,
    currentTranslatorDictionaryItem: null as IDictionaryItem | null
  },
  mutations: {
    // Setting initial state
    // Runs once at the start of the application when App.vue is created
    init: state => {
      // Set cc-cedict.json dictionary to dictionary in vuex
      state.dictionary = data;
      // Set bookmarks
      const bookmarks: any = electronStore.get("bookmarks");
      if (bookmarks) {
        state.bookmarks = bookmarks;
      } else {
        electronStore.set("bookmarks", []);
      }
      // Set bookmarked dictionary items
      state.bookmarkedDictionaryItems = state.dictionary.filter(
        (dictionaryItem: IDictionaryItem) => {
          return state.bookmarks.includes(dictionaryItem.id);
        }
      );
    },
    // Adding and removing dictionary items via mutations rather than getters for performance reasons
    // Having to compute bookmarked dictionary items by filtering through the whole dictionary using a getter takes too long
    appendBookmarkedDictionaryItem: (state, dictionaryItem) => {
      state.bookmarkedDictionaryItems.push(dictionaryItem);
    },
    removeBookmarkedDictionaryItem: (state, id) => {
      state.bookmarkedDictionaryItems = state.bookmarkedDictionaryItems.filter(
        item => item.id !== id
      );
    },
    setBookmarks: (state, payload) => {
      state.bookmarks = payload;
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
    setCurrentBookmarkedDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentBookmarkedDictionaryItem = payload;
    },
    setCurrentTranslatorDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentTranslatorDictionaryItem = payload;
    },
    setLoading: (state, payload: boolean) => {
      state.loading = payload;
    }
  },
  actions: {}
});
