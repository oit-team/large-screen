import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: Object,
    map: Object,
  },
  methods: {
    genContent(h) {
      const src = this.map[this.item.srcId] ? this.map[this.item.srcId].resUrl : ''
      switch (this.item.type) {
        case 'image':
          return <el-image class="flex-1" src={src} fit="cover" draggable="false"></el-image>
        case 'video':
          // <el-button class="play-button" icon="el-icon-caret-right" circle type="primary" onClick={this.togglePlay}></el-button>
          return (
            <div class="flex overflow-hidden flex-col flex-1">
              <video
                ref="video"
                class="object-cover h-full"
                src={src}
                controls
                playsinline
              ></video>
            </div>
          )
      }
    },
    togglePlay() {
      // const video = this.$refs.video
      // if (video.paused) {
      //   video.play()
      // } else {
      //   video.pause()
      // }
    },
  },
  render(h) {
    return (
      <div class="flex overflow-hidden relative flex-col h-full">
        {this.genContent(h)}
      </div>
    )
  },
})
