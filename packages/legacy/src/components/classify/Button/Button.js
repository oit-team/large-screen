import { Button } from 'element-ui'
import { createNamespace, genSlots } from '../utils'

const [name, bem] = createNamespace('button')

export default {
  name,

  props: Button.props,

  render(h) {
    return h(
      Button,
      {
        props: {
          ...this.$props,
        },
      },
      genSlots(h, this.$slots),
    )
  },
}
