<template>
  <div class="p-2">
    <div class="block">
      <div class="flex">
        <div class="w-1/2">
          <span class="block text-6xl">{{dictionaryItem.s}}</span>
          <span class="block text-4xl">{{dictionaryItem.pd}}</span>
        </div>
        <div class="w-1/2">
          <div class="block">
            <AddRemoveButton
              :trueCondition="bookmarked"
              @add="bookmarkItem(dictionaryItem)"
              @remove="unbookmarkItem(dictionaryItem)"
            />
            <div class="relative inline-block dropdown">
              <div
                class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none"
              >
                <font-awesome-icon icon="angle-double-down" class="mr-2"></font-awesome-icon>
                <span>Add to list</span>
              </div>
              <div class="hidden absolute min-w-full dropdown-content bg-gray-900">
                <DropdownContent
                  v-for="(list,i) in lists"
                  :key="i"
                  :list="list"
                  :dictionaryItem="dictionaryItem"
                  @bookmark-item="bookmarkItem(dictionaryItem)"
                />
                <input
                  class="text-black placeholder-gray-600"
                  type="text"
                  placeholder="List name"
                  v-model="newListName"
                />
                <button @click="createList">Create a list</button>
              </div>
            </div>
          </div>
          <div class="block">
            <span class="text-2xl">Definitions:</span>
            <ul class="text-xl flex flex-wrap">
              <li v-for="def in dictionaryItem.d" :key="def" class="whitespace-normal">- {{def}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="block text-2xl" v-if="relevantDictionaryItems.length > 0">
      Relevant Characters:
      <ul class="flex flex-wrap">
        <li v-for="item in relevantDictionaryItems" :key="item.id" class="mr-1">
          <div
            @click="setRelevantCharacterItem(item)"
            class="border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3 cursor-pointer"
            :class="{'bg-gray-200': relevantCharacterItem && relevantCharacterItem.id === item.id}"
          >{{item.s}}</div>
        </li>
      </ul>
      <div class="mt-2" v-if="relevantCharacterItem">
        <div class="flex">
          <div class="w-1/2">
            <span class="block text-6xl">{{relevantCharacterItem.s}}</span>
            <span class="block text-4xl">{{relevantCharacterItem.pd}}</span>
          </div>
          <div class="w-1/2">
            <div class="block text-lg">
              <AddRemoveButton
                :trueCondition="relevantCharacterBookmarked"
                @add="bookmarkItem(relevantCharacterItem)"
                @remove="unbookmarkItem(relevantCharacterItem)"
              />
              <div class="relative inline-block dropdown">
                <div
                  class="bg-transparent hover:bg-gray-500 font-semibold text-blue-500 py-1 px-4 border rounded focus:outline-none"
                >
                  <font-awesome-icon icon="angle-double-down" class="mr-2"></font-awesome-icon>
                  <span>Add to list</span>
                </div>
                <div class="hidden absolute min-w-full dropdown-content bg-gray-900">
                  <DropdownContent
                    v-for="(list,i) in lists"
                    :key="i"
                    :list="list"
                    :dictionaryItem="relevantCharacterItem"
                    @bookmark-item="bookmarkItem(relevantCharacterItem)"
                  />
                  <input
                    class="text-black placeholder-gray-600"
                    type="text"
                    placeholder="List name"
                    v-model="newListName"
                  />
                  <button @click="createList">Create a list</button>
                </div>
              </div>
            </div>
            <div class="block">
              <span class="text-2xl">Definitions:</span>
              <ul class="text-xl flex flex-wrap">
                <li
                  v-for="def in relevantCharacterItem.d"
                  :key="def"
                  class="whitespace-normal"
                >- {{def}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Inject,
  Watch,
  Mixins
} from "vue-property-decorator";
import { IDictionaryItem, IList } from "../types";
import Store from "electron-store";
import DropdownContent from "@/components/DropdownContent.vue";
import AddRemoveButton from "@/components/AddRemoveButton.vue";
import bookmarksMixin from "@/mixins/bookmarksMixin";

@Component({
  components: {
    DropdownContent,
    AddRemoveButton
  }
})
export default class DictionaryItemDisplay extends Mixins(bookmarksMixin) {
  @Inject() store!: Store<number[]>;
  @Prop() dictionaryItem!: IDictionaryItem;

  private newListName: string = "";
  private relevantCharacterItem: IDictionaryItem | null = null;

  private setRelevantCharacterItem(dicItem: IDictionaryItem) {
    this.relevantCharacterItem = dicItem;
  }

  @Watch("dictionaryItem")
  private onDictionaryItemChange() {
    this.relevantCharacterItem = null;
  }

  private createList() {
    if (this.newListName.length > 0) {
      console.log(this.$store.state.bookmarks.lists);
      const listExists = this.$store.state.bookmarks.lists.some(
        (item: IList) => item.name === this.newListName
      );
      if (!listExists) {
        const newList = {
          name: this.newListName,
          list: []
        };
        const updatedLists = [...this.$store.state.bookmarks.lists, newList];
        this.$store.commit("bookmarks/setLists", updatedLists);
        this.store.set("lists", updatedLists);
        this.newListName = "";
      } else {
        console.log("list already exists");
      }
    }
  }

  get lists() {
    return this.$store.state.bookmarks.lists;
  }

  get definitionAsArray(): string[] {
    return [...this.dictionaryItem.s];
  }

  get relevantDictionaryItems(): IDictionaryItem[] {
    return this.$store.state.singleCharacterDictionary.filter(
      (item: IDictionaryItem) => {
        return (
          (this.definitionAsArray.includes(item.s) ||
            this.definitionAsArray.includes(item.s)) &&
          item.id !== this.dictionaryItem.id
        );
      }
    );
  }

  get bookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.dictionaryItem.id
    );
  }

  get relevantCharacterBookmarked(): boolean | null {
    if (this.relevantCharacterItem) {
      return this.$store.state.bookmarks.bookmarks.includes(
        this.relevantCharacterItem.id
      );
    } else {
      return null;
    }
  }
}
</script>
