# Vue

## defineComponent

该函数功能只是返回了传入的对象，但是重要的是它返回了一个compositonApi组件的定义，更好地支持TS

## h 函数

最终调用的其实是createVNode()

## watchEffect

具有依赖性，只会在传入的函数中响应式属性的值变化后再执行

```vue
<template>
    <div @click="handleClick">
        <span>{{ stateOne.name }}</span>
        <div>{{ stateTwo.text }}</div>
        <h5>{{ stateOne.name }}</h5>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, watch } from 'vue'
    export default defineComponent({
        setup() {
            const stateOne = reactive({
                name: 'zhangsan',
                age: 15
            })

            const stateTwo = reactive({
                text: 'hello world',
            })

            watch(() => stateOne.name, () => {
                console.log(stateOne.name)
            })

            const handleClick = () => {
                stateOne.age += 1
            }

            return {
                stateOne,
                stateTwo,
                handleClick
            }
        }
    })
</script>
```

```javascript
// 会生成一个大的WeakMap存放所有reactive的值
{
    // WeakMap中，每一项的key是一个reactive传入的对象，值是一个Map 
    {name: 'zhangsan',age: 15}: {
        // 每个Map中，key是reactive中的key，值是一个Set，存放着于该key相关的所有依赖 
        name: [effect1, effect2]
    },
    {text: 'hello world'} : {
        text: [effect_1]
    }
}

```
