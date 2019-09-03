<template>
  <div id="app">
    <Sidebar />
    <div v-if="isLoading">...Loading...</div>
    <div v-else class="ml-56">
      <router-view />
    </div>
  </div>
</template>

<style src="./assets/tailwind.css"></style>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";

// Electron store to store user data
import Store from "electron-store";
const store = new Store();

@Component({
  components: {
    Sidebar
  }
})
export default class App extends Vue {
  @Provide() store = store;

  private mounted() {
    console.log("App mounted");
  }

  private created() {
    this.$store.commit("init");
  }

  get isLoading(): boolean {
    return this.$store.state.loading;
  }
}
</script>
