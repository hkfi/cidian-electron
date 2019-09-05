<template>
  <div class="flex flex-inline">
    <button
      v-if="!dictionaryItemInList"
      class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none mr-1"
      @click="addToList"
    >
      <i class="fas fa-plus"></i>
    </button>
    <button
      v-else
      class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none mr-1"
      @click="removeFromList"
    >
      <i class="fas fa-minus"></i>
    </button>

    <div>{{list.name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import { IList, IDictionaryItem } from "../types";
import Store from "electron-store";

@Component
export default class DropdownContent extends Vue {
  @Inject() store!: Store<number[]>;
  @Prop() private list!: IList;
  @Prop() private dictionaryItem!: IDictionaryItem;

  get dictionaryItemInList(): boolean {
    return this.list.list.includes(this.dictionaryItem.id) ? true : false;
  }

  get isBookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.dictionaryItem.id
    );
  }

  @Emit()
  private bookmarkItem() {}

  private addToList() {
    if (!this.isBookmarked) {
      this.bookmarkItem();
    }
    this.$store.commit("bookmarks/addDictionaryItemIdToList", {
      name: this.list.name,
      id: this.dictionaryItem.id
    });
  }

  private removeFromList() {
    this.$store.commit("bookmarks/removeDictionaryItemIdFromList", {
      name: this.list.name,
      id: this.dictionaryItem.id
    });
  }
}
</script>

