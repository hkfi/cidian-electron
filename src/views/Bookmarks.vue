<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen relative bg-gray-600 border-r border-black">
      <div class="sticky top-0 bg-gray-600 w-full p-1">
        <input class="w-full" type="text" placeholder="Search" />
      </div>

      <div>
        <div class="overflow-y-scroll max-h-90vh">
          <SearchResultCard
            v-for="dictionaryItem in bookmarkedDictionaryItems"
            :key="dictionaryItem.id"
            :dictionaryItem="dictionaryItem"
            @selected="setCurrentBookmarkedDictionaryItem"
          />
        </div>
        <!-- <button v-if="canPaginate" @click="increasePagination">See More</button> -->
      </div>
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

  private searchInput: string = "";
  private mounted() {
    console.log(this.bookmarkedDictionaryItems);
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.includes(
      this.currentBookmarkedDictionaryItem.id
    );
  }

  get bookmarkedDictionaryItems() {
    return this.$store.getters.bookmarkedDictionaryItems;
  }

  get currentBookmarkedDictionaryItem() {
    return this.$store.state.currentBookmarkedDictionaryItem;
  }

  private setCurrentBookmarkedDictionaryItem(dictionaryItem: IDictionaryItem) {
    this.$store.commit("setCurrentBookmarkedDictionaryItem", dictionaryItem);
  }

  private bookmarkItem() {
    if (!this.bookmarked) {
      const updatedBookmarks = [
        ...this.$store.state.bookmarks,
        this.currentBookmarkedDictionaryItem.id
      ];
      this.$store.commit("setBookmarks", updatedBookmarks);
      this.store.set("bookmarks", updatedBookmarks);
    }
  }

  private unbookmarkItem() {
    const filteredBookmarks = this.$store.state.bookmarks.filter(
      (id: number) => {
        return id !== this.currentBookmarkedDictionaryItem.id;
      }
    );
    this.$store.commit("setBookmarks", filteredBookmarks);
    this.store.set("bookmarks", filteredBookmarks);
  }
}
</script>
