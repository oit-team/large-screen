// 解决audio标签回显失败的问题
// 参考链接：
// https://blog.csdn.net/halo1416/article/details/103955910
// https://blog.csdn.net/liuben118/article/details/116266303

import { Quill } from 'vue-quill-editor'
const BlockEmbed = Quill.import('blots/block/embed')
class AudioBlot extends BlockEmbed {
  static create(value) {
    const node = super.create(value)
    node.setAttribute('src', value.url)
    node.setAttribute('controls', true)
    node.setAttribute('name', value.name)
    // node.setAttribute('controlsList', 'nodownload');
    return node
  }

  // 添加value获取当前的audio元素。拿到audio元素的属性。
  static value(domNode) {
    const value = {
      url: '',
      name: '',
    }
    // 这里要加判断。不然会显示undefined
    if (domNode.getAttribute('src')) {
      value.url = domNode.getAttribute('src')
      value.name = domNode.getAttribute('name')
    }
    return value
  }
}
AudioBlot.blotName = 'audio'
AudioBlot.tagName = 'audio'
export default AudioBlot
