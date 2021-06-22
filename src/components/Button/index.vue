<template>
  <button
    :style="color && `border: 1px solid ${color}; color: ${color}`"
    @click="clickFunction"
  >
    <i v-if="iconText" :class="iconText" />
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    clickFunction: {
      type: Function,
      required: true,
    },
    iconText: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  background-color: transparent;
  border-radius: 5px;
  padding: 4px 8px;

  i {
    font-size: 12px;
  }
}
</style>
