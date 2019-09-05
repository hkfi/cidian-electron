<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen relative bg-gray-600 border-r border-black">
      <div class="p-2 block">
        <textarea
          type="text"
          rows="5"
          placeholder="Paste Chinese text here"
          v-model="translatorInput"
          class="w-full bg-gray-600 focus:bg-gray-700 text-white p-1 resize-none border rounded focus:outline-none"
        />
      </div>
      <div class="block pl-2">
        <button
          class="bg-transparent hover:bg-gray-500 text-white font-semibold hover:text-white py-1 px-4 border rounded hover:border-transparent focus:outline-none"
          @click="translate"
        >Translate</button>
      </div>
      <div class="block pl-2">
        <span
          v-for="(result, i) in translatorResults"
          :key="i"
          class="text-white text-xl"
          :class="{'hover:bg-gray-900 cursor-pointer': result.s, 'bg-gray-900': result === currentTranslatorDictionaryItem}"
          @click="setCurrentTranslatorDictionaryItem(result)"
        >
          <template v-if="result.s">{{result.s}}</template>
          <template v-else>{{result}}</template>
        </span>
      </div>
    </div>
    <!-- Right -->
    <div class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black">
      <DictionaryItemDisplay
        v-if="currentTranslatorDictionaryItem"
        :dictionaryItem="currentTranslatorDictionaryItem"
        @bookmark-item="bookmarkItem"
        @unbookmark-item="unbookmarkItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "../types";
import CONSTANTS from "@/constants";
import DictionaryItemDisplay from "@/components/DictionaryItemDisplay.vue";
import Store from "electron-store";

@Component({
  components: {
    DictionaryItemDisplay
  }
})
export default class Translator extends Vue {
  @Inject() store!: Store<number[]>;

  get translatorResults(): (IDictionaryItem | string)[] {
    return this.$store.state.translator.translatorResults;
  }

  get translatorInput(): string {
    return this.$store.state.translator.translatorInput;
  }

  set translatorInput(input: string) {
    this.$store.commit("translator/setTranslatorInput", input);
  }

  get currentTranslatorDictionaryItem() {
    return this.$store.state.translator.currentTranslatorDictionaryItem;
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.currentTranslatorDictionaryItem.id
    );
  }

  private bookmarkItem() {
    if (!this.bookmarked) {
      const updatedBookmarks = [
        ...this.$store.state.bookmarks.bookmarks,
        this.currentTranslatorDictionaryItem.id
      ];
      this.$store.commit("bookmarks/setBookmarks", updatedBookmarks);
      this.store.set("bookmarks", updatedBookmarks);
      this.$store.commit(
        "bookmarks/appendBookmarkedDictionaryItem",
        this.currentTranslatorDictionaryItem
      );
    }
  }

  private unbookmarkItem() {
    if (this.bookmarked) {
      const filteredBookmarks = this.$store.state.bookmarks.bookmarks.filter(
        (id: number) => {
          return id !== this.currentTranslatorDictionaryItem.id;
        }
      );
      this.$store.commit("bookmarks/setBookmarks", filteredBookmarks);
      this.store.set("bookmarks", filteredBookmarks);
      this.$store.commit(
        "bookmarks/removeBookmarkedDictionaryItem",
        this.currentTranslatorDictionaryItem.id
      );
    }
  }

  private translate() {
    let startTime = Date.now();
    const textArray: string[] = this.translatorInput.split("");
    // Regex checks for Chinese words that begin with any of the characters in the text
    const textRegex: RegExp = new RegExp(`^(${textArray.join("|")})`);

    let relStart = Date.now();
    // Get the relevant dictionary items so the find method won't have to look through the whole dictionary later
    // Also to provide other relevant words when clicking on each character
    const relevantDictionaryItems: IDictionaryItem[] = this.$store.state.dictionary.filter(
      (item: IDictionaryItem) => {
        return item.s.match(textRegex) || item.t.match(textRegex);
      }
    );
    let relEnd = Date.now();
    console.log("relTime", relEnd - relStart);

    console.log("rel", relevantDictionaryItems);

    const dicItemArray: (IDictionaryItem | string)[] = [];

    // For loop over each character in the input text
    // Will increment by the length of the longest substring of characters found in dictionary at the end of each loop
    // If the character is not found in the dictionary, it will be added to the array as a string and increment by 1
    for (let i: number = 0; i < this.translatorInput.length; ) {
      const textRemaining = this.translatorInput.slice(i);
      let textToCheck: string = "";
      let lengthRemaining = textRemaining.length;

      // Using 4 as the max substring text to search the dictionary for
      // Larger numbers can also be used but will dramatically increase the runtime of the function
      // Longest word length in the dictionary is 19 but only one item matches that
      // 4 is succifient for the vast majority of words, proverbs, idioms
      // With 4 however, may miss out on names of people or places, especially of foreign origin
      if (textRemaining.length > CONSTANTS.TRANSLATION_MAX_SUBSTRING) {
        lengthRemaining = CONSTANTS.TRANSLATION_MAX_SUBSTRING;
      }

      for (let endI: number = lengthRemaining; endI > 0; endI--) {
        textToCheck = this.translatorInput.substr(i, endI);

        const dictionaryItem = relevantDictionaryItems.find(
          item => item.s === textToCheck || item.t === textToCheck
        );
        if (dictionaryItem) {
          dicItemArray.push(dictionaryItem);
          endI = 0;
        } else if (endI === 1) {
          dicItemArray.push(textToCheck);
        }
      }
      i += textToCheck.length;
    }

    console.log("dicItemArray", dicItemArray);
    this.$store.commit("translator/setTranslatorResults", dicItemArray);
    let endTime = Date.now();
    console.log(endTime - startTime);
  }

  private setCurrentTranslatorDictionaryItem(item: IDictionaryItem | string) {
    console.log("typeof", typeof item);
    if (typeof item === "object") {
      this.$store.commit("translator/setCurrentTranslatorDictionaryItem", item);
    }
  }
}
</script>
