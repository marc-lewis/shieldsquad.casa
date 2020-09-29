<template>
  <section
    ref="reel"
    class="reel"
  >
    <div
      v-for="(card, i) in cards"
      :key="i"
      ref="card"
      :class="['reel__card', `slotMachine__card--${i}`]"
    >
      {{ card.name }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'Reel',
  props: {
    members: {
      type: Array,
      default: () => []
    },
    reelIndex: {
      type: Number,
      default: 0
    },
    cardWinner: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      wheelPos: 0,
      linearSpinAnimation: undefined,
      // rotate at 1 degree per second
      rotationSpeed: 360 / 60,
      oldTime: undefined
    }
  },
  computed: {
    /**
     * The cards for the reel
     * @returns array
     */
    cards () {
      return this.shuffle(this.members)
    },
    /**
     * Calculate the radius from the center of the wheel to the card
     */
    radiusToCard () {
      if (this.members.length === 2) {
        return 4
      } else {
        return 80 / 2 / Math.tan(Math.PI / this.members.length)
      }
    }
  },
  mounted () {
    this.setUpReel()
    this.spinReelLinear()
  },
  methods: {
    /**
     * @see {@link https://stackoverflow.com/a/2450976}
     * @returns Array
     */
    shuffle (array) {
      let currentIndex = array.length
      let temporaryValue, randomIndex

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    },
    /**
     * Position the cards within a reel
     * @returns {void}
     */
    setUpReel () {
      const spokeAngle = 360 / this.$refs.card.length
      this.$refs.reel.style.margin = `${this.radiusToCard}px 0`

      this.$refs.card.forEach((card, i) => {
        card.style.transform = `rotateX(${spokeAngle * i}deg) translateZ(${
          this.radiusToCard
        }px)`
      })
    },
    /**
     * @see @link https://easings.net/#easeOutBack
     */
    easeOutBack (x) {
      const c1 = 1.70158
      const c3 = c1 + 1

      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    },
    /**
     * @link https://www.youtube.com/watch?v=IAAKG57ouyM
     */
    rotateWheelToFinish (reel, currentPosition, cardPosition) {
      const spins = 2
      const spinEnd = spins * 360 + cardPosition
      // const secondsToSpin = 2
      window.requestAnimationFrame(() => {
        reel.style.transform = `rotateX(-${spinEnd}deg)`
      })
    },
    spinReelLinear () {
      // rate of 1 degree per second
      if (!this.oldTime) {
        this.oldTime = Date.now()
      }
      const deltaT = (Date.now() - this.oldTime) / 1000
      const deltaWheelPos = this.rotationSpeed * deltaT
      this.wheelPos += deltaWheelPos
      this.$refs.reel.style.transform = `rotateX(-${this.wheelPos}deg)`
      this.oldTime = Date.now()
      this.linearSpinAnimation = requestAnimationFrame(this.spinReelLinear)
    }
  }
}
</script>

<style lang="scss" scoped>
.reel {
  animation: reelSplit 10s ease-in-out infinite;
  height: 80px;
  padding: 0 2px;
  position: relative;
  transform-style: preserve-3d;
  width: 124px;
}

.reel__card {
  @include arial;
  align-items: center;
  // backface-visibility: hidden;
  background: white;
  border: 2px solid $zavaBlue;
  border-radius: 5px;
  color: $zavaBlue;
  display: flex;
  font-weight: bold;
  height: 80px;
  justify-content: center;
  position: absolute;
  text-transform: uppercase;
  transform-style: preserve-3d;
  width: 120px;
}

.reel__card--winner {
  animation: animateWinner steps(1, end) 1.75s normal infinite;
}

@keyframes animateWinner {
  0% {
    background: white;
    color: $zavaBlue;
  }
  20% {
    background: $zavaOrange;
    color: white;
  }
}
</style>
