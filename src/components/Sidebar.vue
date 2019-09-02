<template>
  <div class="bg-gray-600 fixed text-white border-r border-black min-h-screen pt-8 w-56">
    <router-link
      v-for="sidebarMenuItem in sidebarMenuItems"
      :key="sidebarMenuItem.route"
      class="flex items-center px-4 py-2 text-white no-underline cursor-pointer hover:bg-gray-700"
      :to="sidebarMenuItem.route"
    >{{sidebarMenuItem.text}}</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface ISidebarMenuItem {
  route: string;
  text: string;
}

@Component
export default class Sidebar extends Vue {
  private mounted() {}
  private sidebarMenuItems: ISidebarMenuItem[] = [
    {
      route: "/",
      text: "Home"
    },
    {
      route: "/search",
      text: "Search"
    },
    {
      route: "/bookmarks",
      text: "Bookmarks"
    },
    {
      route: "/translator",
      text: "Translator"
    }
  ];
}
</script>
