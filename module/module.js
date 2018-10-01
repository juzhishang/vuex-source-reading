import { forEachValue } from '../util'

// Base data struct for store's module, package with some attribute and method
// store的Module构造器
export default class Module {
  // 接收2个参数，分别是原始模块和运行时
  constructor (rawModule, runtime) {
    // 设置实例的运行时属性
    this.runtime = runtime
    // Store some children item
    // 设置实例的_children属性，默认是空对象（没有原型的）
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    // 设置实例的_rawModule属性
    this._rawModule = rawModule
    // rawState来源是原始模块的state属性
    const rawState = rawModule.state

    // Store the origin module's state
    // 设置实例的state属性，值来源是rawState方法的执行结果
    // 或者rawState本身，若不存在rawState，则是空对象
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }

  // 返回原始模块是否存在namespaced属性
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  // 在_children上添加子模块
  addChild (key, module) {
    this._children[key] = module
  }

  // 移除子模块
  removeChild (key) {
    delete this._children[key]
  }

  // 获取子模块
  getChild (key) {
    return this._children[key]
  }

  // 更新原始模块的namespaced、actions、mutations和getters
  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  // 遍历子模块，调用fn方法
  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  // 遍历原始模块的getters，调用fn
  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  // 遍历原始模块的actions，调用fn
  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  // 遍历原始模块的mutations,调用fn
  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
