<template>
  <div class="flex">
    <!-- Left -->
    <div class="w-1/4 h-screen relative">
      <div class="sticky top-0 bg-gray-400 w-full p-1">
        <input
          class="w-full"
          type="text"
          placeholder="Search"
          v-model="searchInput"
          @input="setLastInputTime"
        />
      </div>

      <div v-if="!noResults">
        <div class="overflow-y-scroll max-h-90vh">
          <div v-for="result in results" :key="result.id" class="flex">{{result.s}} - {{result.d}}</div>
        </div>
        <button v-if="canPaginate" @click="increasePagination">See More</button>
      </div>
      <div v-else>
        <p>No results</p>
      </div>
    </div>

    <!-- Right -->
    <div class="w-3/4 min-h-screen max-h-screen bg-gray-700 text-white border-r border-black">
      <div>RIGHT SIDE</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";

@Component
export default class Search extends Vue {
  private readyToSearch: boolean = false;
  private lastInputTime: number = Date.now();
  private lastSearchTime: any = Date.now();
  private noResults: boolean = false;

  private pagination: number = 1;

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
