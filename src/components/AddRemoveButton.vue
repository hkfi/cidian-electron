<template>
  <button
    class="bg-transparent hover:bg-gray-500 font-semibold py-1 px-4 border rounded focus:outline-none mr-1"
    @click="onButtonClick"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <font-awesome-icon icon="plus" class="text-blue-500" v-if="!trueCondition"></font-awesome-icon>
    <template v-else>
      <font-awesome-icon icon="minus" class="text-red-500" v-if="isHovered"></font-awesome-icon>
      <font-awesome-icon icon="check" class="text-green-500" v-else></font-awesome-icon>
    </template>
  </button>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop, Emit } from "vue-property-decorator";

@Component
export default class AddRemoveButton extends Vue {
  @Prop() trueCondition!: boolean;

  private isHovered: boolean = false;

  private onButtonClick() {
    if (this.trueCondition) {
      this.remove();
    } else {
      this.add();
    }
  }

  @Emit()
  private add() {}

  @Emit()
  private remove() {}
}
</script>
