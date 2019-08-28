<template lang="html">
  <p class="HelloWorld">
    {{ message }}
  </p>
</template>

<script>
export default {
  props: { message: { type: String, default: "Hello World!" } }
};
</script>

<style lang="scss" scoped>
p {
  border: 1px solid grey;
}
</style>
