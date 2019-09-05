<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen flex flex-col bg-gray-600 border-r border-black">
      <div class="bg-gray-600 w-full p-1">
        <input
          class="w-full"
          type="text"
          placeholder="Search"
          v-model="searchInput"
          @input="setLastInputTime"
        />
      </div>

      <div v-if="!noResults" class="flex-grow overflow-y-scroll">
        <SearchResultCard
          v-for="result in results"
          :key="result.id"
          :dictionaryItem="result"
          @selected="setCurrentDictionaryItem"
        />
        <button v-if="canPaginate" @click="increasePagination">See More</button>
      </div>
      <div v-else>
        <p>No results</p>
      </div>
    </div>

    <!-- Right -->
    <div class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black">
      <DictionaryItemDisplay
        v-if="currentDictionaryItem"
        :dictionaryItem="currentDictionaryItem"
        @bookmark-item="bookmarkItem"
        @unbookmark-item="unbookmarkItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";
import SearchResultCard from "@/components/SearchResultCard.vue";
import DictionaryItemDisplay from "@/components/DictionaryItemDisplay.vue";
import { remote } from "electron";
import Store from "electron-store";

@Component({
  components: {
    SearchResultCard,
    DictionaryItemDisplay
  }
})
export default class Search extends Vue {
  @Inject() store!: Store<number[]>;

  private readyToSearch: boolean = false;
  private lastInputTime: number = Date.now();
  private lastSearchTime: any = Date.now();
  private noResults: boolean = false;

  private pagination: number = 1;

  private bookmarkItem() {
    if (!this.bookmarked) {
      const updatedBookmarks = [
        ...this.$store.state.bookmarks.bookmarks,
        this.currentDictionaryItem.id
      ];
      this.$store.commit("bookmarks/setBookmarks", updatedBookmarks);
      this.store.set("bookmarks", updatedBookmarks);
      this.$store.commit(
        "bookmarks/appendBookmarkedDictionaryItem",
        this.currentDictionaryItem
      );
    }
  }

  private unbookmarkItem() {
    if (this.bookmarked) {
      console.log(this.$store.state.bookmarks.bookmarks.length);
      const filteredBookmarks = this.$store.state.bookmarks.bookmarks.filter(
        (id: number) => {
          return id !== this.currentDictionaryItem.id;
        }
      );
      console.log("filteredbookmarks", filteredBookmarks);
      this.$store.commit("bookmarks/setBookmarks", filteredBookmarks);
      this.store.set("bookmarks", filteredBookmarks);
      this.$store.commit(
        "bookmarks/removeBookmarkedDictionaryItem",
        this.currentDictionaryItem.id
      );
    }
  }

  private setCurrentDictionaryItem(dictionaryItem: IDictionaryItem) {
    this.$store.commit("setCurrentDictionaryItem", dictionaryItem);
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.currentDictionaryItem.id
    );
  }

  get searchInput(): string {
    return this.$store.state.searchInput;
  }

  set searchInput(input: string) {
    this.$store.commit("setSearchInput", input);
  }

  get searchLength(): number {
    return this.searchInput.length;
  }

  get searchResults(): IDictionaryItem[] {
    return this.$store.state.searchResults;
  }

  get results(): IDictionaryItem[] {
    return this.searchResults.slice(0, this.pagination * 50);
  }

  get canPaginate(): boolean {
    return this.results.length !== this.$store.state.searchResults.length;
  }

  get currentDictionaryItem(): IDictionaryItem {
    return this.$store.state.currentDictionaryItem;
  }

  @Watch("searchResults")
  private onResultsChanged() {
    this.pagination = 1;
  }

  private increasePagination() {
    if (this.canPaginate) {
      this.pagination += 1;
    }
  }

  private searchWithInput() {
    if (this.searchInput.length > 0) {
      let tempResult = this.$store.state.dictionary.filter((word: any) => {
        return this.arrayIncludesWord(word.d);
      });
      this.noResults = tempResult.length === 0 ? true : false;
      this.$store.commit("setSearchResults", tempResult.slice(0, 1000));
    }
  }

  private setLastInputTime() {
    this.lastInputTime = Date.now() + 500;
    setTimeout(() => {
      if (Date.now() >= this.lastInputTime) {
        this.searchWithInput();
      }
    }, 500);
  }

  private arrayIncludesWord(array: any) {
    let temp = array.filter((word: string) => {
      return word.includes(this.searchInput);
    });
    return temp.length > 0 ? true : false;
  }
}
</script>
