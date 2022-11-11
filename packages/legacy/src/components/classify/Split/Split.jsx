import { defineComponent } from 'vue'
import { createNamespace } from '../utils'

import './Split.less'

const [name, bem] = createNamespace('split')

export default defineComponent({
  name,

  props: {
    value: Number,
    decimal: {
      type: Number,
      default: 2,
    },
    disabled: Boolean,
  },

  data: () => ({
    record: {
      pageX: 0,
      pageY: 0,
      width: 0,
      height: 0,
      size: '',
    },
    innerSize: 0,
  }),

  computed: {
    sizePercentage() {
      return `${this.innerSize * 100}%`
    },
  },

  watch: {
    value: {
      immediate: true,
      handler() {
        this.innerSize = isNaN(Number(this.value)) ? 1 : this.value
      },
    },
  },

  methods: {
    mousedown(e) {
      if (this.disabled) return

      const split = this.$refs.split
      this.record.pageY = e.pageY
      this.record.width = split.clientWidth
      this.record.height = split.clientHeight
      this.record.size = this.innerSize

      window.addEventListener('mousemove', this.mousemove, { passive: true })
      window.addEventListener('mouseup', this.mouseup, { passive: true })
    },
    mousemove(e) {
      const size = parseFloat(this.record.size)
      const result = Math.max(Math.min(this.record.height * size + e.pageY - this.record.pageY, this.record.height), 0)
      this.innerSize = parseFloat((result / this.record.height).toFixed(this.decimal))
      this.$emit('input', this.innerSize)
    },
    mouseup(e) {
      window.removeEventListener('mousemove', this.mousemove, false)
      window.removeEventListener('mouseup', this.mouseup, false)
    },
    genSplitPoint() {
      if (Object.keys(this.$slots).length > 1) {
        return (
          <div class={bem('line')} onMousedown={this.mousedown}>
            <i class="el-icon-caret-right"></i>
            <i class="el-icon-caret-left"></i>
          </div>
        )
      }
    },
  },
  render(h) {
    return (
      <div class={bem()} ref="split">
        <div class={bem('before')} style={{ flexBasis: this.sizePercentage }}>
          {this.$slots.before}
        </div>
        {this.genSplitPoint()}
        <div class={bem('after')}>
          {this.$slots.after}
        </div>
      </div>
    )
  },
})
