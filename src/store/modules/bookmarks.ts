import { Module } from "vuex";
import { IDictionaryItem, IBookmarksModuleState } from "../../types";
import ElectronStore from "electron-store";
const electronStore = new ElectronStore();

export const bookmarks: Module<IBookmarksModuleState, any> = {
  namespaced: true,
  state: {
    bookmarksSearchInput: "",
    bookmarks: [],
    lists: [],
    bookmarkedDictionaryItems: [],
    currentBookmarkedDictionaryItem: null
  },
  mutations: {
    initBookmarks: state => {
      const bookmarks: any = electronStore.get("bookmarks");
      console.log("init bookmarks", bookmarks);
      if (bookmarks) {
        state.bookmarks = bookmarks;
      } else {
        electronStore.set("bookmarks", []);
      }
    },
    initBookmarkedDictionaryItems: (state, payload) => {
      state.bookmarkedDictionaryItems = payload;
    },
    initLists: state => {
      const lists: any = electronStore.get("lists");
      if (lists) {
        state.lists = lists;
      } else {
        electronStore.set("lists", []);
      }
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
    setBookmarksSearchInput: (state, payload) => {
      state.bookmarksSearchInput = payload;
    },
    setCurrentBookmarkedDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentBookmarkedDictionaryItem = payload;
    },
    setLists: (state, payload) => {
      state.lists = payload;
    },
    addDictionaryItemIdToList: (state, { name, id }) => {
      const list = state.lists.find(list => list.name === name);
      if (list) {
        list.list.push(id);
      }
      electronStore.set("lists", state.lists);
    },
    removeDictionaryItemIdFromList: (state, { name, id }) => {
      const list = state.lists.find(list => list.name === name);
      if (list) {
        list.list = list.list.filter(dicId => dicId !== id);
      }
      electronStore.set("lists", state.lists);
    }
  },
  actions: {},
  getters: {
    filteredBookmarkedDictionaryItems: state => {
      if (state.bookmarksSearchInput.length === 0) {
        return state.bookmarkedDictionaryItems;
      }
      const regex = new RegExp(`^(${state.bookmarksSearchInput})`, "i");
      return state.bookmarkedDictionaryItems.filter(item => {
        return item.d.some(d => {
          return d.match(regex);
        });
      });
    }
  }
};
