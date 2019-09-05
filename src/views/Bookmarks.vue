<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen flex flex-col bg-gray-600 border-r border-black">
      <div class="bg-gray-600 w-full p-1">
        <input class="w-full" type="text" placeholder="Search" v-model="searchInput" />
      </div>

      <div class="flex-grow overflow-y-scroll">
        <SearchResultCard
          v-for="dictionaryItem in filteredBookmarkedDictionaryItems"
          :key="dictionaryItem.id"
          :dictionaryItem="dictionaryItem"
          @selected="setCurrentBookmarkedDictionaryItem"
        />
      </div>
      <!-- <button v-if="canPaginate" @click="increasePagination">See More</button> -->
    </div>

    <!-- Right -->
    <div class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black">
      <DictionaryItemDisplay
        v-if="currentBookmarkedDictionaryItem"
        :dictionaryItem="currentBookmarkedDictionaryItem"
        @bookmark-item="bookmarkItem"
        @unbookmark-item="unbookmarkItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "../types";
import SearchResultCard from "@/components/SearchResultCard.vue";
import DictionaryItemDisplay from "@/components/DictionaryItemDisplay.vue";
import Store from "electron-store";

@Component({
  components: {
    SearchResultCard,
    DictionaryItemDisplay
  }
})
export default class Bookmarks extends Vue {
  @Inject() store!: Store<number[]>;

  get searchInput(): string {
    return this.$store.state.bookmarks.bookmarksSearchInput;
  }

  set searchInput(input: string) {
    this.$store.commit("bookmarks/setBookmarksSearchInput", input);
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.currentBookmarkedDictionaryItem.id
    );
  }

  get filteredBookmarkedDictionaryItems() {
    return this.$store.getters["bookmarks/filteredBookmarkedDictionaryItems"];
  }

  get currentBookmarkedDictionaryItem() {
    return this.$store.state.bookmarks.currentBookmarkedDictionaryItem;
  }

  private setCurrentBookmarkedDictionaryItem(dictionaryItem: IDictionaryItem) {
    this.$store.commit(
      "bookmarks/setCurrentBookmarkedDictionaryItem",
      dictionaryItem
    );
  }

  private bookmarkItem() {
    if (!this.bookmarked) {
      const updatedBookmarks = [
        ...this.$store.state.bookmarks.bookmarks,
        this.currentBookmarkedDictionaryItem.id
      ];
      this.$store.commit("bookmarks/setBookmarks", updatedBookmarks);
      this.store.set("bookmarks", updatedBookmarks);
      this.$store.commit(
        "bookmarks/appendBookmarkedDictionaryItem",
        this.currentBookmarkedDictionaryItem
      );
    }
  }

  private unbookmarkItem() {
    if (this.bookmarked) {
      const filteredBookmarks = this.$store.state.bookmarks.bookmarks.filter(
        (id: number) => {
          return id !== this.currentBookmarkedDictionaryItem.id;
        }
      );
      this.$store.commit("bookmarks/setBookmarks", filteredBookmarks);
      this.store.set("bookmarks", filteredBookmarks);
      this.$store.commit(
        "bookmarks/removeBookmarkedDictionaryItem",
        this.currentBookmarkedDictionaryItem.id
      );
    }
  }
}
</script>
