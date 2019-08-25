<template>
  <div
    class="h-24 bg-gray-200 border-b border-gray overflow-hidden cursor-pointer hover:bg-gray-300"
    @click="setCurrentDictionaryItem"
  >
    <span class="block text-xl">{{dictionaryItem.s}}</span>
    <span class="block text-base">{{dictionaryItem.pd}}</span>
    <span class="block text-sm">
      <span v-for="def in dictionaryItem.d" :key="def">{{`${def} - `}}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";

@Component
export default class SearchResultCard extends Vue {
  @Prop() readonly dictionaryItem: IDictionaryItem | undefined;

  private setCurrentDictionaryItem() {
    this.$store.commit("setCurrentDictionaryItem", this.dictionaryItem);
  }
}
</script>
