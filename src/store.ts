import Vue from "vue";
import Vuex from "vuex";
const data = require("@/assets/cc-cedict.json");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    dictionary: [],
    searchResults: []
  },
  mutations: {
    // Set cc-cedict.json dictionary to dictionary in vuex
    // Runs once at the start of the application when App.vue is created
    setDictionary: state => {
      state.dictionary = data;
    },
    setSearchResults: (state, payload) => {
      state.searchResults = payload;
    },
    setLoading: (state, payload: boolean) => {
      state.loading = payload;
    }
  },
  actions: {}
});
