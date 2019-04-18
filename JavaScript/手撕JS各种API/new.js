/** 
 * 手写new操作符
 * 1. 它创建了一个全新的对象
 * 2. 它会被执行[[Prototype]]（也就是__proto__）链接。
 * 3. 它使this指向新创建的对象。
 * 4. 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
 * 5. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。
 */

function New(func) {
  var res = Object.create(null);
  if (func.prototype !== null) {
      res.__proto__ = func.prototype;
  }
  var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
  if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
      return ret;
  }
  return res;
}
var obj1 = New(A, 1, 2);

var obj2 = new A(1, 2);