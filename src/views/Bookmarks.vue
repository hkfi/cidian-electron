<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen flex flex-col bg-gray-600 border-r border-black">
      <div class="bg-gray-600 w-full p-1 flex flex-inline">
        <div class="relative inline-block dropdown">
          <div
            class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-3 mr-1 border rounded focus:outline-none"
          >
            <font-awesome-icon icon="angle-double-down"></font-awesome-icon>
          </div>
          <div
            class="hidden absolute w-32 min-w-full dropdown-content bg-gray-700 rounded border text-white"
          >
            <div @click="setList(null)" class="cursor-pointer p-1 hover:bg-gray-800">Bookmarks</div>
            <div
              v-for="list in lists"
              :key="list.name"
              class="cursor-pointer p-1 hover:bg-gray-800"
              @click="setList(list.name)"
            >{{list.name}}</div>
          </div>
        </div>
        <input
          class="w-full placeholder-gray-600"
          type="text"
          placeholder="Search"
          v-model="searchInput"
        />
      </div>

      <div class="flex-grow overflow-y-scroll">
        <SearchResultCard
          v-for="dictionaryItem in dictionaryItemsToShow"
          :key="dictionaryItem.id"
          :dictionaryItem="dictionaryItem"
          @selected="setCurrentBookmarkedDictionaryItem"
        />
      </div>
      <!-- <button v-if="canPaginate" @click="increasePagination">See More</button> -->
    </div>

    <!-- Right -->
    <div
      class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black overflow-y-auto"
    >
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
import { IDictionaryItem, IList } from "../types";
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

  private listName: null | string = null;

  private setList(listName: null | string) {
    this.listName = listName;
  }

  get searchInput(): string {
    return this.$store.state.bookmarks.bookmarksSearchInput;
  }

  set searchInput(input: string) {
    this.$store.commit("bookmarks/setBookmarksSearchInput", input);
  }

  get lists() {
    return this.$store.state.bookmarks.lists;
  }

  get currentList(): IList {
    return this.$store.state.bookmarks.lists.find(
      (list: any) => list.name === this.listName
    );
  }

  get dictionaryItemsToShow() {
    if (this.listName) {
      return this.filteredBookmarkedDictionaryItems.filter((item: any) => {
        return this.currentList.list.includes(item.id);
      });
    }
    return this.filteredBookmarkedDictionaryItems;
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
      this.$store.commit(
        "bookmarks/removeAllDictionaryItemIdFromLists",
        this.currentBookmarkedDictionaryItem.id
      );
    }
  }
}
</script>
