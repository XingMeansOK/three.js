
// 用于处理事件相关的兼容性问题
function EventUtil() {}

Object.assign( EventUtil.prototype, {

  // 添加事件处理函数

  /*
    @param element dom对象
    @param type String 事件类型
    @param handler 事件处理函数
  */
  addHandler: function( element, type, handler ) {
    if (element.addEventListener) {  // chrome ff ie9+
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {  // IE 9-
        element.attachEvent('on' + type, handler);
    } else {  // DOM0
        element['on' + type] = handler;
    }
  },

  // 移除事件处理函数

  removeHandler: function (element, type, handler) {
      if (element.removeEventListener) {
          element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
          element.detachEvent('on' + type, handler);
      } else {
          element['on' + type] = null;
      }
  },
} )
