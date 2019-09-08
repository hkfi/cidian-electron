<template>
  <router-link v-if="type === 'route'" :to="path" class="text-blue-500 hover:text-blue-400">{{text}}</router-link>
  <a
    v-else-if="type === 'external'"
    @click="openExternal"
    class="text-blue-500 hover:text-blue-400 cursor-pointer"
  >{{text}}</a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { shell } from "electron";

@Component
export default class AppTextLink extends Vue {
  @Prop() private type!: "route" | "external";
  @Prop() private text!: string;
  @Prop() private path!: string;

  private openExternal() {
    if (this.type === "external") {
      shell.openExternal(this.path);
    }
  }
}
</script>
