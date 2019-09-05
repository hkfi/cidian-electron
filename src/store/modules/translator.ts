import { Module } from "vuex";
import { IDictionaryItem, ITranslatorModuleState } from "../../types";

export const translator: Module<ITranslatorModuleState, any> = {
  namespaced: true,
  state: {
    translatorInput: "",
    translatorResults: [],
    translatorDictionaryItems: [],
    currentTranslatorDictionaryItem: null
  },
  mutations: {
    setTranslatorInput: (state, payload) => {
      state.translatorInput = payload;
    },
    setTranslatorResults: (state, payload) => {
      state.translatorResults = payload;
    },
    setCurrentTranslatorDictionaryItem: (state, payload: IDictionaryItem) => {
      state.currentTranslatorDictionaryItem = payload;
    }
  }
};
