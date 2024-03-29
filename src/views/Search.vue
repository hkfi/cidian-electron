<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/3 h-screen flex flex-col bg-gray-600 border-r border-black">
      <div class="bg-gray-600 w-full p-1">
        <input
          class="w-full placeholder-gray-600"
          type="text"
          placeholder="Search"
          v-model="searchInput"
          @input="setLastInputTime"
        />
      </div>

      <div class="flex-grow overflow-y-scroll">
        <SearchResultCard
          v-for="result in results"
          :key="result.id"
          :dictionaryItem="result"
          @selected="setCurrentDictionaryItem"
        />
        <button v-if="canPaginate" @click="increasePagination">See More</button>
      </div>
      <div v-if="noResults">
        <p>No results</p>
      </div>
    </div>

    <!-- Right -->
    <div
      class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black overflow-y-auto"
    >
      <DictionaryItemDisplay v-if="currentDictionaryItem" :dictionaryItem="currentDictionaryItem" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";
import SearchResultCard from "@/components/SearchResultCard.vue";
import DictionaryItemDisplay from "@/components/DictionaryItemDisplay.vue";
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

  private setCurrentDictionaryItem(dictionaryItem: IDictionaryItem) {
    this.$store.commit("setCurrentDictionaryItem", dictionaryItem);
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
      let tempResult = this.$store.state.dictionary.filter(
        (dicItem: IDictionaryItem) => {
          return this.searchCondition(dicItem);
        }
      );
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

  // Return dictionary items where any of the following is fulfilled
  // 1. simplified string includes input
  // 2. traditional string includes input
  // 3. pinyin numeric string includes input
  // 4. pinyin diacritic string includes input
  // 5. pinyin without markings string includes input
  // 6. any of the definitions string includes input
  private searchCondition(dicItem: IDictionaryItem) {
    // Need to create temp because d (definitions) property is an array of strings
    const temp = dicItem.d.filter((word: string) => {
      return word.toLowerCase().includes(this.searchInput.toLowerCase());
    });
    const marklessPinyin = dicItem.pn.toLowerCase().replace(/[0-9]/g, "");
    const trueCondition =
      temp.length > 0 ||
      dicItem.s.includes(this.searchInput) ||
      dicItem.t.includes(this.searchInput) ||
      dicItem.pn.includes(this.searchInput) ||
      dicItem.pd.includes(this.searchInput) ||
      marklessPinyin.includes(this.searchInput.toLowerCase());
    return trueCondition;
  }
}
</script>
