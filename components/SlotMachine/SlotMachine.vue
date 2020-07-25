<template>
  <section class="slotMachine">
    <div class="slotMachine__face">
      <div
        v-for="(reel, i) in reels"
        :key="i"
        :class="'slotMachine__reel'"
      >
        <div
          v-for="(member, j) in reel"
          :key="member"
          :class="['slotMachine__card', `slotMachine__card--${j}`]"
        >
          {{ member }}
        </div>
      </div>
    </div>
    <zava-button
      v-if="!selectingMember"
      @click.native="selectMember"
    >
      SPIN
    </zava-button>
  </section>
</template>

<script>
import ZavaButton from '~/components/ZavaButton'

export default {
  name: 'SlotMachine',
  components: {
    ZavaButton
  },
  props: {
    members: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      enticingTimeouts: [],
      radiusToCard: (80 / 2) / Math.tan(Math.tan(Math.PI / this.members.length)),
      selectingMember: false
    }
  },
  computed: {
    reels () {
      const reels = []
      for (let i = 0; i < 4; i++) {
        reels.push(this.getRandomisedOrderOfMembers())
      }
      return reels
    }
  },
  mounted () {
    this.setUpSlotMachine()
    this.runEnticingAnimation()
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
     * @returns Array
     */
    getRandomisedOrderOfMembers () {
      const membersClone = this.members.map(x => x.name)
      return this.shuffle(membersClone)
    },

    /**
     * Position the cards within a reel
     * @returns {void}
     */
    setUpReel (reel) {
      const cards = reel.querySelectorAll('.slotMachine__card')
      const numOfCards = cards.length
      const spokeAngle = 360 / numOfCards

      reel.style.margin = `${this.radiusToCard}px 0`

      for (let i = 0; i < numOfCards; i++) {
        cards[i].style.transform = `rotateX(${(spokeAngle) * (i)}deg) translateZ(${this.radiusToCard}px)`
      }
    },

    /**
     * Apply a callback to all reels
     * @param {function} callback — Apply a callback to a reel
     * @returns {void}
     */
    applyToReels (callback) {
      const reels = document.querySelectorAll('.slotMachine__reel')
      for (let i = 0; i < reels.length; i++) {
        callback(reels[i], i)
      }
    },

    /*
     * @returns {void}
     */
    setUpSlotMachine () {
      this.applyToReels(this.setUpReel)
    },

    /**
     * Basic animations for the reels when landing on the view
     * @returns {void}
     */
    runEnticingAnimation () {
      this.applyToReels((reel, i) => {
        this.enticingTimeouts.push(window.setTimeout(() => {
          reel.classList.add('slotMachine__reel--entice')
        },
        800 * (i + 1)))
      })
    },

    clearEnticingAnimations () {
      for (let i = 0; i < this.enticingTimeouts.length; i++) {
        window.clearTimeout(this.enticingTimeouts[i])
      }
    },

    resetCardWinners () {
      const winningCards = document.querySelectorAll('.slotMachine__card--winner')
      if (winningCards) {
        winningCards.forEach((card) => {
          card.classList.remove('slotMachine__card--winner')
        })
      }
    },

    /**
     * Oh boy
     */
    selectMember () {
      this.selectingMember = true
      this.resetCardWinners()

      // spin all unilaterally
      this.applyToReels((reel, i) => {
        const computedStyle = window.getComputedStyle(reel)
        reel.style.transform = computedStyle.getPropertyValue('transform')
        this.clearEnticingAnimations()
        reel.classList.remove('slotMachine__reel--entice')
        reel.classList.add('slotMachine__reel--spin')
      })

      // get random member
      const selectedMember = this.members[Math.round(Math.random() * this.members.length)].name
      const reelIndicies = this.reels.map((reel) => {
        return reel.indexOf(selectedMember)
      })

      const animationPromises = []
      // spin reels to member
      this.applyToReels((reel, i) => {
        animationPromises.push(
          new Promise((resolve, reject) => {
            window.setTimeout(() => {
              const computedStyle = window.getComputedStyle(reel)
              reel.style.transform = computedStyle.getPropertyValue('transform')
              reel.classList.remove('slotMachine__reel--spin')
              const cardPosition = reelIndicies[i] * (360 / this.members.length) + 360
              reel.style.transform = `rotateX(-${cardPosition}deg)`
              resolve()
            },
            1500 + (800 * i))
          })
        )
      })

      Promise.all(animationPromises).then(() => {
        this.selectingMember = false
        this.applyToReels((reel, i) => {
          reel.querySelector(`.slotMachine__card--${reelIndicies[i]}`).classList.add('slotMachine__card--winner')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.slotMachine {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}
.slotMachine__face {
  animation: sway 20s ease-in-out infinite;
  display: flex;
  flex-direction: row;
  justify-content: center;
  perspective: 2000px;
  transform-style: preserve-3d;
}
.slotMachine__reel {
  height: 80px;
  position: relative;
  transform-style: preserve-3d;
  width: 120px;
}
.slotMachine__card {
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

.slotMachine__card--winner {
  animation: animateWinner steps(1, end) 1.75s normal infinite;
}

.slotMachine__reel--entice {
  animation: 5s infinite linear forwards rotateReelEnticingly;
}

.slotMachine__reel--spin {
  animation: 1s infinite linear forwards spinWheel;
}

@keyframes sway {
  0% {
    transform: rotateY(0deg);
  }
  25% {
    transform: rotateY(-10deg);
  }
  50% {
    transform: rotateY(0deg);
  }
  75% {
    transform: rotateY(10deg);
  }
}

@keyframes animateWinner {
  0% {
    background: white;
    color: $zavaBlue;
  }
  50% {
    background: $zavaOrange;
    color: white;
  }
}

@keyframes rotateReelEnticingly {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-240deg);
  }
  75% {
    transform: rotateX(-480deg);
  }
  100% {
    transform: rotateX(-719deg);
  }
}

@keyframes spinWheel {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-359deg);
  }
}

</style>
