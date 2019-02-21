# DOM&BOM

## DOM

DOM针对的使我们平时编码的文档对象，也就是整个`HTML`文件，`DOM`定义了一个`Node`接口，其中每个元素都可以看做是一个节点，这个节点接口提供了许多属性和方法，比如，`nodeName`就是当前节点的标签名，不同的节点有不同的`nodeType`属性，每个节点都有一个`childNodes`属性,这个属性是一个类数组对象。`DOM`树可以被看成由一系列双向指针连接起来的B+树

由此，我们可以引出某些`DOM`提供的方法：

```javascript
// 向目标节点的孩子节点最后插入一个孩子节点
var returnNode = someNode.appendChild(newNode)
// 向目标节点的孩子节点的第一位置插入一个孩子节点 
var returnNodeA = somNodeA.insertBefore(newNode, someNodeA.firstChild)
```

DOM节点类型：

| Node     | Desc         | NodeType |
| -------- | ------------ | -------- |
| Element  | 元素         | 1        |
| Text     | 纯文本内容   | 3        |
| Document | 整个文档对象 | 9        |



## BOM

