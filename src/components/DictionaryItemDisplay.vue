<template>
  <div class="p-2">
    <div class="block">
      <div class="flex">
        <div class="w-1/2">
          <span class="block text-6xl">{{dictionaryItem.s}}</span>
          <span class="block text-4xl">{{dictionaryItem.pd}}</span>
        </div>
        <div class="w-1/2">
          <button v-if="!bookmarked" @click="bookmarkItem">Bookmark</button>
          <button v-else @click="unbookmarkItem">Remove Bookmark</button>
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
