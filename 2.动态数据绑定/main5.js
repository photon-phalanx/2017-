/**
 * Created by Administrator on 2017/3/15.
 */

//这是一个简单的实现，是重新渲染了整棵树，并非局部更新，也不需要event

function Observer(data, vue) {
  this.data = data;
  this.walk(data, vue);
}

//walk遍历data对象，并且可以递归监听到深层
Observer.prototype.walk = function (obj, vue) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      //这是自己的属性，而不是原型的
      let val = obj[key];
      if (typeof val === 'object') {
        new Observer(val, vue);
      }
      this.convert(key, val, vue);
    }
  }
};

Observer.prototype.convert = function (key, val, vue) {
  console.log(key);
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log(val)
      return val;
    },
    set: function (newValue) {
      if (newValue === val) return;
      val = newValue;
      if (typeof newValue === 'object') {
        new Observer(newValue, vue);
      }
      vue.init(vue.data);
    }
  })
};

function Vue(data) {
  this.data = data;
  this.init(data);
  new Observer(data.data, this);
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
  if (!this.domModel) {
    this.domModel = dom.cloneNode(true);
  }
  let clonedNode = this.domModel.cloneNode(true);
  let children = clonedNode.childNodes;
  let reg = /{{(.*?)}}/g;
  for (let length = children.length, i = 0; i < length; i++) {
    if (children[i].nodeType === 3) continue;
    let content = children[i].innerHTML;
    content = content.replace(reg, function (whole, cat, pos, d) {
      return parseAndGet(data, cat);
    });
    children[i].innerHTML = content;
  }
  dom.innerHTML = clonedNode.innerHTML;
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

  setTimeout(function(){
    app.data.data.user.name = 'helloworld'
  },5000)
};