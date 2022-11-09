import Vue from 'vue'
import VcPreviewFile from './PreviewFile'

const data = Vue.observable({
  index: 0,
  fileList: [],
  show: false,
})

const PreviewFileExtended = Vue.extend({
  destroyed() {
    this.$el.remove()
  },
  render(h) {
    return h(VcPreviewFile, {
      ref: 'preview',
      props: {
        value: data.show,
        fileList: data.fileList,
        index: data.index,
      },
      on: {
        input: e => data.show = e,
      },
    })
  },
})

document.body.append(new PreviewFileExtended().$mount().$el)

function PreviewFile(fileList = [], index = 0) {
  data.index = 0
  data.fileList = fileList
  data.show = true
}

PreviewFile.Component = VcPreviewFile

export default PreviewFile
