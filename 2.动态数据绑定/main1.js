/**
 * Created by Administrator on 2017/3/13.
 */
function Observer(data) {
    this.data = data;
    this.walk(data);
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
            if (newValue === val) return;
            else val = newValue;
        }
    })
};

let app1 = new Observer({
    name: 'youngwind',
    age: 25
});

let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science