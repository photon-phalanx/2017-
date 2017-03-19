/**
 * Created by Administrator on 2017/3/19.
 */
function rotateFactory() {
  let count = 0;
  return function (index) {
    if (index === 5) {
      count++;
      return (count + index - 1) % 6;
    }
    return (count + index) % 6
  }
}
window.onload = function () {
  let rotateHandler = rotateFactory();
  let container = document.querySelector(".container");
  container.onclick = function () {
    let arr = Array.from(container.querySelectorAll("img"));
    arr.forEach(function (item, index) {
      item.style.animation = 'rotate' + rotateHandler(index) + ' 1s linear forwards';
    })
  }
};