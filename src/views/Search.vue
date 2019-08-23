<template>
  <div class="about">
    <h1>This is the search page</h1>
    <input type="text" placeholder="Search" v-model="searchInput" @input="setLastInputTime" />
    <div v-if="!noResults">
      <li>
        <ol v-for="result in results" :key="result.id">{{result.s}} - {{result.d}}</ol>
      </li>
      <button v-if="canPaginate" @click="increasePagination">See More</button>
    </div>
    <p v-else>No results</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

interface IDictionaryItem {
  id: number; // id
  s: string; // simplified
  t: string; // traditional
  pn: string; // pinyin numeric
  pd: string; // pinyin diacritic
  d: string[]; // definition(s)
}

@Component
export default class Search extends Vue {
  private readyToSearch: boolean = false;
  private lastInputTime: number = Date.now();

  private lastSearchTime: any = Date.now();
  private searchInput: string = "";
  private noResults: boolean = false;

  private pagination: number = 1;

  get searchLength() {
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
  onResultsChanged() {
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
      this.$store.commit("setSearchResults", tempResult);
    }
  }

  private setLastInputTime() {
    // this.readyToSearch = false;
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
