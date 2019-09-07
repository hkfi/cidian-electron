<template>
  <div class="flex flex-inline my-1">
    <AddRemoveButton
      :trueCondition="dictionaryItemInList"
      @add="addToList"
      @remove="removeFromList"
    />

    <div class="text-xl">{{list.name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import { IList, IDictionaryItem } from "../types";
import Store from "electron-store";
import AddRemoveButton from "@/components/AddRemoveButton.vue";

@Component({
  components: {
    AddRemoveButton
  }
})
export default class DropdownContent extends Vue {
  @Inject() store!: Store<number[]>;
  @Prop() private list!: IList;
  @Prop() private dictionaryItem!: IDictionaryItem;

  get dictionaryItemInList(): boolean {
    return this.list.list.includes(this.dictionaryItem.id) ? true : false;
  }

  get isBookmarked(): boolean {
    return this.$store.state.bookmarks.bookmarks.includes(
      this.dictionaryItem.id
    );
  }

  @Emit()
  private bookmarkItem() {}

  private addToList() {
    if (!this.isBookmarked) {
      this.bookmarkItem();
    }
    this.$store.commit("bookmarks/addDictionaryItemIdToList", {
      name: this.list.name,
      id: this.dictionaryItem.id
    });
  }

  private removeFromList() {
    this.$store.commit("bookmarks/removeDictionaryItemIdFromList", {
      name: this.list.name,
      id: this.dictionaryItem.id
    });
  }
}
</script>

