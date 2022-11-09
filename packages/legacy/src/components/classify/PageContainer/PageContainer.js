import { Backtop } from 'element-ui'

import './PageContainer.less'

export default {
  name: 'PageContainer',

  props: {
    tag: {
      type: String,
      default: 'div',
    },
    backTop: Boolean,
    column: Boolean,
  },

  methods: {
    genBackTop() {
      return this.$createElement(Backtop, {
        props: {
          target: '.page-container',
          visibilityHeight: 200,
          right: 70,
          bottom: 80,
        },
      })
    },
  },

  render(h) {
    const { tag, backTop } = this

    return h(tag, {
      class: {
        'page-container': true,
        'page-container--column': this.column,
      },
    }, [
      backTop && this.genBackTop(),
      ...this.$slots.default,
    ].filter(Boolean))
  },
}
