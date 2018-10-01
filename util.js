/**
 * Get the first item that pass the test
 * by second argument function
 * 找到列表中满足过滤条件的第一个元素，indexOf的问题在于它不能传函数
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  // 基础类型或者函数直接返回obj
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  // 如果是对象，对象本身是可以设置属性的
  // 对缓存数组的元素，判断其original属性是否全等于obj
  // 如果是，说明有缓存，直接返回元素的copy属性
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  // 创建空副本
  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  // 添加缓存
  cache.push({
    original: obj,
    copy
  })

  // 遍历对象/数组
  Object.keys(obj).forEach(key => {
    // 递归调用赋值
    copy[key] = deepCopy(obj[key], cache)
  })
  //  最后返回副本
  return copy
}

/**
 * forEach for object
 * 对对象对每一个元素，调用函数
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

// 判断是否为对象类型，其实是对象或数组
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

// 判断是否为promise,其实不太准确，这个只是判断是否为thenable对象
export function isPromise (val) {
  return val && typeof val.then === 'function'
}

// 断言函数，不满足条件则抛出异常
export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}
