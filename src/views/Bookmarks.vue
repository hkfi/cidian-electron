<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/4 h-screen relative">
      <div class="sticky top-0 bg-gray-400 w-full p-1">
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
    <div class="w-3/4 min-h-screen max-h-screen bg-gray-700 text-white border-r border-black">
      hello
      <div v-if="currentBookmarkedDictionaryItem" class="p-2">
        <div class="block">
          <div class="flex">
            <div class="w-1/2">
              <span class="block text-6xl">{{currentBookmarkedDictionaryItem.s}}</span>
              <span class="block text-4xl">{{currentBookmarkedDictionaryItem.pd}}</span>
            </div>
            <div class="w-1/2">
              <div>Menu Goes here</div>
              <!-- <button v-if="!bookmarked" @click="bookmarkItem">Bookmark</button>
              <button v-else @click="unbookmarkItem">Remove Bookmark</button>-->
            </div>
          </div>
        </div>
        <div class="block text-2xl">
          Definitions:
          <ul>
            <li v-for="def in currentBookmarkedDictionaryItem.d" :key="def">- {{def}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IDictionaryItem } from "../types";
import SearchResultCard from "@/components/SearchResultCard.vue";

@Component({
  components: {
    SearchResultCard
  }
})
export default class Bookmarks extends Vue {
  private searchInput: string = "";
  private mounted() {
    console.log(this.bookmarkedDictionaryItems);
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
}
</script>
