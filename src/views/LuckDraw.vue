<template>
  <div class="home">
    <div class="home-container">
      <div class="home-container-line">
        <div
          v-for="item in list.slice(0, 5)"
          :key="item.index"
          class="home-container-line-box"
          :class="{ selected: item.active }"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="home-container-line">
        <div
          v-for="item in list.slice(11, 12)"
          :key="item.index"
          class="home-container-line-box"
          :class="{ selected: item.active }"
        >
          {{ item.label }}
        </div>
        <div class="home-container-line-btn" :disable="isAnimate" @click="handleClick"></div>
        <div
          v-for="item in list.slice(5, 6)"
          :key="item.index"
          class="home-container-line-box"
          :class="{ selected: item.active }"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="home-container-line">
        <div
          v-for="item in Array.prototype.reverse.call(list.slice(6, 11))"
          :key="item.index"
          class="home-container-line-box"
          :class="{ selected: item.active }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { label: '小爱同学', val: 9, img: '', index: 8, active: false },
        { label: '安慕希酸奶', val: 10, img: '', index: 9, active: false },
        { label: '清空购物车', val: 11, img: '', index: 10, active: false },
        { label: '50元话费', val: 12, img: '', index: 11, active: false },
        { label: '未中奖', val: 1, img: '', index: 0, active: false },
        { label: '大保健', val: 2, img: '', index: 1, active: false },
        { label: 'iPhone13', val: 3, img: '', index: 2, active: false },
        { label: 'MacBook Pro', val: 4, img: '', index: 3, active: false },
        { label: 'MacBook Air', val: 5, img: '', index: 4, active: false },
        { label: '1积分', val: 6, img: '', index: 5, active: false },
        { label: '5积分', val: 7, img: '', index: 6, active: false },
        { label: '10积分', val: 8, img: '', index: 7, active: false },
      ],
      isAnimate: false, // 为 true时代表正在抽奖，当前抽奖未结束时点击抽奖按钮无效
      jumpIndex: Math.floor(Math.random() * 12), // 抽奖轮跳时的索引
      jumpingTime: 0, // 正在轮跳的时间
      jumpingTotalTime: 0, // 轮跳的时间总量，基于 duration 变量加上一个 0~1000 之间的随机数组成
      jumpingChange: 0, // 轮跳速率峰值，基于 velocity 变量加上一个 0~3 之间的随机数组成
      duration: 4500, // 持续时间
      velocity: 1000, // 速率
    }
  },
  methods: {
    handleClick() {
      if (this.isAnimate) return
      this.jumpingTime = 0
      this.jumpingTotalTime = Math.random() * 3000 + this.duration
      this.jumpingChange = Math.random() * 3 + this.velocity
      this.animateRound(this.jumpIndex)
    },

    animateRound(index) {
      this.isAnimate = true
      if (this.jumpIndex < this.list.length - 1) this.jumpIndex++
      if (this.jumpIndex >= this.list.length - 1) this.jumpIndex = 0

      this.jumpingTime += 100 // 每一帧执行 setTimeout 方法所消耗的时间

      // 如果当前时间大于时间总量后, 退出动画,  清算奖品
      if (this.jumpingTime >= this.jumpingTotalTime) {
        this.isAnimate = false
        if (index === 0) {
          alert('很遗憾没有抽到奖品，再接再厉哦~')
        } else {
          alert(`恭喜您抽到了：${this.list[index].label}`)
        }
        return
      }

      // 轮训动画
      if (index >= this.list.length - 1) {
        index = 0
        this.list[11].active = false
        this.list[index].active = true
        index -= 1
      } else {
        this.list[index].active = false
        this.list[index + 1].active = true
      }

      setTimeout(() => {
        this.animateRound(index + 1)
      }, this.easeOut(this.jumpingTime, 0, this.jumpingChange, this.jumpingTotalTime))
    },

    /**
     * 缓动函数，由快到慢
     * @param {number} t 当前时间
     * @param {Num} b 初始值
     * @param {Num} c 变化值
     * @param {Num} d 持续时间
     */
    easeOut(t, b, c, d) {
      // eslint-disable-next-line no-cond-assign
      if ((t = t / d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    },
  },
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.home {
  padding: 0;
  margin: 0;
  width: 100%;
  height: calc(100vh - 16px);
  background-image: linear-gradient(25deg, #30007c, #464995, #4d83ad, #41bfc4);
  @extend .center;
  &-container {
    width: 1000px;
    height: 600px;
    &-line {
      width: 100%;
      height: 198px;
      display: flex;
      &-box {
        flex: 1;
        overflow: hidden;
        margin: 5px 3px 5px 3px;
        @extend .center;
        background: #fff;
        transition: all .3s;
      }
      &-btn {
        position: relative;
        flex: 3;
        overflow: hidden;
        margin: 5px 3px 3px 3px;
        @extend .center;
        box-shadow: 0 1px 10px 0px #cf5531;
        background-image: linear-gradient(
            25deg,
            #cf5531,
            #d0853a,
            #cdaf43,
            #c4d84d
        );
        cursor: pointer;
        &:active {
          background-image: linear-gradient(
              25deg,
              #3f3e41,
              #6d6340,
              #9a8b39,
              #c9b629
          );
        }
        &::before {
          position: absolute;
          content: "点击抽奖";
          font-size: 2.5rem;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
.selected {
  background: rgba($color: #f6e58d, $alpha: 0.5);
  animation-name: twinkle;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
@keyframes twinkle {
  0%   {background:#ffbe76;}
  100% {background:#f6e58d;}
}
</style>
