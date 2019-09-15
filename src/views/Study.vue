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
        />
      </div>

      <div class="flex-grow overflow-y-scroll">
        <div
          class="h-24 bg-gray-700 text-white pl-1 border-b border-gray overflow-hidden cursor-pointer hover:bg-gray-600"
          @click="setList(null)"
        >
          <span class="block text-xl">Bookmarks</span>
          <span class="block text-base">Vocab: {{bookmarks.length}}</span>
        </div>
        <div
          v-for="list in lists"
          :key="list.name"
          class="h-24 bg-gray-700 text-white pl-1 border-b border-gray overflow-hidden cursor-pointer hover:bg-gray-600"
          @click="setList(list.name)"
        >
          <span class="block text-xl">{{list.name}}</span>
          <span class="block text-base">Vocab: {{list.list.length}}</span>
        </div>
      </div>
      <div v-if="lists.length === 0">
        <div>Bookmark words to study!</div>
      </div>
    </div>

    <!-- Right -->
    <div
      class="w-2/3 min-h-screen max-h-screen bg-gray-800 text-white border-r border-black overflow-y-auto"
    >
      <div class="p-2" v-if="!flashcardMode && listToStudy">
        <div class="block">
          <div class="flex">
            <div class="w-1/2" v-if="listToStudy">
              <span class="block text-6xl">{{this.listToStudy.name}}</span>
              <span class="block text-4xl">Vocab: {{this.listToStudy.list.length}}</span>
            </div>
            <div class="w-1/2">
              <div class="block">
                <button
                  @click="startFlashcardMode"
                  class="bg-transparent hover:bg-gray-500 font-semibold py-1 px-4 border rounded focus:outline-none mr-1 text-blue-500"
                >Study</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div > -->
      <FlashcardMode
        v-if="flashcardMode"
        :list="listToStudy"
        @stop-flashcard-mode="stopFlashcardmode"
      />
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IDictionaryItem, IList } from "../types";
import FlashcardMode from "@/components/FlashcardMode.vue";

@Component({
  components: {
    FlashcardMode
  }
})
export default class Study extends Vue {
  private searchInput: string = "";
  private flashcardMode: boolean = false;
  private flashcardIndex: number | null = null;
  private listName: string | null = null;

  @Watch("listToStudy")
  private onListToStudyChange() {
    this.stopFlashcardmode();
  }

  get bookmarks() {
    return this.$store.state.bookmarks.bookmarks;
  }

  get lists() {
    return this.$store.state.bookmarks.lists;
  }

  private setList(listName: string | null) {
    this.listName = listName;
  }

  get listToStudy(): IList {
    if (this.listName) {
      return this.$store.getters["bookmarks/getListByName"](this.listName);
    }
    const bookmarks: number[] = this.$store.state.bookmarks.bookmarks;
    return {
      name: "Bookmarks",
      list: [...bookmarks]
    };
  }

  private startFlashcardMode() {
    this.flashcardMode = true;
    this.flashcardIndex = 0;
  }

  private stopFlashcardmode() {
    this.flashcardMode = false;
    this.flashcardIndex = null;
  }
}
</script>
