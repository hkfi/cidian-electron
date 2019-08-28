<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <router-link to="/search">Search</router-link>
    </div>-->
    <Sidebar />
    <div v-if="isLoading">...Loading...</div>
    <div v-else class="ml-56">
      <router-view />
    </div>
  </div>
</template>

<style src="./assets/tailwind.css"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";
import Store from "electron-store";
const store = new Store();

@Component({
  components: {
    Sidebar
  }
})
export default class App extends Vue {
  private mounted() {
    console.log("App mounted");
  }

  private created() {
    this.$store.commit("setDictionary");
    const bookmarks = store.get("bookmarks");
    if (bookmarks) {
      this.$store.commit("setBookmarks", bookmarks);
    } else {
      store.set("bookmarks", []);
    }
  }

  get isLoading(): boolean {
    return this.$store.state.loading;
  }
}
</script>
