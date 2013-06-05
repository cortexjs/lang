# neuro-lang

> Neuron lang

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using neuro-lang In Your Project

First, install 'neuro-lang' directly with `ctx install` (recommended)
	
	ctx install neuro-lang --save
	
or, you could update your package.json manually
    
    dependencies: {
        'neuro-lang': '<version-you-want>'
    }
    
and install dependencies
	
	ctx install
    
Then, use `require` method in your module
    
    var lang = require('neuro-lang');
    
Finally, start cortex server
    
    ctx server
    
Then cortex will care all the rest.


## API Documentation

lang.mix()
----

### Syntax
	lang.mix(receiver, sender, override, copylist)
	
### Returns
{Object} mix 之后的 receiver 引用

### Arguments

#### receiver
{Object} mix 操作的接收者

#### sender
{Object} mix 操作的发送者

#### override
{boolean} 如果 receiver 上已经存在某 key，是否要使用 sender 上的对应key，覆盖 receiver 上的值。默认为 false

#### copylist
{Array.<string>} 仅将 copylist 中的 key mix到 receiver 上


lang.guid()
----

### Returns
{number} 全局的唯一id值


lang.each()
----
与 for-in 不同，lang.each 不会遍历原型中的属性。

### Syntax
	lang.each(obj, fn, context)
	
### Arguments

#### obj
{Object|Array} 需要遍历的对象，

- {Object} 遍历非原型上的属性
- {Array} 简单的数组遍历

#### fn
{function(value, key)} 回调函数

##### value
{mixed} 遍历的值

##### key
{number|string} 数组下标（如果obj为对象） / 属性名（如果obj为数组）


lang.clone()
----

创建一个 shadow copy，并切断与之前对象的引用关系

### Syntax
	lang.clone(obj, filter)
	
### Arguments

#### obj
{Object} 被 clone 的对象

#### filter
{function(value, key, depth)} 过滤函数

##### value
{mixed} 当前复制的属性的值

##### key
{string} 当前复制的 key

##### depth
{number} 当前复制的属性，位于原始对象的深度。初始从 1 开始


lang.bind()
----

绑定一个函数的上下文

### Syntax
	lang.bind(fn, bind)
	
### Returns
{function()} 绑定后的函数

### Arguments(模式一)

#### fn
{function()} 需要绑定的函数

#### bind
{Object} fn 需要被绑定的 this

### Arguments(模式二)

#### fn
{string} 需要绑定的函数，对应的属性名

#### bind
{Object} 对应的对象


lang.makeArray(subject, host=)
----
将目标包装，转化成数组。常见的情形是用于某些参数的重载中。

这个方法完整的行为比较复杂，功能也会比较强大，下面会详细说明。

### Syntax
	lang.makeArray(subject, host=)
	
### Returns
{Array} 包装或者转化为的数组

### Arguments
#### subject
{mixed} 需要包装为数组的事物

- {Array} 若本身为数组，则不做任何转化，中间状态的数组为原数组
- {NodeList|lang.DOM} 若对象为 "类数组" 的对象，则会转化为纯净的数组（作为中间状态的数组）
- {other} 其他类型的变量，会转化为一个包含该变量的数组（作为中间状态的数组）

这里用到了 "转化" 这个词眼，是为了让读者容易理解其中工作的过程，这里数到的转化后的数组只是一个中间过程，最终的返回值还跟参数 `host` 有关。


#### host
{(Array|Object)=}

若该参数缺省，则直接会返回转化后的数组；

若该传递了该参数，则会尝试将中间状态的数组使用 lang.makeArray.merge 合并到 `host` 对象中。


lang.makeArray.merge(array, host)
----
将一个数组，合并到一个对象中

### Syntax
#### array
{Array} 需要合并到目标中的对象

#### host
{Array|Object} 


lang.pushUnique(hostArray, array)
----
将 `array` 加入到 `hostArray` 的后面，加入的过程中，会避免将 `hostArray` 中已经存在的元素再次加入。

#### hostArray
Type: `Array`

#### array
Type: `mixed`, 若 `array` 不是一个数组，则会将其包装为数组。

### Returns
`hostArray`

例如

	var host = [1, 2, 3, 4];
	var arr = [5, 3, 3, 2];
	lang.pushUnique(host, array);
	
	// host -> [1, 2, 3, 4, 5];
	
	
