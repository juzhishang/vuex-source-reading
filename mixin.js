export default function (Vue) {
  // 大版本
  const version = Number(Vue.version.split('.')[0])

  // vue 2.x，调用mixin全局注入，在beforeCreate钩子中调用vuexInit方法
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    // 这个思想好像是叫面向切面？
    // vue 1.x没有beforeCreate，类似钩子是init
    // 重写了Vue原型上的_init方法，就把vuexInit方法注入到init中了
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    // 获取创建vue实例时配置的选项
    const options = this.$options
    // 如果选项中传入了store
    if (options.store) {
      // options.store暂存到this.$store中，如果它本身是一个方法，就调用一下再赋值
      // 这样，组件中就可以通过this.$store获取store对象了
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    // options本身没有store的话，this.$store就取options.parent.$store
    // 这样大概是为了保证所有组件公用一个store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
