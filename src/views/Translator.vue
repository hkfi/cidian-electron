<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen relative">
      <div class="p-2 block">
        <textarea
          type="text"
          rows="5"
          placeholder="Study from Chinese text by pasting them here"
          v-model="translatorInput"
          class="w-full"
        />
      </div>
      <div class="block">
        <button class="mr-0" @click="translate">Translate</button>
      </div>
      <div class="block">
        <span
          v-for="(result, i) in translatorResults"
          :key="i"
          @click="setCurrentTranslatorDictionaryItem(result)"
        >
          <template v-if="result.s">{{result.s}}</template>
          <template v-else>{{result}}</template>
        </span>
      </div>
    </div>
    <!-- Right -->
    <div class="w-2/3 min-h-screen max-h-screen bg-gray-700 text-white border-r border-black">
      <div v-if="currentTranslatorDictionaryItem" class="p-2">
        <div class="block">
          <div class="flex">
            <div class="w-1/2">
              <span class="block text-6xl">{{currentTranslatorDictionaryItem.s}}</span>
              <span class="block text-4xl">{{currentTranslatorDictionaryItem.pd}}</span>
            </div>
            <div class="w-1/2">
              <div>Menu Goes here</div>
              <button v-if="!bookmarked" @click="bookmarkItem">Bookmark</button>
              <button v-else @click="unbookmarkItem">Remove Bookmark</button>
            </div>
          </div>
        </div>
        <div class="block text-2xl">
          Definitions:
          <ul>
            <li v-for="def in currentTranslatorDictionaryItem.d" :key="def">- {{def}}</li>
          </ul>
        </div>
      </div>right
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "../types";
import CONSTANTS from "@/constants";
import Store from "electron-store";

@Component
export default class Translator extends Vue {
  @Inject() store!: Store<number[]>;

  // private translationResultArray:  = [];

  get translatorResults(): (IDictionaryItem | string)[] {
    return this.$store.state.translatorResults;
  }

  get translatorInput(): string {
    return this.$store.state.translatorInput;
  }

  set translatorInput(input: string) {
    this.$store.commit("setTranslatorInput", input);
  }

  get currentTranslatorDictionaryItem() {
    return this.$store.state.currentTranslatorDictionaryItem;
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.includes(
      this.currentTranslatorDictionaryItem.id
    );
  }

  private bookmarkItem() {
    if (!this.bookmarked) {
      const updatedBookmarks = [
        ...this.$store.state.bookmarks,
        this.currentTranslatorDictionaryItem.id
      ];
      this.$store.commit("setBookmarks", updatedBookmarks);
      this.store.set("bookmarks", updatedBookmarks);
    }
  }

  private unbookmarkItem() {
    const filteredBookmarks = this.$store.state.bookmarks.filter(
      (id: number) => {
        return id !== this.currentTranslatorDictionaryItem.id;
      }
    );
    this.$store.commit("setBookmarks", filteredBookmarks);
    this.store.set("bookmarks", filteredBookmarks);
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
    this.$store.commit("setTranslatorResults", dicItemArray);
    // this.translationResultArray = dicItemArray;
    let endTime = Date.now();
    console.log(endTime - startTime);
  }

  private setCurrentTranslatorDictionaryItem(item: IDictionaryItem | string) {
    console.log("typeof", typeof item);
    if (typeof item === "object") {
      this.$store.commit("setCurrentTranslatorDictionaryItem", item);
    }
  }
}
</script>
