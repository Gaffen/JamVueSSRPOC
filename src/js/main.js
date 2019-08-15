import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import ListComp from "./components/ListComp.vue";

Array.prototype.forEach.call(document.querySelectorAll(".HelloWorld"), function(
  elem
) {
  new Vue({
    render: h => h(HelloWorld, { props: { message: elem.dataset.message } })
  }).$mount(elem);
});

Array.prototype.forEach.call(document.querySelectorAll(".ListComp"), function(
  elem
) {
  new Vue({
    render: h => h(ListComp, { props: { startlist: elem.dataset.startlist } })
  }).$mount(elem);
});
