<template lang="html">
  <div class="ListComp" v-bind:data-startlist="startlist">
    <ol>
      <li v-for="item in list">
        {{ item.message }}
      </li>
    </ol>
    <input v-model="newitem.message" />
    <button v-on:click="addItem"></button>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    startlist: {
      type: Array,
      default: function() {
        return [{ message: "Add items to me" }];
      }
    }
  },
  data: function() {
    return {
      newitem: { message: "Enter text here" },
      list: [].concat([this.startlist])
    };
  },
  mounted: function() {
    console.log(this.startlist);
  },
  methods: {
    addItem: function(e) {
      this.list = this.list.concat([Object.assign({}, this.newitem)]);
    }
  }
};
</script>

<style lang="scss" scoped>
ol {
  border: 1px solid grey;
}
</style>
