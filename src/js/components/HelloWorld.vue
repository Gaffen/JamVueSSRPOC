<template lang="html">
  <p class="HelloWorld" v-bind:data-message="message">
    {{ message }}
  </p>
</template>

<script>
export default {
  props: { message: { type: String, default: "Hello World!" } },
  mounted: function() {
    console.log(this.message);
  }
};
</script>

<style lang="scss" scoped>
p {
  border: 1px solid grey;
}
</style>
