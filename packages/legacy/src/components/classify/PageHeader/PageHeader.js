import { Divider, PageHeader } from 'element-ui'

export default {
  name: 'PageHeader',

  props: {
    title: String,
    content: String,
    formRef: String,
  },

  methods: {
    genPageHeader() {
      return this.$createElement(PageHeader, {
        props: {
          title: this.title,
          content: this.content,
        },
        on: {
          back: this.onBack,
        },
      })
    },
    onBack() {
      if (this.$listeners.back) {
        this.$emit('back')
      }
      else {
        this.$router.back()
      }
    },
  },

  render(h) {
    return h('div', {
      class: 'page-header',
    }, [
      this.genPageHeader(),
      h(Divider),
    ])
  },
}
