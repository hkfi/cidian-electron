import { Component, Vue, Inject } from "vue-property-decorator";
import { IDictionaryItem } from "@/types";
import Store from "electron-store";

@Component
export default class BookmarksMixin extends Vue {
  @Inject() store!: Store<number[]>;

  private bookmarkItem(dicItem: IDictionaryItem) {
    const updatedBookmarks = [
      ...this.$store.state.bookmarks.bookmarks,
      dicItem.id
    ];
    this.$store.commit("bookmarks/setBookmarks", updatedBookmarks);
    this.store.set("bookmarks", updatedBookmarks);
    this.$store.commit("bookmarks/appendBookmarkedDictionaryItem", dicItem);
  }

  private unbookmarkItem(dicItem: IDictionaryItem) {
    const filteredBookmarks = this.$store.state.bookmarks.bookmarks.filter(
      (id: number) => {
        return id !== dicItem.id;
      }
    );
    this.$store.commit("bookmarks/setBookmarks", filteredBookmarks);
    this.store.set("bookmarks", filteredBookmarks);
    this.$store.commit("bookmarks/removeBookmarkedDictionaryItem", dicItem.id);
    this.$store.commit(
      "bookmarks/removeAllDictionaryItemIdFromLists",
      dicItem.id
    );
  }
}
