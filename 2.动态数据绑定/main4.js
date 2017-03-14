/**
 * Created by Administrator on 2017/3/14.
 */

function Vue(data) {
  this.data = data;
  this.init(data);
}

function parseAndGet(data, str) {
  let arr = str.split('.');
  let finalData = data.data;
  arr.forEach(function (i) {
    finalData = finalData[i];
  })
  return finalData;
}

Vue.prototype.init = function (data) {
  let dom = document.querySelector(data.el);
  let children = dom.childNodes;
  let reg = /{{(.*?)}}/g;
  for (let length = children.length, i = 0; i < length; i++) {
    if (children[i].nodeType === 3) continue;
    let content = children[i].innerHTML;
    content = content.replace(reg, function (whole, cat, pos, d) {
      return parseAndGet(data, cat);
    });
    children[i].innerHTML = content;
  }
};

window.onload = function () {
  let app = new Vue({
    el: '#app',
    data: {
      user: {
        name: 'youngwind',
        age: 25
      }
    }
  });
};