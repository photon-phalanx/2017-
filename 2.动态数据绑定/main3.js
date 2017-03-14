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

function Observer(data, fatherObserver = null) {
  this.data = data;
  this.eventsBus = new Event();
  this.eventChainBus = new Event();
  this.fatherObserver = fatherObserver;
  this.walk(data);
}

//walk遍历data对象，并且可以递归监听到深层
Observer.prototype.walk = function (obj) {
  let that = this;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      //这是自己的属性，而不是原型的
      let val = obj[key];
      if (typeof val === 'object') {
        new Observer(val, this);
        // 监听这个val，这个val是一个object，子观察者会触发这个表示这个对象有变化
        if (!that.eventChainBus.events[val]) {
          that.eventChainBus.on(val, function (newValue, oldValue) {
            that.eventsBus.emit(key, newValue, oldValue);
            // 这个key其实是它在父元素里的名字
            if (that.fatherObserver) {
              that.fatherObserver.eventChainBus.emit(that, newValue, oldValue);
            }
          });
        }
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
      // console.log('你访问了' + key);
      return val;
    },
    set: function (newValue) {
      // console.log('你设置了' + key);
      // console.log('新的值为' + newValue);
      that.eventsBus.emit(key, newValue, val);
      if (that.fatherObserver) {
        that.fatherObserver.eventChainBus.emit(that, newValue, val);
      }
      if (newValue === val) return;
      if (typeof val === 'object') {
        that.eventChainBus.remove(val);
      }
      val = newValue;
      if (typeof newValue === 'object') {
        new Observer(newValue, that);
        // console.log(key)
        if (!that.eventChainBus.events[newValue]) {
          that.eventChainBus.on(newValue, function (newValue, oldValue) {
            that.eventsBus.emit(key, newValue, oldValue);
            // 这个key其实是它在父元素里的名字
            if (that.fatherObserver) {
              that.fatherObserver.eventChainBus.emit(that, newValue, oldValue);
            }
          });
        }
      }
    }
  })
};

Observer.prototype.$watch = function (key, callback) {
  this.eventsBus.on(key, callback);
}

let app2 = new Observer({
  name: {
    firstName: 'shaofeng',
    lastName: 'liang'
  },
  age: 25
});

app2.$watch('name', function (newName) {
  console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。