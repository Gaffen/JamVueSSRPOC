import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import ListComp from "./components/ListComp.vue";
import RecordPlayer from "./components/RecordPlayer.vue";

Array.prototype.forEach.call(document.querySelectorAll(".HelloWorld"), function(
  elem
) {
  new Vue({
    render: h =>
      h(HelloWorld, { props: JSON.parse(elem.nextElementSibling.innerHTML) })
  }).$mount(elem);
});

Array.prototype.forEach.call(document.querySelectorAll(".ListComp"), function(
  elem
) {
  new Vue({
    render: h =>
      h(ListComp, { props: JSON.parse(elem.nextElementSibling.innerHTML) })
  }).$mount(elem);
});

Array.prototype.forEach.call(
  document.querySelectorAll(".RecordPlayer"),
  function(elem) {
    new Vue({
      render: h =>
        h(RecordPlayer, {
          props: JSON.parse(elem.nextElementSibling.innerHTML)
        })
    }).$mount(elem);
  }
);
