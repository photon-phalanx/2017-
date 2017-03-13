/**
 * Created by Administrator on 2017/3/13.
 */

// 这里看到别人使用了一个事件队列，感觉是一个不错的方法，学习
// 抽象成队列可以更好的添加删除事件
function Event() {
  this.events = {};
}

Event.prototype.on = function (key, callback) {
  this.events[key] ? this.events[key].push(callback) : this.events[key] = [callback];
};

Event.prototype.remove = function (key) {
  for (let attr in this.events) {
    if (this.events.hasOwnProperty(attr) && key === attr) {
      delete this.events[attr];
      return;
    }
  }
};

// 新旧值都传进来
Event.prototype.emit = function (key, ...arg) {
  if (this.events[key]) {
    this.events[key].forEach(function (item) {
      item(...arg);
    })
  }
}

function Observer(data) {
  this.data = data;
  this.walk(data);
  this.eventsBus = new Event();
}

//walk遍历data对象，并且可以递归监听到深层
Observer.prototype.walk = function (obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      //这是自己的属性，而不是原型的
      let val = obj[key];
      if (typeof val === 'object') {
        new Observer(val);
      }
      this.convert(key, val);
    }
  }
};

Observer.prototype.convert = function (key, val) {
  let that = this; // 重要
  Object.defineProperty(this.data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('你访问了' + key);
      return val;
    },
    set: function (newValue) {
      console.log('你设置了' + key);
      console.log('新的值为' + newValue);
      that.eventsBus.emit(key, newValue, val);
      if (newValue === val) return;
      val = newValue;
      if (typeof newValue === 'object') {
        new Observer(val);
      }
    }
  })
};

Observer.prototype.$watch = function (key, callback) {
  this.eventsBus.on(key, callback);
}

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

// 你需要实现 $watch 这个 API
app1.$watch('age', function (age, old) {
  console.log(`我的年纪变了，现在已经是：${age}岁了,以前是${old}岁`);
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'