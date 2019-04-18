/**
 *  实现深拷贝
 */
function deepCopy(obj){
  //判断是否是简单数据类型，
  if(typeof obj == "object"){
      //复杂数据类型
      var result = obj.constructor == Array ? [] : {};
      for(let i in obj){
          result[i] = typeof obj[i] == "object" ? deepCopy(obj[i]) : obj[i];
      }
  }else {
      //简单数据类型 直接 == 赋值
      var result = obj;
  }
  return result;
}