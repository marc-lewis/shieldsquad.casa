<template>
  <section
    ref="reel"
    class="reel"
  >
    <div
      v-for="(card, i) in randomisedCards"
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
    cards: {
      type: Array,
      default: () => []
    },
    reelIndex: {
      type: Number,
      default: 0
    },
    selectedCard: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      wheelPos: 0,
      linearSpinAnimation: null,
      // rotate seven times per minute in seconds
      rotationSpeed: (360 * 7) / 60,
      selectSpinAnimation: null,
      selectSpinSpeed: (360 * 12) / 60,
      selectedSpinDuration: 10,
      selectedCardPosition: null,
      oldTime: null
    }
  },
  computed: {
    /**
     * The cards for the reel
     * @returns {array} A randomised order of cards
     */
    randomisedCards () {
      return this.shuffle(this.cards)
    },
    /**
     * Calculate the radius from the center of the wheel to the card
     * @returns number - The radius of the reel
     */
    radiusToCard () {
      if (this.cards.length === 2) {
        return 4
      } else {
        return 80 / 2 / Math.tan(Math.PI / this.cards.length)
      }
    }
  },
  watch: {
    selectedCard () {
      this.spinToSelectedCard()
    }
  },
  mounted () {
    this.setUpReel()
    window.setTimeout(() => {
      this.spinReelLinear()
      this.$emit('updateReelState',
        {
          reelIndex: this.reelIndex,
          spinType: 'linear'
        })
    }, 125 * this.reelIndex)
  },
  methods: {
    /**
     * @see {@link https://stackoverflow.com/a/2450976}
     * @param {array} array - The array to shuffle
     * @returns {Array} - A randomised array
     */
    shuffle (array) {
      const shuffleableArray = [...array]
      let currentIndex = shuffleableArray.length
      let temporaryValue, randomIndex

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = shuffleableArray[currentIndex]
        shuffleableArray[currentIndex] = shuffleableArray[randomIndex]
        shuffleableArray[randomIndex] = temporaryValue
      }

      return shuffleableArray
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
     * @param {Number} x - A value from 0 - 1
     * @returns Number - A value from 0 - 1
     * @see @link https://easings.net/#easeOutBack
     */
    easeOutCubic (x) {
      return 1 - Math.pow(1 - x, 3)
    },
    /**
     * Spin the wheel linearly
     */
    spinReelLinear () {
      // rate of 1 degree per second
      if (!this.oldTime) {
        this.oldTime = Date.now()
      }
      const deltaT = (Date.now() - this.oldTime) / 1000
      const deltaWheelPos = this.rotationSpeed * deltaT
      this.wheelPos += deltaWheelPos
      // avoid runaway integers for wheelpos
      if (this.wheelPos > 360) {
        this.wheelPos -= 360
      }
      this.$refs.reel.style.transform = `rotateX(-${this.wheelPos}deg)`
      this.oldTime = Date.now()
      this.linearSpinAnimation = requestAnimationFrame(this.spinReelLinear)
    },
    /**
     * Stop all spin animations
     */
    stopSpinAnimations () {
      cancelAnimationFrame(this.linearSpinAnimation)
      cancelAnimationFrame(this.selectSpinAnimation)
    },
    /**
     * Get the index of a card
     * @param {number} cardName - The cardName to lookup
     * @returns {number} - The index of cardName in the reel
     */
    getIndexOfCard (cardName) {
      for (let i = 0; i < this.randomisedCards.length; i++) {
        if (this.randomisedCards[i].name === cardName) {
          return i
        }
      }
    },
    /**
     * Highlight a card
     */
    highlightSelectedCard (cardIndex) {
      this.$refs.card[cardIndex].classList.add('reel__card--winner')
    },
    /**
     * The animation to spin the reel when a card is selected
     */
    selectedCardAnimation () {
      const deltaT = (Date.now() - this.oldTime) / 1000
      const timeRemaining = this.selectedSpinDuration - deltaT
      const animationProgress = (this.selectedSpinDuration - timeRemaining) / this.selectedSpinDuration
      const wheelProgress = this.easeOutCubic(animationProgress)
      const wheelEndPos = this.selectedCardPosition + 2160
      this.wheelPos = wheelProgress * wheelEndPos
      this.$refs.reel.style.transform = `rotateX(-${this.wheelPos}deg)`
      if (this.wheelPos >= wheelEndPos) {
        cancelAnimationFrame(this.selectedCardAnimation)
        this.highlightSelectedCard(this.getIndexOfCard(this.selectedCard))
      } else {
        this.selectSpinAnimation = window.requestAnimationFrame(this.selectedCardAnimation)
      }
    },
    /**
     * The controller for the selected card animation
     */
    spinToSelectedCard () {
      this.stopSpinAnimations()
      const cardIndex = this.getIndexOfCard(this.selectedCard)
      this.selectedCardPosition = (360 / this.cards.length) * cardIndex
      window.setTimeout(() => {
        this.oldTime = Date.now()
        this.selectSpinAnimation = this.selectedCardAnimation()
      }, 200 * this.reelIndex)
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
  animation: animateWinner steps(1, end) 1.5s normal infinite;
}

@keyframes animateWinner {
  0% {
    background: white;
    color: $zavaBlue;
  }
  12.5% {
    background: $zavaOrange;
    color: white;
  }
}
</style>
