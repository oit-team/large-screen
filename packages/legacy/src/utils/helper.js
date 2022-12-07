/**
 * 生成一个value是对象的结构树
 * @param {object} data 数据
 * @param {object} config 配置
 * @param {string} config.label label字段名
 * @param {string} config.children children字段名
 */
export function genCascadeTree(data, config) {
  return data.map((item) => {
    const formatted = {
      value: item,
      label: item[config.label],
    }
    if (item[config.children]) formatted.children = genCascadeTree(item[config.children], config)
    return formatted
  })
}

/**
 * 包装promise，使其永远返回resolve的一个数组，下标0返回成功内容，1返回失败内容
 * @param promise
 * @return {promise<array>}
 */
export function promiseWrapper(promise) {
  return promise
    .then(res => Promise.resolve([res, undefined]))
    .catch(err => Promise.resolve([undefined, err]))
}

/**
 * 注册ref上的方法
 * @param {string} ref
 * @param {array[string]} methods
 * @return {object}
 * @example
 * registerRefMethods('input', ['focus'])
 *
 * // 返回
 * {
 *   focus(...params) {
 *     return this.$refs.input.focus(...params)
 *   }
 * }
 */
export function registerRefMethods(ref, methods) {
  if (!Array.isArray(methods)) throw new TypeError('\'methods\' must be an array')

  const map = {}

  methods.forEach((name) => {
    map[name] = function (...params) {
      return this.$refs[ref][name](...params)
    }
  })

  return map
}

/*
图片加载为缩略图
*/
export function convertImageSize(img, size = 's') {
  return img && img.replace(/(.*)\./, `$1_${size}.`)
}

