<template>
  <div class="about">
    <h1>This is the search page</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Search extends Vue {
  private mounted() {
    console.log("Search page mounted");
  }
}
</script>
