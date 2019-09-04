<template>
  <div class="p-2">
    <div class="block">
      <div class="flex">
        <div class="w-1/2">
          <span class="block text-6xl">{{dictionaryItem.s}}</span>
          <span class="block text-4xl">{{dictionaryItem.pd}}</span>
        </div>
        <div class="w-1/2">
          <button
            class="bg-transparent hover:bg-gray-500 text-white font-semibold hover:text-white py-1 px-4 border rounded focus:outline-none"
            v-if="!bookmarked"
            @click="bookmarkItem"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button
            class="bg-transparent hover:bg-gray-500 text-white font-semibold hover:text-white py-1 px-4 border rounded focus:outline-none"
            v-else
            @click="unbookmarkItem"
          >
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="block text-2xl">
      Definitions:
      <ul>
        <li v-for="def in dictionaryItem.d" :key="def">- {{def}}</li>
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

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.includes(this.dictionaryItem.id);
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
