<template>
  <div style="float: left;width:100%;">
    <audio
      ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate" 
      :src="activeUrl"
      @loadedmetadata="onLoadedmetadata"
      controls="controls">
    </audio>
    <div style="float: left;width: 100%;">
      <el-slider v-model="sliderTime" @mousedown.native="isChange = true" @mouseup.native="isChange = false" :step="step" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" @click="clickAudio" class="slider"></el-slider>
      <el-button ref="Btn" type="text" @click="startPlayOrPause">
        <span v-if="audio['playing'] === false" class="iconfont el-icon-csairel-start"></span>
        <span v-else-if="audio['playing'] === true" class="iconfont el-icon-csairel-stop"></span>
      </el-button>
      <el-tag type="info">{{realFormatSecond(audio.currentTime)}}</el-tag>
      <el-tag type="info">{{realFormatSecond(audio.maxTime)}}</el-tag>
    </div>
    <el-button @click="setSrc">
      修改路径
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'VueAudio',
    data () {
      return {
        activeUrl:'',
        activeIndex:0,
        test:'audio',
        audioList:['127.0.0.1:8000/console/play/audio.wav','../../assets/images/audio.wav','../../assets/images/audio.wav','../../assets/images/audio.wav'],
        isChange: false, //判断是否被拖动
        sliderTime: 0,
        step: 1,
        audio: {
          playing: false, // 音频是否处于播放状态
          currentTime: 0, // 音频当前播放时长
          maxTime: 0, //音频最大播放时常
        }
      }
    },
    created() {
    },
    mounted() {
      this.setSrc()
    },
    methods: {
      setSrc(){
        this.activeUrl = 'http://127.0.0.1:8000/console/play/audio.wav'
        console.log(this.activeUrl)
        this.$nextTick(() => {
        	this.$refs.audio.load()
          this.$refs.audio.play()
        })
      },
      clickAudio () {
        console.log('click')
      },
      // 当音频播放
      onPlay () {
        this.audio.playing = true
        console.log('onPlay')
      },
      // 当音频暂停
      onPause () {
        if(parseInt(this.audio.currentTime) == this.audio.maxTime){
          console.log('播放结束')
          this.setSrc()
        }
        this.audio.playing = false
        console.log('onPause')
      },
      // 音频播放
      play() {
        this.$refs.audio.play()
        console.log('play')
      },
      // 音频暂停
      pause() {
        this.$refs.audio.pause()
        console.log('pause')
      },
      // 控制按钮
      startPlayOrPause() {
        return this.audio.playing ? this.pause() : this.play()
      },
      // 获取音频时长
      onLoadedmetadata(res) {
        this.step = 100/res.target.duration
        this.audio.maxTime = parseInt(res.target.duration)
      },
      // 更新当前播放时间
      onTimeupdate(res) {
        if (this.isChange === true) {
          return
        }
        this.audio.currentTime = res.target.currentTime
        this.sliderTime = this.audio.currentTime / this.audio.maxTime * 100
      },
      // 将整数转为时分秒
      realFormatSecond(second = 0) {
        const secondType = typeof second
        if (secondType === 'number' || secondType === 'string') {
          second = parseInt(second)
          const hours = Math.floor(second / 3600)
          second = second - hours * 3600
          const mimute = Math.floor(second / 60)
          second = second - mimute * 60
          return `${hours}:${('0' + mimute).slice(-2)}:${('0' + second).slice(-2)}`
        } else {
          return '0:00:00'
        }
      },
      //格式化进度条
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index)
        return '进度条: ' + this.realFormatSecond(index)
      },
      //改变进度条进度
      changeCurrentTime(index) {
        this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
        this.isChange = false
      },
      nextAudio() {
        
      }
    },
    filters: {
      transPlayPause(value) {
        //return value ? '暂停' : '播放'
      },
    }
  }
</script>

<style scoped lang="scss">
  audio{
    height:0px;
    width:0px;
  }
</style>
