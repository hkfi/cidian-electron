<template>
  <div
    class="h-24 bg-gray-700 text-white pl-1 border-b border-gray overflow-hidden cursor-pointer hover:bg-gray-600"
    @click="selected"
  >
    <span class="block text-xl">{{dictionaryItem.s}}</span>
    <span class="block text-base">{{dictionaryItem.pd}}</span>
    <span class="block text-sm">
      <span v-for="def in dictionaryItem.d" :key="def">{{`${def} - `}}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";

@Component
export default class SearchResultCard extends Vue {
  @Prop() readonly dictionaryItem: IDictionaryItem | undefined;

  @Emit()
  private selected() {
    return this.dictionaryItem;
  }
}
</script>
