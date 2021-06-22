<template>
  <div class="input-container" :class="errorMode && 'error'">
    <input
      type="text"
      :placeholder="placeholder"
      @keyup.enter="enterEvent"
      v-on:input="$emit('input', $event.target.value)"
    />
    <i v-if="errorMode" class="fas fa-exclamation-circle"></i>
  </div>
</template>

<script>
export default {
  props: {
    enterEvent: {
      type: Function,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    errorMode: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.input-container {
  width: 100%;
  padding: 8px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2c2c2c;

  input {
    border: 1px solid green;
    background-color: transparent;
    border: none;
    width: 100%;
    color: #f1f1f1;
  }

  i {
    color: red;
  }
}

.error {
  border-bottom: 1px solid red;
}
</style>
