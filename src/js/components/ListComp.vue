<template lang="html">
  <div class="ListComp" v-bind:data-startlist="startlist">
    <ol>
      <li v-for="(item, index) in list">
        <div class="itemtext">
          <p>{{ item.message }}</p>
          <button v-on:click="removeItem(index)">&times;</button>
        </div>
      </li>
    </ol>
    <form v-on:submit.prevent>
      <input v-model="newitem.message" />
      <button v-on:click="addItem">Add</button>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    startlist: {
      type: String,
      default: JSON.stringify([{ message: "Add items to me" }])
    }
  },
  data: function() {
    return {
      newitem: { message: "Enter text here" },
      list: [].concat(JSON.parse(this.startlist))
    };
  },
  methods: {
    addItem: function(e) {
      this.list = this.list.concat([Object.assign({}, this.newitem)]);
    },
    removeItem: function(e) {
      this.list = this.list.slice(0, e).concat(this.list.slice(e + 1));
    }
  }
};
</script>

<style lang="scss" scoped>
ol {
  border: 1px solid grey;
  width: 100%;
  padding-right: 20px;
}
li {
  text-align: left;
  button {
    width: 20px;
    height: 20px;
    padding: 2px 0 0 0px;
    border: 0;
    border-radius: 50%;
  }
}
.itemtext {
  display: flex;
  align-items: center;
}
p {
  flex: 1;
}
button:focus {
  outline: 0;
}
</style>
