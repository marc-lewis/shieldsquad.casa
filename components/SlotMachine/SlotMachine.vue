<template>
  <section class="slotMachine">
    <div class="slotMachine__face">
      <div class="slotMachine__reel">
        <div
          v-for="member in reelOne"
          :key="member"
          class="slotMachine__card"
        >
          {{ member }}
        </div>
      </div>
      <div class="slotMachine__reel">
        <div
          v-for="member in reelTwo"
          :key="member"
          class="slotMachine__card"
        >
          {{ member }}
        </div>
      </div>
      <div class="slotMachine__reel">
        <div
          v-for="member in reelThree"
          :key="member"
          class="slotMachine__card"
        >
          {{ member }}
        </div>
      </div>
    </div>
    <zava-button>
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
  computed: {
    reelOne () {
      return this.getRandomisedOrderOfMembers()
    },
    reelTwo () {
      return this.getRandomisedOrderOfMembers()
    },
    reelThree () {
      return this.getRandomisedOrderOfMembers()
    }
  },
  mounted () {
    this.setUpSlotMachine()
    this.animateSlotMachine()
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
     */
    setUpReel (reel) {
      const cards = reel.querySelectorAll('.slotMachine__card')
      const numOfCards = cards.length
      const spokeAngle = 360 / numOfCards
      const cardHeight = 80 // see height of .slotMachine__card
      const distanceToCard = (cardHeight / 2) / Math.tan(Math.tan(Math.PI / numOfCards))

      reel.style.margin = `${distanceToCard}px 0`
      for (let i = 0; i < numOfCards; i++) {
        cards[i].style.transform = `rotateX(${(spokeAngle) * (i)}deg) translateZ(${distanceToCard}px)`
      }
    },

    /*
     * Apply 3d transforms for cards
     * @returns {void}
     */
    setUpSlotMachine () {
      const reels = document.querySelectorAll('.slotMachine__reel')
      for (let i = 0; i < reels.length; i++) {
        this.setUpReel(reels[i])
      }
    },

    animateSlotMachine () {
      const reels = document.querySelectorAll('.slotMachine__reel')
      for (let i = 0; i < reels.length; i++) {
        window.setTimeout(() => {
          reels[i].classList.add('slotMachine__reel--rotate')
        },
        515 * i)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.slotMachine {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.slotMachine__face {
  display: flex;
  flex-direction: row;
  justify-content: center;
  perspective: 1000px;
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
  backface-visibility: hidden;
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

.slotMachine__reel--rotate {
  animation: 5s infinite linear rotateReel;
}

@keyframes rotateReel {
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
</style>
