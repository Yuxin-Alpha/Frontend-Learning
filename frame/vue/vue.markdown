# Vue

## defineComponent

该函数功能只是返回了传入的对象，但是重要的是它返回了一个Vue3组件的定义，更好地支持TS

## h 函数

最终调用的其实是createVNode()

## watchEffect

具有依赖性，只会在传入的函数中响应式属性的值变化后再执行
