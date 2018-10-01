// 检测vue的开发者工具是否安装
// 如果安装了，window就存在__VUE_DEVTOOLS_GLOBAL_HOOK__属性
// 是一个包含下面属性的对象 {Vue: ƒ, on: ƒ, once: ƒ, off: ƒ, emit: ƒ}
const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
  // 没有安装devtool就直接返回
  if (!devtoolHook) return

  // 把devtoolHook对象挂到store._devtoolHook属性上
  store._devtoolHook = devtoolHook

  // 发射vuex的初始化事件
  // 这样开发者工具就能拿到store实例
  devtoolHook.emit('vuex:init', store)

  // 监听vuex的vuex:travel-to-state事件
  devtoolHook.on('vuex:travel-to-state', targetState => {
    // 替换状态为目标状态
    store.replaceState(targetState)
  })

  // 订阅state变化，mutation提交改变时触发回调
  store.subscribe((mutation, state) => {
    // devtool发射vuex的mutation事件
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}
