<template>
  <div class="flex flex-col h-full">
    <div class="block h-16 p-2 flex-none flex">
      <div class="flex-none w-10 text-xl cursor-pointer" @click="stopFlashcardMode">Exit</div>
      <div class="flex-grow text-center text-2xl">{{list.name}}</div>
      <div class="flex-none w-10 text-xl">{{`${currentCardNumber}/${listLength}`}}</div>
    </div>
    <div class="block flex h-full">
      <div class="flex-none w-16">
        <button
          class="text-blue-500 h-full w-full hover:bg-gray-700"
          v-if="prevCardExists"
          @click="prevCard"
        >
          <font-awesome-icon icon="chevron-left"></font-awesome-icon>
        </button>
      </div>
      <div class="flex-1" @click="flipped = !flipped">
        <div class="text-center text-4xl">
          <div v-if="!flipped">
            <div class="block">{{dictionaryItemList[currentIndex].s}}</div>
            <div class="block">{{dictionaryItemList[currentIndex].t}}</div>
          </div>
          <div v-else>
            <div class="block">{{dictionaryItemList[currentIndex].pd}}</div>
            <div class="block">
              <span class="text-2xl">Definitions:</span>
              <ul class="text-xl flex flex-wrap">
                <li
                  v-for="def in dictionaryItemList[currentIndex].d"
                  :key="def"
                  class="whitespace-normal"
                >- {{def}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-none w-16">
        <button
          class="text-blue-500 h-full w-full hover:bg-gray-700"
          v-if="nextCardExists"
          @click="nextCard"
        >
          <font-awesome-icon icon="chevron-right"></font-awesome-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { IDictionaryItem, IList } from "../types";

@Component
export default class FlashcardMode extends Vue {
  @Prop() list!: IList;
  private currentIndex: number = 0;
  private flipped: boolean = false;

  @Watch("currentIndex")
  private onCurrentIndexChange() {
    this.flipped = false;
  }

  get dictionaryItemList(): IDictionaryItem[] {
    return this.$store.state.bookmarks.bookmarkedDictionaryItems.filter(
      (item: IDictionaryItem) => {
        return this.list.list.includes(item.id);
      }
    );
  }

  get currentCardNumber(): number {
    return this.currentIndex + 1;
  }

  get listLength(): number {
    return this.list.list.length;
  }

  get nextCardExists(): boolean {
    return this.currentIndex < this.listLength - 1;
  }

  get prevCardExists(): boolean {
    return this.currentIndex === 0 ? false : true;
  }

  private nextCard() {
    this.currentIndex += 1;
  }

  private prevCard() {
    this.currentIndex -= 1;
  }

  @Emit()
  private stopFlashcardMode() {}
}
</script>
