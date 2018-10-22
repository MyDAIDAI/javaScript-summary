# 面向对象的程序设计

## 对象属性

- 数据属性（普通属性）

  - 包含一个数据值的位置，在这个位置可以读取与写入值，用户赋给它们什么，它们就返回什么，不会做额外的事情
  - 描述其行为
    - `[[Configurable]]`：是否可以通过`delete`删除属性，是否可以修改属性的特性，或者能否把属性修改为**访问器属性**，默认为`true`
    - `[[Enumerable]]`：是否可以通过`for-in`进行遍历，默认为`true`
    - `[[Writable]]`：是否可写，默认为`true`
    - `[[Value]]`：属性值，默认为`undefined`

- 内部属性

  - 数组的`length`属性，函数的`prototype`属性，`DOM`节点的`innerHTML`属性，用户对它们进行赋值后，再取值时，它不止会按照我们的预期做事，还会做一些格外的事情。另外，我们也很难改变它们的行为。比如说一个数组，它们的长度为10，当我们设置它的长度为11的时候，它就会增加一个`undefined`元素，再设置为9的时候，就会从后面删除两个元素。`DOM`的`innerHTML`，我们赋值时是一个字符串，再取出时，这字符串可能与原来的不一样，并且会在原元素上生成了不一样的子节点。

- 访问器属性

  - 允许用户在赋值或者取值时都经过预先设定的函数，从而实现内部属性的那一种特殊效果
  - 属性特性
    - `[[Configurable]]`：是否可以通过`delete`删除属性，是否可以修改属性特性，或者能否把属性修改为**数据属性**，默认为`true`
    - `[[Enumerable]]`：是否可以通过`for-in`进行遍历，默认为`true`
    - `[[Get]]`：在读取属性时调用的函数，默认为`undefined`
    - `[[Set]]`：在写入属性时调用的函数，默认为`undefined`

- 定义属性特性

  - 数据属性
    - 直接在对象中定义，`person.name = 'daidai'` ，其`[[Configurable]]`，`[[Enumerable]]`，`[[Writable]]`均为`true`，其`value`为`daidai`
    - 通过`Object.defineProperty`定义，`Object.defineProperty(object, 'name', {configurable: true | false, enumerable: true | false, writable: true | false, value: 'value'})`， 其`person.name = 'daidai'`可以定义为`Object.defineProperty(person, 'name', {configurable: true, enumerable: true, writable: true, value: 'daidai'})`
  - 访问器属性
    - 不能直接定义，需要使用`Object.defineProperty`
    - `Object.defineProperty(object, name, {configurable: true | false, enumerable: true | false, get: function () {}, set: function () {}})`
  - 注意：`configurable`一旦设置为`false`，则不能再修改为`true`，且与属性相关的特性也不能进行修改(`configurable`、`enumerable`)

- 定义多个属性

  - `Object.defineProperties()`

  - ```javascript
    var book = {};
    object.defineProperties(book, {
        _year: {
            value: 24
        },
        edition: {
            value: 1
        },
        year: {
            get: function () {},
            set: function (newValue) {}
        }
    })
    ```

- 读取属性特性
  - `Object.getOwnPropertyDescriptor(object, 'name')`
  - 返回一个对象，对象中包含属性类型的特性值

## 创建对象

- 工厂模式

  - 语法

    ```javascript
    function createPerson(name, age, job) {
        var o = new Object();
        o.name = name;
        o.age = age;
        o.job = job;
        return o;
    }
    var person1 = createPerson('person1', 10, 'teacher')
    var person2 = createPerson('person2', 20, 'student')
    ```

  - 缺点

    - 所创建的对象类型不能别识别（由于其都是由`new Object`所创建，其`constructor`均值向`Object`）

- 构造函数模式

  - 语法

    ```javascript
    function CreatePersonCon(name, age, job) {
        this.name = name;
        this.age = age;
        this.job = job;
        this.sayName = function () {
            console.log(this.name)
        }
    }
    var person3 = new CreatePersonCon('person3', 10, 'teacher')
    var person4 = new CreatePersonCon('person4', 20, 'student')
    ```

  - 使用`new`操作符调用构造函数创建过程

    - 创建一个新对象
    - 将构造函数的作用域赋值给新对象，将`this`指向该对象
    - 执行构造函数中的代码
    - 返回该对象

  - 其实例中的`constructor`属性指向其构造函数，可以用`instanceof`检测对象类型

    ```javascript
    person3 instanceof CreatePersonCon // true
    person4 instanceof CreatePersonCon // true
    person3 instanceof Object // true
    person4 instanceof Object // true
    ```

  - 将构造函数当做函数使用时

    - 在全局作用域中调用函数
      - `this`指向`window`，其属性与方法全部添加到`window`上
      - 没有返回值
    - 在另一个对象的作用域中调用
      - `this`指向该对象

  - 缺点

    - 在构造函数中添加的方法每次实例都会新建，不共享，会造成内存的浪费

      `person3.sayName === person4.sayName // false`

    - 解决办法

      - 使其指向同一个函数 `this.sayName = sayName`
      - 缺点：会造成全局作用域变量过多，使全局作用域杂乱

- 原型模式

  - 语法

    ```javascript
    function CreatePersonPro () {}
    CreatePersonPro.prototype.name = '1'
    CreatePersonPro.prototype.age = 29
    CreatePersonPro.prototype.job = 'Engineer'
    CreatePersonPro.prototype.sayName = function () {
        console.log(this.name)
    }
    var person1 = new CreatePersonPro()
    var person2 = new CreatePersonPro()
    person1.sayName() // 1
    person2.sayName() // 1
    person1.sayName === person2.sayName // true
    ```

  - 理解原型对象

    - 每一个函数创建时，都会创建一个`prototype`属性，该属性指向一个原型对象
    - 原型对象中自动获得一个`constructor`属性，指向该函数
    - 使用该函数创建实例后，实例内部会包含一个属性`__proto__`，该属性指向其构造函数的原型对象
    - 实例与构造函数的连接存在与实例的`__proto__`与构造函数的原型对象之间 `person1.__proto__ === CreatePersonPro.prototype`

  - 实例与构造函数之间关系确认

    - 部分浏览器不能访问实例中的`[[prototype]]`属性

    - 使用`isPrototypeOf()`方法确定是否是否存在关系

      ```javascript
      CreatePersonPro.isPrototypeOf(person1) // false
      CreatePersonPro.prototype.isPrototypeOf(person1) //  true
      ```

    - 使用`Object.getPrototypeOf()`，返回其`[[prototype]]`的值

      ```javascript
      Object.getPrototypeOf(person1) === CreatePersonPro // false
      Object.getPrototypeOf(person1) === CreatePersonPro.prototype // true
      ```

  - 实例与原型中的属性检测

    - 只存在与实例中的属性
      - `hasOwnProperty`，判断属性是否存在与实例中，存在返回`true`，否则返回`false`
      - `Object.keys()`，返回对象上所有可枚举的实例属性的字符串数组
    - 能够访问给定属性，无论该属性是存在于实例中还是存在在原型中
      - `in`，判断该属性是否可访问，可访问则返回`true`，否则返回`false`
      - `for - in`，遍历所有可访问的枚举属性
    - 对象实例属性会屏蔽对象原型属性，即使将其属性特性值设置为不可枚举，也不会访问原型中的同名属性

  - 更简单的原型语法

    - 点方法 `person.prototype.name = 'person1'`
    - 对象表示法 `person.prototype = {name: 'person1'}`
    - 对象表示法由于重写了`prototype`所指向的对象，所以其中的默认属性`constructor`会不存在，需要手动进行指定，否则其会向上查找`constructor`，上层`constructor`指向的是`Object`，虽然使用`instanceof`操作符还能返回正确的结果，但通过`constructor`已经无法确定对象的类型了
    - 手动指定的`constructor`属性，其`[[Enumerable]]`值为`true`，可以使用`for-in`进行遍历，可以通过`Object.defineProperty()`进行修改

  - 原型的动态性

    - 在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能立即从实例中反映出来
    - 重写原型对象
      - 调用构造函数的时候会为实例添加一个`[[prototype]]`属性，该属性是一个指针，指向构造函数的原型对象
      - 当构造函数的原型对象被重写，则构造函数中的`prototype`指向最新的原型对象，切断了构造函数与最初原型之间的联系，实例中的`[[prototype]]`仍然指向旧的原型对象。
      - 所以需要先进行原型对象的重写，再进行实例化

  - 原生对象的原型

    - 通过原生对象的原型，可以取得所有默认方法的引用，而且可以定义新的方法

  - 缺点

    - 原型中的属性与方法会在所有的实例中共享
    - 原型中的引用属性在实例中共享时，会存在较大问题（一个实例改变其值，则所有实例中的值均改变）

- 组合使用构造函数模式与原型模式

  - 构造函数模式用于定义实例属性

  - 原型模式用于定义方法和共享的属性

    ```javascript
    function Person(name, age, job) {
        this.name = name
        this.age = age
        this.job = job
        this.friends = ['shellby', 'court']
    }
    Person.prototype = {
        constructor: Person,
        sayName: function () {
            console.log(this.name)
        }
    }
    var person1 = new Person('person1', 11, 'teacher')
    var person2 = new Person('person2', 12, 'student')
    person1.friends // ['shellby', 'court']
    person1.friends.push('person1') // ['shellby', 'court', 'person1']
    person2.friends // ['shellby', 'court']
    person1.friends === person2.friends // false
    person1.sayName === person2.sayName // true
    ```

- 动态原型模式

  - 为了解决在组合使用构造函数模式与原型模式中，其构造函数与原型相互独立的问题

  - 将所有信息封装在构造函数中，并且在构造函数中初始化原型

  - **注意**：不能使用对象字面量创建原型

    - 原因：使用构造函数进行实例化的时候是先创建一个隐式原型指向构造函数的原型对象，再运行构造函数中的代码，所以在执行构造函数之后，构造函数中的`prototype`以及被重写，其实例中隐式原型与构造函数中的`prototype`所指的不是同一个对象。

    ```javascript
    function Person(name, age, job) {
        this.name = name
        this.age = age
        this.job = job
        Person.prototype = {
            sayName: function () {
                console.log(this.name)
            }
        }
    }
    var person1 = new Person('person1', 11, 'student')
    person1.sayName() // person1.sayName is not a function
    ```

- 寄生构造函数模式（少使用）

- 稳妥构造函数模式（少使用）

## 继承

- 原型链

  - 实例中的隐式原型`__proto__`指向其构造函数的原型对象

  - 可以将构造函数的原型对象指向上一级的实例即可现实继承

    ```javascript
    function SuperType () {
        this.property = true
    }
    SuperType.prototype.getSuperType = function () {
        console.log(this.property)
    }
    function SubType () {
        this.subproperty = false
    }
    SubType.prototype = new SuperType()
    SubType.prototype.getSubType = function () {
        console.log(this.subproperty)
    }
    var sub = new SubType()
    sub.getSuperType() // true
    ```

  - 继承关系

    ```javascript
    sub
    subproperty
    __proto__ --> SubType.prototype --> property
    								  __proto__ --> SuperType.prototype --> getSuper..
                                      getSubType                            construct.
    ```

  - 确定原型与实例的关系

    - `instanceof` 判断实例与构造函数的关系
    - `isPrototypeOf()`判断实例与构造函数原型的关系
      - 只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型

  - 谨慎的定义方法

    - 重新定义的方法会屏蔽继承来的同名方法
    - 应该先进行原型链的继承，再添加相应的方法，否则添加的方法会被覆盖而不存在
    - 在使用原型链继承之后，不能使用对象字面量创建原型方法，这样会导致原型被重写

  - 缺点

    - 父类构造函数中引用属性的值会被子类的实例所共享
    - 在创建子类实例的时候，不能向父类的构造函数中传递参数

- 借用构造函数

  - 由于使用原型链继承会共享其父类的引用属性，并且不能向父类中传值

  - 可以借用构造函数解决这个问题，在子类的构造函数中调用父类的构造函数，并将其`this`值进行传递

  - 当子类在进行实例化的过程中，就会获取`this`值并且将其传递给父类，并执行父类中的代码，依次将父类中的属性添加到当前实例的`this`环境中，而不是在原型中，因此不会被共享

  - 值传递

    - 在子类构造函数调用父类构造函数时，可以直接将要传递的值传入即可
    - 为了确保父类构造函数不会重写子类属性，应该在调用子类构造函数之后，再添加子类属性

    ```javascript
    function SuperType (name) {
        this.colors = ['red', 'blue', 'green']
        this.name = name
    }
    function SubType () {
        SuperType.call(this, 'sub')
    }
    ```

  - 缺点

    - 父类构造函数中的方法不能被复用

- 组合继承

  - 父类构造函数中的属性使用借用构造函数模式继承 `SuperType.call(this)`

  - 父类中的方法使用原型链继承  `SubType.prototype = new SuperType()`

    ```javascript
    function SuperType (name, age) {
        this.name = name
        this.age = age
    }
    SuperType.prototype.sayName = function () {
        console.log(this.name)
    }
    function SubType (name, age, job) {
        SuperType.call(this, name, age)
        this.job = job
    }
    SubType.prototype = new SuperType()
    ```

- 原型式继承

  - 使用场景：在不想创建构造函数，但又想让一个对象与另一个对象保持一致时使用，用于对象之间的复制

    ```javascript
    function object(o) {
        function F() {}
        F.prototype = o
        return new F()
    }
    ```

  - 与`Object.create()`行为一致，均在原型上继承

  - 缺点：属性与方法均在原型上继承，引用类型会被修改

- 寄生式继承

  - 在原型式继承的基础上，创建一个仅封装继承过程的函数，在函数内部以某种方式增强该对象，最后将其返回

  - 使用场景：主要用于不仅仅是复制对象，还需要在对象中添加新的属性与方法

    ```javascript
    function createAnother(original) {
        var clone = object(original)
        clone.sayHi = function () {
            console.log('hi')
        }
        return clone
    }
    ```

- 寄生组合式继承

  - 组合式继承缺点：调用了两次超类的构造函数

    ```javascript
    function SuperType(name) {
        this.name = name
        this.colors = ['blue', 'red', 'green']
    }
    SuperType.prototype.sayName = function () {
        console.log(this.name)
    }
    function SubType(name, age) {
        SuperType.call(this, this.name)  --> 第二次调用 SuperType()
        this.age = age
    }
    SubType.prototype = new SuperType()   --> 第一次调用 SuperType()
    SubType.prototype.sayAge = function () {
        console.log(this.age)
    }
    var sub = new SubType('sub', 11)
    
    ```

  - 寄生组合式继承：借用构造函数来继承属性，借用原型链的混成方式来继承方法

  - 基本思路：不必为了指定子类型的原型而调用超类的构造函数，我们所需要的无非就是一个超类型原型的副本，本质上，就是使用寄生式继承来继承超类型的原型，然后将结果指定给子类型的原型即可

    ```javascript
    function object(o) {
        function F() {}
        F.prototype = o
        return new F()
    }
    function SuperType(name) {
        this.name = name
        this.colors = ['red', 'green', 'blue']
    }
    SuperType.prototype.sayColors = function () {
        console.log(this.colors)
    }
    function SubType(name, age) {
        SuperType.call(this, name)
    	this.age = age
    }
    function inheritPrototype(subType, superType) {
        var prototype = object(superType.prototype)
    	prototype.constructor = subType
        subType.prototype = prototype
    }
    inheritPrototype(SubType, SuperType)
    var sub = new SubType('sub', 11)
    console.log(sub)
    
    age
    name
    colors
    __proto__ --> constructor --> subType
                  __proto__ --> sayColors
                                constructor --> SuperType
                                __proto__ --> Object
    ```

- 错误认识

  - `SubType.prototype = SuperType.prototype`
    - 直接将子类的原型指向父类的原型，那么在子类中的原型添加方法会导致父类原型被修改
  - 可以通过实例修改构造函数的原型（通过`__proto__`），但是**一般不会在实例中修改其构造函数的原型**





上面的内容来自 《javaScript 高级程序设计》