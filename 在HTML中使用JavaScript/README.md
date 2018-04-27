# 在HTML中使用JavaScript

## `<script>`元素
HTML4.01为`<script>`定义了下列6个属性:
- `async`: 可选，表示应该立即下载脚本，但不应妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本，只对外部脚本有效
- `defer`: 可选，表示脚本可以延长到文档完全被解析和显示之后再执行，只对外部脚本文件有效
- `charset`: 可选，表示通过`src`属性指定代码的字符集
- `src`: 可选，表示要执行的外部文件
- `language`: 已废除
- `type`: 可选，表示编写代码使用的脚本语言的内容类型

使用`<script>`元素的方式有两种：
- 直接在页面中嵌入`javaScript`代码，指定其`type`属性，被从上到下依次解释
    > 注意不要在代码中的任何地方出现`</script>`字符串，会认为这是结束`</script>`标签
```
<script type="text/javascript">
     function sayScript() {
       alert('</script>')
     }
 </script>
```
上面的代码浏览器在加载的时候回发生错误，当遇到`</script>`标签的时候会认为那是结束标签，可以通过转义字符`\`解决
```
<script type="text/javascript">
     function sayScript() {
       alert('<\/script>')
     }
 </script>
```

- 包含外部`javaScript`文件，需要`src`属性
`<script type="text/javascript" src="main.js"></script>`
    >注意：在带有`src`属性的`<script>`标签中不应该在嵌入其他代码，否则只会下载并执行外部脚本文件，嵌入的代码会被忽略
    
其`src`属性可以包含来自外部域的`javaScript`文件，可以通过这个实现`jsonp`跨域
### 标签的位置
现代web浏览器一般都把全部`javaScript`引用放在`body`元素内容的后面，这样在解析包含`javaScript`代码之前，页面的内容将完全呈现在浏览器之中

### 延迟脚本
HTML4.01为`<script>`标签定义了`defer`属性，脚本会被延迟到整个页面都解析完毕之后再运行，相当于告诉浏览器立即下载，但是延迟执行
   >注意：延迟脚本不一定会按照顺序执行，因此最好只包含一个延迟脚本，且`defer`只适用于外部脚本文件
### 异步脚本
HTML5为`<script>`标签定义了`async`属性，只适用于外部文件，并告诉浏览器立即下载文件，不一定按照先后顺序执行，可以不让页面等待脚本的下载和执行，可以异步加载页面其他内容

## 嵌入代码与外部文件
使用外部文件优势：
- 可维护性
- 可缓存
- 适应未来
## 文档模式
文档模式通过使用文档类型(`doctype`)来实现的，最初的两种文档模式是：混杂模式和标准模式，混杂模式会让`IE`的行为(包含非标准特性)与IE5相同，而标准模式可以让IE的行为更接近标准行为，主要影响css的呈现和js的解释执行

若在文档开始处没有发现文档类型声明，则所有浏览器默认使用混杂模式，但不同浏览器之间的差异很大，不能实现跨浏览器行为

   >对于标准模式，可以使用下面任何一种文档类型开启
- `<!DOCTYPE HTML PUBLIC "-//W3C// DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><!--HTML 4.01-->`
- `<!DOCTYPE html><!--HTML 5-->`
   > 对于准标准模式，则可以通过使用过渡型(`transitional`)或框架集型(`frameset`)文档类型来触发

## `<noscript>`元素
不支持`js`时，页面的提示
```
<noscript>
    <p>本页面需要浏览器启用javaScript</p>
</noscript>
```