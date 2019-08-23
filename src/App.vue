<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <router-link to="/search">Search</router-link>
    </div>-->
    <Sidebar />
    <div class="ml-56">
      <router-view />
    </div>
  </div>
</template>

<style src="./assets/tailwind.css"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "@/components/Sidebar.vue";

@Component({
  components: {
    Sidebar
  }
})
export default class App extends Vue {
  private mounted() {
    console.log("App mounted");
  }
}
</script>
