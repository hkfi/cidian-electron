<template>
  <div class="bg-gray-700 text-white border-r border-black min-h-screen pt-8 w-16 fixed">
    <router-link
      v-for="sidebarMenuItem in sidebarMenuItems"
      :key="sidebarMenuItem.route"
      class="dropdown h-20 flex items-stretch px-4 py-2 text-white no-underline cursor-pointer hover:bg-gray-600"
      :class="{'bg-gray-600': currentRoute === sidebarMenuItem.route}"
      :to="sidebarMenuItem.route"
    >
      <div class="self-center text-2xl">
        <font-awesome-icon :icon="sidebarMenuItem.icon"></font-awesome-icon>
      </div>
      <div
        class="hidden dropdown-content text-gray-100 self-center ml-6 bg-gray-800 rounded p-1"
      >{{sidebarMenuItem.text}}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISidebarMenuItem } from "@/types";

@Component
export default class Sidebar extends Vue {
  private sidebarMenuItems: ISidebarMenuItem[] = [
    {
      route: "/",
      text: "Home",
      icon: "home"
    },
    {
      route: "/search",
      text: "Search",
      icon: "search"
    },
    {
      route: "/bookmarks",
      text: "Bookmarks",
      icon: "bookmark"
    },
    {
      route: "/translator",
      text: "Translator",
      icon: "language"
    }
  ];

  get currentRoute() {
    return this.$route.path;
  }
}
</script>
