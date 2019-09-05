<template>
  <div class="p-2">
    <div class="block">
      <div class="flex">
        <div class="w-1/2">
          <span class="block text-6xl">{{dictionaryItem.s}}</span>
          <span class="block text-4xl">{{dictionaryItem.pd}}</span>
        </div>
        <div class="w-1/2">
          <div class="block">
            <button
              class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none"
              v-if="!bookmarked"
              @click="bookmarkItem"
            >
              <i class="fas fa-plus"></i>
            </button>
            <button
              class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none"
              v-else
              @click="unbookmarkItem"
            >
              <i class="fas fa-minus"></i>
            </button>
          </div>
          <div class="block">
            <span class="text-2xl">Definitions:</span>
            <ul class="text-xl">
              <li v-for="def in dictionaryItem.d" :key="def">- {{def}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="block text-2xl">
      Characters:
      <ul class="flex flex-row">
        <li v-for="item in relevantDictionaryItems" :key="item.id" class="mr-1">
          <span
            class="border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3 cursor-pointer"
          >{{item.s}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { IDictionaryItem } from "../types";

@Component
export default class DictionaryItemDisplay extends Vue {
  @Prop() dictionaryItem!: IDictionaryItem;

  private setRelevantCharacter() {
    console.log("clicked");
  }

  get definitionAsArray(): string[] {
    return [...this.dictionaryItem.s];
  }

  get relevantDictionaryItems(): IDictionaryItem[] {
    return this.$store.state.singleCharacterDictionary.filter(
      (item: IDictionaryItem) => {
        return (
          (this.definitionAsArray.includes(item.s) ||
            this.definitionAsArray.includes(item.s)) &&
          item.id !== this.dictionaryItem.id
        );
      }
    );
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.dictionaryItem.id
    );
  }

  @Emit()
  private bookmarkItem() {
    return this.dictionaryItem;
  }

  @Emit()
  private unbookmarkItem() {
    return this.dictionaryItem;
  }
}
</script>
