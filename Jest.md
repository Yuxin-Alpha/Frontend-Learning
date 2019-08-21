# Jest

单元测试：对单一的功能进行测试

```javascript
function expect(result) {
  return {
    toBe: function(actual) {
      if(result !== actual) {
        throw new Error('预期值和实际值不相等')
      }
    }
  }
}
function test(desc, fn) {
  try {
    fn()
  } catch (e) {
    console.log(`${desc}没有通过测试 ${e}`)
  }
}
test('测试3 + 3', () => {
  expect(add(3, 3).toBe(0))
})
```

