<template>
  <div class="flex justify-center bg-gray-700 h-screen">
    <div class="text-center text-gray-100">
      <div class="text-6xl">
        <div class="block">Cidian</div>
        <div class="block">词典</div>
        <div class="block">詞典</div>
      </div>
      <p
        class="text-xl"
      >Cidian is a dictionary application to help you study Chinese more effectively.</p>
      <ul>
        <li>
          1. Look up words in the
          <AppTextLink type="route" text="dictionary " path="/search" />and
          <AppTextLink type="route" text="translator" path="/translator" />
        </li>
        <li>
          2.
          <AppTextLink type="route" text="Bookmark " path="/bookmarks" />and create lists of words you want to review
        </li>
        <li>
          3.
          <AppTextLink type="route" text="Study " path="/study" />the words via flashcards
        </li>
      </ul>
      <p class="text-xl">
        Check out the repo
        <AppTextLink
          type="external"
          text="here"
          path="https://github.com/hirokicodes/cidian-electron"
        />
      </p>
    </div>

    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppTextLink from "@/components/AppTextLink.vue";

@Component({
  components: {
    AppTextLink
  }
})
export default class Home extends Vue {}
</script>
